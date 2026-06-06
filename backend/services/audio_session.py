import asyncio
import logging
from dataclasses import dataclass, field
from typing import Dict, Set

logger = logging.getLogger(__name__)

@dataclass
class AudioSession:
    """Tracks state for an active WebSocket meeting audio session."""
    meeting_id: str
    last_sequence: int = -1
    utterance_count: int = 0
    total_audio_seconds: float = 0.0
    is_active: bool = True
    seen_sequences: Set[int] = field(default_factory=set)
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    
    def validate_sequence(self, seq: int) -> bool:
        """
        Check if sequence is valid (not duplicated, mostly in order).
        Returns True if valid, False if duplicate.
        """
        if seq in self.seen_sequences:
            logger.warning(f"Duplicate audio sequence {seq} for meeting {self.meeting_id}")
            return False
            
        if seq < self.last_sequence:
            logger.warning(f"Out-of-order sequence {seq} for meeting {self.meeting_id} (last: {self.last_sequence})")
            
        self.seen_sequences.add(seq)
        
        # To prevent unbounded growth for very long meetings, periodically clean up seen_sequences
        if len(self.seen_sequences) > 1000:
            min_seq = min(self.seen_sequences)
            for i in range(min_seq, min_seq + 500):
                self.seen_sequences.discard(i)
                
        return True


class AudioSessionManager:
    """Thread-safe manager for active audio sessions."""
    
    def __init__(self):
        self._sessions: Dict[str, AudioSession] = {}
        self._lock = asyncio.Lock()
        
    async def get_session(self, meeting_id: str) -> AudioSession:
        """Get or create an audio session."""
        async with self._lock:
            if meeting_id not in self._sessions:
                logger.info(f"Creating new audio session for meeting {meeting_id}")
                self._sessions[meeting_id] = AudioSession(meeting_id=meeting_id)
            return self._sessions[meeting_id]
            
    async def end_session(self, meeting_id: str):
        """End and cleanup an audio session."""
        async with self._lock:
            if meeting_id in self._sessions:
                session = self._sessions[meeting_id]
                session.is_active = False
                logger.info(
                    f"Ended audio session for meeting {meeting_id}. "
                    f"Total utterances: {session.utterance_count}, "
                    f"Audio processed: {session.total_audio_seconds:.1f}s"
                )
                del self._sessions[meeting_id]
