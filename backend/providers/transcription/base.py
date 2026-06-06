import abc
from typing import Optional, Dict, Any
from schemas.transcription import TranscriptionResult

class TranscriptionProvider(abc.ABC):
    """Abstract base class for all transcription providers."""
    
    @abc.abstractmethod
    async def transcribe(
        self, 
        audio_bytes: bytes, 
        prompt: Optional[str] = None
    ) -> Optional[TranscriptionResult]:
        """
        Transcribe the given audio data.
        
        Args:
            audio_bytes: The raw audio bytes (typically WAV format).
            prompt: Optional preceding text to provide context to the model.
            
        Returns:
            TranscriptionResult if text was detected, None otherwise.
        """
        pass

    @abc.abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """
        Check the health and status of the transcription provider.
        
        Returns:
            Dictionary with health status details.
        """
        pass
