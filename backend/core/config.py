from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "MeetingMind AI"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./meetingmind.db"
    
    # Transcription settings
    TRANSCRIPTION_PROVIDER: str = "groq"  # local | groq | openai
    LOCAL_WHISPER_MODEL: str = "distil-large-v3"
    LOCAL_WHISPER_DEVICE: str = "cuda"
    LOCAL_WHISPER_COMPUTE_TYPE: str = "float16"
    GROQ_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    # LLM Analyzer settings
    ANALYZER_PROVIDER: str = "nvidia"  # nvidia | gemini
    NVIDIA_API_KEY: str = ""
    NVIDIA_API_URL: str = "https://integrate.api.nvidia.com/v1"
    NVIDIA_MODEL: str = "nvidia/llama-3.3-nemotron-super-49b-v1"
    GEMINI_API_KEY: str = ""
    
    # Application tuning
    TRANSCRIPT_CONTEXT_CHARS: int = 200
    ANALYSIS_INTERVAL_SECONDS: int = 30
    ANALYSIS_UTTERANCE_THRESHOLD: int = 15
    MAX_UTTERANCE_DURATION_SECONDS: int = 15
    
    # Security
    SECRET_KEY: str = "change-in-production"
    ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
