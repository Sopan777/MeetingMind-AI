import uuid
import logging
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app import models
from schemas.analysis import MeetingInsights
from schemas.transcription import TranscriptionResult

logger = logging.getLogger(__name__)

class PersistenceService:
    """Handles asynchronous database operations for the real-time meeting pipeline."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def save_event(self, event) -> None:
        """
        Saves a single meeting event to the database.
        Note: event should be the Pydantic model schemas.events.MeetingEvent
        """
        db_event = MeetingEvent(
            id=event.id,
            meeting_id=event.meeting_id,
            event_type=event.event_type.value if hasattr(event.event_type, "value") else event.event_type,
            sequence=event.sequence,
            timestamp_utc=datetime.fromisoformat(event.timestamp_utc.replace('Z', '+00:00')) if isinstance(event.timestamp_utc, str) else event.timestamp_utc,
            
            speaker_label=event.speaker_label,
            text=event.text,
            speech_start_ms=event.speech_start_ms,
            speech_end_ms=event.speech_end_ms,
            duration_ms=event.duration_ms,
            confidence=event.confidence,
            language=event.language,
            
            screenshot_path=event.screenshot_path,
            content_type=event.content_type,
            description=event.description,
            perceptual_hash=event.perceptual_hash,
            
            insight_type=event.insight_type.value if hasattr(event.insight_type, "value") else event.insight_type,
            content_json=event.content_json,
            
            system_event=event.system_event,
            metadata_json=event.metadata_json
        )
        
        self.db.add(db_event)
        try:
            await self.db.commit()
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to persist event: {e}")
            raise
