import logging
from core.config import settings
from .base import TranscriptionProvider
from .groq import GroqWhisperProvider
from .openai_provider import OpenAIWhisperProvider
from .local import LocalWhisperProvider

logger = logging.getLogger(__name__)

def create_transcription_provider() -> TranscriptionProvider:
    """Factory to create the transcription provider based on settings."""
    
    provider_name = settings.TRANSCRIPTION_PROVIDER.lower()
    
    logger.info(f"Creating transcription provider: {provider_name}")
    
    if provider_name == "groq":
        return GroqWhisperProvider()
    elif provider_name == "openai":
        return OpenAIWhisperProvider()
    elif provider_name == "local":
        return LocalWhisperProvider()
    else:
        logger.warning(f"Unknown provider '{provider_name}', falling back to groq")
        return GroqWhisperProvider()
