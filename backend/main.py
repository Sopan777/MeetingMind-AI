import asyncio
import json
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.logging import setup_logging
from core.database import AsyncSessionLocal
from schemas.websocket import AudioMessage, ControlMessage
from schemas.events import MeetingEvent, EventType
from providers.transcription.factory import create_transcription_provider
from providers.analysis.factory import create_analyzer_provider
from services.meeting_state import MeetingStateManager
from services.analyzer_scheduler import AnalyzerScheduler
from services.persistence import PersistenceService

# Import the existing REST app to mount it
from app.main import app as rest_app

# Set up structured logging
setup_logging(settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

# Global session manager
session_manager = MeetingStateManager()

# Global schedulers (one per meeting)
schedulers: dict[str, AnalyzerScheduler] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up MeetingMind AI WebSocket Server...")
    
    # Create all database tables if they don't exist
    from core.database import engine
    from app.database import Base
    from app import models  # noqa: F401 — ensure all models are registered
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables verified/created.")
    
    # Health check providers on startup
    transcriber = create_transcription_provider()
    analyzer = create_analyzer_provider()
    logger.info(f"Transcriber health: {await transcriber.health_check()}")
    logger.info(f"Analyzer health: {await analyzer.health_check()}")
    
    yield
    
    logger.info("Shutting down...")

# Main FastAPI application for WebSockets
app = FastAPI(title="MeetingMind AI - Realtime", version="2.0.0", lifespan=lifespan)

# Mount the REST API
app.mount("/api", rest_app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.0.0"}

@app.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    """
    Main WebSocket endpoint for real-time meeting analysis using VAD utterance chunks.
    """
    await websocket.accept()
    logger.info("WebSocket client connected")

    # Initialize providers per connection
    transcription_provider = create_transcription_provider()
    analyzer_provider = create_analyzer_provider()
    
    current_meeting_id = None
    
    try:
        # Wait for initial connect message
        while True:
            data = await websocket.receive()
            if "text" in data:
                try:
                    msg = json.loads(data["text"])
                    if msg.get("type") == "start" and msg.get("meeting_id"):
                        current_meeting_id = msg["meeting_id"]
                        await session_manager.get_session(current_meeting_id)
                        if current_meeting_id not in schedulers:
                            schedulers[current_meeting_id] = AnalyzerScheduler(current_meeting_id)
                        await websocket.send_json({"type": "status", "status": "connected"})
                        logger.info(f"Session started for meeting {current_meeting_id}")
                        break
                    elif msg.get("type") == "ping":
                        await websocket.send_json({"type": "pong"})
                except Exception as e:
                    logger.warning(f"Error parsing initial WS message: {e}")
            else:
                logger.warning("Received binary data before start control message")
                
        # Main event loop
        db_session = AsyncSessionLocal()
        persistence = PersistenceService(db_session)
        
        while True:
            data = await websocket.receive()
            
            if "text" in data:
                try:
                    msg = json.loads(data["text"])
                    
                    if msg.get("type") == "ping":
                        await websocket.send_json({"type": "pong"})
                        
                    elif msg.get("type") == "audio":
                        # Metadata for the following binary frame
                        seq = msg.get("sequence", 0)
                        speech_start_ms = msg.get("speech_start_ms", 0)
                        speech_end_ms = msg.get("speech_end_ms", 0)
                        
                        # Wait for the actual audio binary frame
                        bin_data = await websocket.receive()
                        if "bytes" not in bin_data:
                            logger.error("Expected binary audio frame after audio metadata")
                            continue
                            
                        audio_chunk = bin_data["bytes"]
                        
                        state = await session_manager.get_session(current_meeting_id)
                        
                        # Validate sequence to prevent duplicates
                        if not state.validate_audio_sequence(seq):
                            continue
                            
                        state.last_audio_sequence = max(state.last_audio_sequence, seq)
                        
                        # Process audio
                        await websocket.send_json({"type": "status", "status": "processing"})
                        
                        # Provide recent transcript context to Whisper
                        prompt = state.timeline.get_speech_text()[-1000:] if state.timeline.total_events > 0 else None
                        
                        result = await transcription_provider.transcribe(audio_chunk, prompt)
                        
                        if result:
                            # 1. Create the speech event
                            import uuid
                            from datetime import datetime, timezone
                            
                            speech_event = MeetingEvent(
                                id=str(uuid.uuid4()),
                                meeting_id=current_meeting_id,
                                event_type=EventType.SPEECH,
                                sequence=-1, # Assigned by timeline
                                timestamp_utc=datetime.now(timezone.utc).isoformat(),
                                speaker_label="Speaker",
                                text=result.text,
                                speech_start_ms=speech_start_ms,
                                speech_end_ms=speech_end_ms,
                                duration_ms=int(result.duration_seconds * 1000),
                                language=result.language
                            )
                            
                            # 2. Append to timeline
                            state.timeline.append(speech_event)
                            state.total_audio_seconds += result.duration_seconds
                            
                            # 3. Send transcript to frontend
                            await websocket.send_json({
                                "type": "transcript",
                                "data": {
                                    "timestamp": datetime.now(timezone.utc).strftime("%H:%M:%S"),
                                    "speaker": "Speaker",
                                    "text": result.text,
                                }
                            })
                            
                            # 4. Trigger AnalyzerScheduler (non-blocking)
                            scheduler = schedulers[current_meeting_id]
                            scheduler.on_speech_event(state, analyzer_provider, websocket, persistence)
                            
                            # 5. Async persistence (fire and forget)
                            asyncio.create_task(persistence.save_event(speech_event))
                                
                        await websocket.send_json({"type": "status", "status": "recording"})
                        
                    elif msg.get("type") == "analyze_now":
                        state = await session_manager.get_session(current_meeting_id)
                        scheduler = schedulers[current_meeting_id]
                        scheduler.force_trigger(state, analyzer_provider, websocket, persistence)
                        
                    elif msg.get("type") == "stop":
                        logger.info(f"Client requested stop for meeting {current_meeting_id}")
                        break
                        
                except Exception as e:
                    logger.error(f"Error processing WS text frame: {e}")
                    
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected (meeting {current_meeting_id})")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        if current_meeting_id:
            await session_manager.end_session(current_meeting_id)
            if current_meeting_id in schedulers:
                # Let any running tasks finish, but remove from active dict
                # In a robust system, we would await scheduler tasks here.
                del schedulers[current_meeting_id]
        if 'db_session' in locals():
            await db_session.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
