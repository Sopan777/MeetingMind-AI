import abc
from typing import Optional, Dict, Any
from schemas.analysis import MeetingInsights

class AnalyzerProvider(abc.ABC):
    """Abstract base class for all meeting analyzer providers."""
    
    @abc.abstractmethod
    async def analyze(self, transcript_text: str) -> Optional[MeetingInsights]:
        """
        Analyze the full transcript text and extract insights.
        
        Args:
            transcript_text: The formatted transcript string.
            
        Returns:
            MeetingInsights if successful, None otherwise.
        """
        pass

    @abc.abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """
        Check the health and status of the analyzer provider.
        
        Returns:
            Dictionary with health status details.
        """
        pass
