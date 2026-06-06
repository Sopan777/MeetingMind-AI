import logging
from core.config import settings
from .base import AnalyzerProvider
from .nvidia import NVIDIAAnalyzer
from .gemini import GeminiAnalyzer

logger = logging.getLogger(__name__)

def create_analyzer_provider() -> AnalyzerProvider:
    """Factory to create the analyzer provider based on settings."""
    
    provider_name = settings.ANALYZER_PROVIDER.lower()
    
    logger.info(f"Creating analyzer provider: {provider_name}")
    
    if provider_name == "nvidia":
        return NVIDIAAnalyzer()
    elif provider_name == "gemini":
        return GeminiAnalyzer()
    else:
        logger.warning(f"Unknown analyzer provider '{provider_name}', falling back to nvidia")
        return NVIDIAAnalyzer()
