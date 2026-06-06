from dataclasses import dataclass

@dataclass(frozen=True)
class TranscriptionResult:
    text: str
    language: str
    duration_seconds: float
    provider: str
