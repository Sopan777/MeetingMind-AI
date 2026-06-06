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
from providers.transcription.factory import create_transcription_provider
from providers.analysis.factory import create_analyzer_provider
from services.transcript_context import TranscriptContextManager
from services.audio_session import AudioSessionManager
from services.persistence import PersistenceService

# Import the existing REST app to mount it
from app.main import app as rest_app

# Set up structured logging
setup_logging(settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

# Global session manager
session_manager = AudioSessionManager()

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

    # Initialize providers per connection (they are lightweight wrappers)
    transcription_provider = create_transcription_provider()
    analyzer_provider = create_analyzer_provider()
    context_manager = TranscriptContextManager()
    
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
                        timestamp = msg.get("timestamp", "")
                        
                        # Wait for the actual audio binary frame
                        bin_data = await websocket.receive()
                        if "bytes" not in bin_data:
                            logger.error("Expected binary audio frame after audio metadata")
                            continue
                            
                        audio_chunk = bin_data["bytes"]
                        
                        session = await session_manager.get_session(current_meeting_id)
                        
                        # Validate sequence to prevent duplicates
                        if not session.validate_sequence(seq):
                            continue
                            
                        session.last_sequence = max(session.last_sequence, seq)
                        session.utterance_count += 1
                        
                        # Process audio
                        await websocket.send_json({"type": "status", "status": "processing"})
                        
                        prompt = context_manager.get_prompt()
                        result = await transcription_provider.transcribe(audio_chunk, prompt)
                        
                        if result:
                            # Update context and send to client
                            context_manager.add(result.text)
                            
                            transcript_data = {
                                "timestamp": timestamp,
                                "speaker": "Speaker",
                                "text": result.text,
                            }
                            
                            await websocket.send_json({
                                "type": "transcript",
                                "data": transcript_data,
                            })
                            
                            # Persist (non-blocking — DB errors must never break the real-time pipeline)
                            try:
                                await persistence.save_transcript(
                                    current_meeting_id, timestamp, "Speaker", result.text
                                )
                            except Exception as db_err:
                                logger.warning(f"DB save failed (non-critical): {db_err}")
                            
                            session.total_audio_seconds += result.duration_seconds
                            
                            # Trigger analysis if threshold reached
                            if session.utterance_count % settings.ANALYSIS_UTTERANCE_THRESHOLD == 0:
                                try:
                                    await trigger_analysis(analyzer_provider, context_manager, persistence, websocket, current_meeting_id)
                                except Exception as analysis_err:
                                    logger.warning(f"Analysis failed (non-critical): {analysis_err}")
                                
                        await websocket.send_json({"type": "status", "status": "recording"})
                        
                    elif msg.get("type") == "analyze_now":
                        await trigger_analysis(analyzer_provider, context_manager, persistence, websocket, current_meeting_id)
                        
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
        if 'db_session' in locals():
            await db_session.close()

async def trigger_analysis(analyzer, context_manager, persistence, websocket, meeting_id):
    """Helper to run analysis and send results."""
    full_text = context_manager.get_prompt()
    if not full_text:
        return
        
    insights = await analyzer.analyze(full_text)
    if insights:
        await websocket.send_json({
            "type": "insights",
            "data": insights.model_dump(),
        })
        await persistence.update_meeting_insights(meeting_id, insights)

if __name__ == "__main__":
    import uvicorn
    # In production, run with: uvicorn main:app --host 0.0.0.0 --port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
