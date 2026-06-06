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
        
    async def save_transcript(self, meeting_id: str, timestamp: str, speaker: str, text: str) -> models.Transcript:
        """Save a new transcript segment."""
        transcript = models.Transcript(
            id=str(uuid.uuid4()),
            meeting_id=meeting_id,
            speaker=speaker,
            timestamp=timestamp,
            text=text
        )
        self.db.add(transcript)
        await self.db.commit()
        await self.db.refresh(transcript)
        return transcript
        
    async def update_meeting_insights(self, meeting_id: str, insights: MeetingInsights):
        """Update meeting insights, avoiding duplicates where possible."""
        try:
            # Note: A more robust implementation would diff the insights and only insert new ones.
            # For simplicity in this real-time update, we'll append new ones based on simple heuristics
            # or just rely on the frontend to display the latest payload.
            
            # Save new action items (simple deduplication by exact task string)
            existing_actions_query = await self.db.execute(
                select(models.ActionItem.task).where(models.ActionItem.meeting_id == meeting_id)
            )
            existing_actions = {row[0] for row in existing_actions_query.all()}
            
            for ai in insights.action_items:
                if ai.task not in existing_actions:
                    new_item = models.ActionItem(
                        id=str(uuid.uuid4()),
                        meeting_id=meeting_id,
                        task=ai.task,
                        owner=ai.owner,
                        deadline=ai.deadline,
                        status="todo",
                        priority="medium"
                    )
                    self.db.add(new_item)
                    existing_actions.add(ai.task)
            
            # Save new decisions
            existing_dec_query = await self.db.execute(
                select(models.Decision.title).where(models.Decision.meeting_id == meeting_id)
            )
            existing_decs = {row[0] for row in existing_dec_query.all()}
            
            for dec in insights.decisions:
                if dec.decision not in existing_decs:
                    new_dec = models.Decision(
                        id=str(uuid.uuid4()),
                        meeting_id=meeting_id,
                        title=dec.decision[:50] + "..." if len(dec.decision) > 50 else dec.decision,
                        description=dec.decision,
                        decided_by="Meeting",
                        impact="medium"
                    )
                    self.db.add(new_dec)
                    existing_decs.add(dec.decision)
                    
            # Save new risks
            existing_risk_query = await self.db.execute(
                select(models.Risk.title).where(models.Risk.meeting_id == meeting_id)
            )
            existing_risks = {row[0] for row in existing_risk_query.all()}
            
            for risk in insights.risks:
                if risk.description not in existing_risks:
                    new_risk = models.Risk(
                        id=str(uuid.uuid4()),
                        meeting_id=meeting_id,
                        title=risk.description[:50] + "..." if len(risk.description) > 50 else risk.description,
                        description=risk.description,
                        severity="medium"
                    )
                    self.db.add(new_risk)
                    existing_risks.add(risk.description)
                    
            await self.db.commit()
        except Exception as e:
            logger.error(f"Error persisting insights for meeting {meeting_id}: {e}")
            await self.db.rollback()
