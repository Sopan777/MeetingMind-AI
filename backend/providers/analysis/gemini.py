import logging
import json
from typing import Optional, Dict, Any

from core.config import settings
from schemas.analysis import MeetingInsights
from .base import AnalyzerProvider

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a meeting analysis AI. You analyze meeting transcripts and extract structured insights.

Given the meeting transcript so far, extract the following:
1. Action Items (owner, task, deadline)
2. Decisions (decision, timestamp)
3. Risks (description, timestamp)
4. Summary (2-5 sentences capturing key points)

Rules:
- Only extract information that is explicitly stated or clearly implied.
- Do NOT invent or hallucinate information.
- If no items exist for a category, return an empty list.
- For deadlines, use "Not specified" if no deadline was mentioned."""

class GeminiAnalyzer(AnalyzerProvider):
    """Analyzes meeting transcripts using Google Gemini API."""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY must be set in environment variables")
            
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(
                'gemini-1.5-flash',
                system_instruction=SYSTEM_PROMPT
            )
            self._genai = genai
            logger.info("Initialized GeminiAnalyzer")
        except ImportError:
            logger.error("google-generativeai package is not installed")
            raise

    async def analyze(self, transcript_text: str) -> Optional[MeetingInsights]:
        if not transcript_text.strip():
            return None
            
        try:
            # Use structured outputs via JSON schema
            response = await self.model.generate_content_async(
                f"Analyze the following meeting transcript:\n\n{transcript_text}",
                generation_config=self._genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            
            if not response.text:
                return None
                
            parsed = json.loads(response.text)
            
            # Ensure schema matches our Pydantic models exactly
            # The model might return missing arrays as omitted keys, so we ensure they exist
            parsed.setdefault("action_items", [])
            parsed.setdefault("decisions", [])
            parsed.setdefault("risks", [])
            parsed.setdefault("summary", "")
            
            return MeetingInsights(**parsed)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini JSON: {e}")
            return None
        except Exception as e:
            logger.error(f"Gemini analysis error: {e}", extra={"operation": "analyze_gemini"})
            return None

    async def health_check(self) -> Dict[str, Any]:
        return {
            "provider": "gemini",
            "model": "gemini-1.5-flash",
            "configured": bool(self.api_key)
        }
