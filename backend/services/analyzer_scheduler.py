import asyncio
import logging
from datetime import datetime, timezone
import uuid

from core.config import settings
from .meeting_state import MeetingState
from .context_builder import ContextBuilder
from schemas.events import MeetingEvent, EventType, InsightType
from schemas.analysis import MeetingInsights
from providers.analysis.base import AnalyzerProvider

logger = logging.getLogger(__name__)

class AnalyzerScheduler:
    """
    Two-channel scheduler for LLM analysis.
    Channel 1: Extraction (Action Items, Decisions, Risks) - runs frequently
    Channel 2: Summary - runs less frequently, builds cumulative context
    """
    
    def __init__(self, meeting_id: str):
        self.meeting_id = meeting_id
        
        # Track when we last ran each channel
        self.last_extraction_utc: datetime = None
        self.last_summary_utc: datetime = None
        
        # Track utterances since last run
        self.utterances_since_extraction: int = 0
        self.utterances_since_summary: int = 0
        
        # Running tasks
        self._extraction_task: asyncio.Task = None
        self._summary_task: asyncio.Task = None
        
        # Current combined state to send to frontend
        self.current_insights = MeetingInsights(
            action_items=[], decisions=[], risks=[], summary=""
        )
        
    def on_speech_event(self, state: MeetingState, analyzer: AnalyzerProvider, websocket, persistence) -> None:
        """Called whenever a new speech event is added to the timeline."""
        self.utterances_since_extraction += 1
        self.utterances_since_summary += 1
        
        now = datetime.now(timezone.utc)
        
        # Check Channel 1: Extraction
        if self._should_extract(now):
            self._trigger_extraction(state, analyzer, websocket, persistence, now)
            
        # Check Channel 2: Summary
        if self._should_summarize(now):
            self._trigger_summary(state, analyzer, websocket, persistence, now)
            
    def force_trigger(self, state: MeetingState, analyzer: AnalyzerProvider, websocket, persistence) -> None:
        """User pressed 'Analyze Now'. Bypasses all thresholds."""
        now = datetime.now(timezone.utc)
        self._trigger_extraction(state, analyzer, websocket, persistence, now)
        self._trigger_summary(state, analyzer, websocket, persistence, now)

    def _should_extract(self, now: datetime) -> bool:
        if self._extraction_task and not self._extraction_task.done():
            return False # Already running
            
        if self.utterances_since_extraction >= settings.EXTRACTION_UTTERANCE_THRESHOLD:
            if not self.last_extraction_utc or (now - self.last_extraction_utc).total_seconds() >= settings.ANALYZER_MIN_INTERVAL_SECONDS:
                return True
        return False
        
    def _should_summarize(self, now: datetime) -> bool:
        if self._summary_task and not self._summary_task.done():
            return False # Already running
            
        if self.utterances_since_summary >= settings.SUMMARY_UTTERANCE_THRESHOLD:
            if not self.last_summary_utc or (now - self.last_summary_utc).total_seconds() >= settings.ANALYZER_MIN_INTERVAL_SECONDS:
                return True
        return False
        
    def _trigger_extraction(self, state: MeetingState, analyzer: AnalyzerProvider, websocket, persistence, now: datetime) -> None:
        self.utterances_since_extraction = 0
        self.last_extraction_utc = now
        
        prompt = ContextBuilder.build_extraction_prompt(state.timeline)
        if not prompt:
            return
            
        self._extraction_task = asyncio.create_task(
            self._run_extraction_task(prompt, state, analyzer, websocket, persistence)
        )
        
    def _trigger_summary(self, state: MeetingState, analyzer: AnalyzerProvider, websocket, persistence, now: datetime) -> None:
        self.utterances_since_summary = 0
        self.last_summary_utc = now
        
        prompt = ContextBuilder.build_summary_prompt(state.timeline, self.current_insights.summary)
        if not prompt:
            return
            
        self._summary_task = asyncio.create_task(
            self._run_summary_task(prompt, state, analyzer, websocket, persistence)
        )
        
    async def _run_extraction_task(self, prompt: str, state: MeetingState, analyzer: AnalyzerProvider, websocket, persistence) -> None:
        try:
            logger.info(f"Running extraction channel for {self.meeting_id}...")
            # Note: We are using the main analyzer which currently returns everything. 
            # In a true split, we'd have a specific extraction prompt for the LLM.
            # For now, we reuse the existing prompt but we only update the extraction fields.
            insights = await analyzer.analyze(prompt)
            if insights:
                # Merge into current state
                self.current_insights.action_items = insights.action_items
                self.current_insights.decisions = insights.decisions
                self.current_insights.risks = insights.risks
                
                # Send to frontend
                await websocket.send_json({
                    "type": "insights",
                    "data": self.current_insights.model_dump(),
                })
                
                # Log event to timeline
                insight_event = MeetingEvent(
                    id=str(uuid.uuid4()),
                    meeting_id=self.meeting_id,
                    event_type=EventType.INSIGHT,
                    sequence=-1, # Will be set by timeline
                    timestamp_utc=datetime.now(timezone.utc).isoformat(),
                    insight_type=InsightType.ACTION_ITEM, # Representing an extraction run
                    content_json=insights.model_dump_json()
                )
                state.timeline.append(insight_event)
                
                # We could also persist an AnalyzerSnapshot here
                
        except Exception as e:
            logger.error(f"Extraction task failed: {e}")
            
    async def _run_summary_task(self, prompt: str, state: MeetingState, analyzer: AnalyzerProvider, websocket, persistence) -> None:
        try:
            logger.info(f"Running summary channel for {self.meeting_id}...")
            insights = await analyzer.analyze(prompt)
            if insights and insights.summary:
                # Update current summary
                self.current_insights.summary = insights.summary
                
                # Send to frontend
                await websocket.send_json({
                    "type": "insights",
                    "data": self.current_insights.model_dump(),
                })
                
                # Log event
                insight_event = MeetingEvent(
                    id=str(uuid.uuid4()),
                    meeting_id=self.meeting_id,
                    event_type=EventType.INSIGHT,
                    sequence=-1,
                    timestamp_utc=datetime.now(timezone.utc).isoformat(),
                    insight_type=InsightType.SUMMARY,
                    content_json=insights.summary
                )
                state.timeline.append(insight_event)
                
        except Exception as e:
            logger.error(f"Summary task failed: {e}")
