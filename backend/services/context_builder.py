import logging
from typing import Optional
from core.config import settings
from .meeting_timeline import MeetingTimeline
from schemas.events import EventType

logger = logging.getLogger(__name__)

class ContextBuilder:
    """Builds hierarchical context prompts for the LLM analyzer from the MeetingTimeline."""
    
    @staticmethod
    def build_extraction_prompt(timeline: MeetingTimeline) -> Optional[str]:
        """
        Builds the prompt for Channel 1 (action items, decisions, risks).
        Uses Tier 1 (recent events) only.
        """
        # Get the last N speech events
        recent_speech = timeline.get_recent(settings.TIER1_MAX_EVENTS, types=[EventType.SPEECH])
        
        if not recent_speech:
            return None
            
        # Optional: could also fetch visual events that occurred within the timeframe of these speech events
        # For now, just render the transcript
        
        prompt_lines = ["=== RECENT TRANSCRIPT ==="]
        prompt_lines.append(timeline.get_speech_text(since_seq=recent_speech[0].sequence - 1))
        
        prompt_lines.append("\n=== TASK ===")
        prompt_lines.append("Extract any NEW action items, decisions, or risks from the recent transcript.")
        prompt_lines.append("Only extract items that are explicitly stated. Do not invent items.")
        
        return "\n".join(prompt_lines)
        
    @staticmethod
    def build_summary_prompt(timeline: MeetingTimeline, current_summary: Optional[str]) -> Optional[str]:
        """
        Builds the prompt for Channel 2 (summary generation).
        Combines the previous summary with all new speech since that summary was created.
        """
        # If we have no previous summary, just summarize all speech so far
        if not current_summary:
            all_speech = timeline.get_speech_text()
            if not all_speech.strip():
                return None
            
            prompt_lines = ["=== MEETING TRANSCRIPT SO FAR ==="]
            prompt_lines.append(all_speech)
            prompt_lines.append("\n=== TASK ===")
            prompt_lines.append("Write a concise, running summary of the meeting so far. 2-5 sentences capturing key points.")
            return "\n".join(prompt_lines)
            
        # If we DO have a previous summary, combine it with recent speech
        # Find the last time we generated an insight (which includes summary generation)
        recent_speech_text = timeline.get_speech_text(since_seq=timeline.last_insight_seq)
        
        if not recent_speech_text.strip():
            # No new speech since last summary
            return None
            
        prompt_lines = ["=== PREVIOUS SUMMARY ==="]
        prompt_lines.append(current_summary)
        
        prompt_lines.append("\n=== NEW TRANSCRIPT ===")
        prompt_lines.append(recent_speech_text)
        
        prompt_lines.append("\n=== TASK ===")
        prompt_lines.append("Update the previous summary with the new information. Keep it concise, 2-5 sentences.")
        
        return "\n".join(prompt_lines)
