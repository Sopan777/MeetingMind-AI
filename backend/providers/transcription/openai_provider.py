import io
import logging
from typing import Optional, Dict, Any

from openai import AsyncOpenAI
from core.config import settings
from schemas.transcription import TranscriptionResult
from .base import TranscriptionProvider

logger = logging.getLogger(__name__)

class OpenAIWhisperProvider(TranscriptionProvider):
    """Transcription provider using standard OpenAI Whisper API."""
    
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY must be set in environment variables")
            
        self.client = AsyncOpenAI(
            api_key=self.api_key,
            base_url="https://api.openai.com/v1",
        )
        self.model = "whisper-1"
        logger.info(f"Initialized OpenAIWhisperProvider with model {self.model}")

    async def transcribe(self, audio_bytes: bytes, prompt: Optional[str] = None) -> Optional[TranscriptionResult]:
        if len(audio_bytes) < 100:
            return None
            
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = "audio.wav"
        
        safe_prompt = prompt[:200] if prompt else None
        
        try:
            kwargs = {
                "model": self.model,
                "file": audio_file,
                "response_format": "verbose_json",
                "language": "en"
            }
            if safe_prompt:
                kwargs["prompt"] = safe_prompt
                
            response = await self.client.audio.transcriptions.create(**kwargs)
            
            text = response.text.strip() if hasattr(response, 'text') else ""
            language = getattr(response, 'language', 'en')
            duration = getattr(response, 'duration', 0.0)
            
            if not text:
                return None
                
            return TranscriptionResult(
                text=text,
                language=language,
                duration_seconds=duration,
                provider="openai"
            )
        except Exception as e:
            logger.error(f"OpenAI transcription error: {e}", extra={"operation": "transcribe_openai"})
            return None

    async def health_check(self) -> Dict[str, Any]:
        return {
            "provider": "openai",
            "model": self.model,
            "configured": bool(self.api_key)
        }
