import collections
from typing import Optional
from core.config import settings

class TranscriptContextManager:
    """Manages the rolling context window of recent transcripts to provide hints to Whisper."""
    
    def __init__(self, max_chars: int = None):
        self.max_chars = max_chars if max_chars is not None else settings.TRANSCRIPT_CONTEXT_CHARS
        self.segments = collections.deque()
        self.current_length = 0
        
    def add(self, text: str):
        """Add a new transcript segment and evict old ones if over budget."""
        if not text:
            return
            
        text = text.strip() + " "
        self.segments.append(text)
        self.current_length += len(text)
        
        while self.current_length > self.max_chars and self.segments:
            removed = self.segments.popleft()
            self.current_length -= len(removed)
            
    def get_prompt(self) -> Optional[str]:
        """Return the current context as a single string."""
        if not self.segments:
            return None
        return "".join(self.segments).strip()
    
    def clear(self):
        """Clear the context window."""
        self.segments.clear()
        self.current_length = 0
