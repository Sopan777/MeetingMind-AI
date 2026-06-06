from pydantic import BaseModel
from typing import Optional, Any, Dict, List

# Client to Server Messages

class AudioMessage(BaseModel):
    type: str = "audio"
    meeting_id: Optional[str] = None
    sequence: int
    timestamp: str

class ControlMessage(BaseModel):
    type: str  # 'ping', 'start', 'stop', 'analyze_now'
    meeting_id: Optional[str] = None


# Server to Client Messages

class TranscriptMessage(BaseModel):
    type: str = "transcript"
    data: Dict[str, Any]  # timestamp, speaker, text

class InsightsMessage(BaseModel):
    type: str = "insights"
    data: Dict[str, Any]  # action_items, decisions, risks, summary

class StatusMessage(BaseModel):
    type: str = "status"
    status: str  # connected, processing, recording

class ErrorMessage(BaseModel):
    type: str = "error"
    message: str
