import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Employee")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    meetings = relationship("Meeting", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class Team(Base):
    __tablename__ = "teams"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=False)
    duration = Column(Integer, default=0)
    status = Column(String, default="processing")
    type = Column(String, default="standup")
    quality_score = Column(Integer, default=0)
    participants = Column(Text, default="[]")  # JSON string
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="meetings")
    events = relationship("MeetingEvent", back_populates="meeting")
    snapshots = relationship("AnalyzerSnapshot", back_populates="meeting")


class MeetingEvent(Base):
    __tablename__ = "meeting_events"
    id = Column(String, primary_key=True)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False, index=True)
    event_type = Column(String, nullable=False, index=True)  # speech, visual, insight, system
    sequence = Column(Integer, nullable=False, index=True)
    timestamp_utc = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    
    # Speech fields
    speaker_label = Column(String, nullable=True)
    text = Column(Text, nullable=True)
    speech_start_ms = Column(Integer, nullable=True)
    speech_end_ms = Column(Integer, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    confidence = Column(Float, nullable=True)
    language = Column(String, nullable=True)
    
    # Visual fields
    screenshot_path = Column(String, nullable=True)
    content_type = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    perceptual_hash = Column(String, nullable=True)
    
    # Insight fields
    insight_type = Column(String, nullable=True)
    content_json = Column(Text, nullable=True)
    
    # System fields
    system_event = Column(String, nullable=True)
    metadata_json = Column(Text, nullable=True)

    meeting = relationship("Meeting", back_populates="events")


class AnalyzerSnapshot(Base):
    __tablename__ = "analyzer_snapshots"
    id = Column(String, primary_key=True)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False, index=True)
    timestamp_utc = Column(DateTime, default=datetime.datetime.utcnow)
    channel = Column(String, nullable=False)  # extraction or summary
    
    prompt_text = Column(Text, nullable=False)
    prompt_tokens = Column(Integer, nullable=True)
    
    response_text = Column(Text, nullable=True)
    response_tokens = Column(Integer, nullable=True)
    
    action_items_json = Column(Text, nullable=True)
    decisions_json = Column(Text, nullable=True)
    risks_json = Column(Text, nullable=True)
    summary_text = Column(Text, nullable=True)
    
    latency_ms = Column(Integer, nullable=True)
    model_name = Column(String, nullable=True)
    cost_estimate = Column(Float, nullable=True)
    
    event_seq_start = Column(Integer, nullable=True)
    event_seq_end = Column(Integer, nullable=True)

    meeting = relationship("Meeting", back_populates="snapshots")


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="notifications")


class Integration(Base):
    __tablename__ = "integrations"
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=True)
    name = Column(String, nullable=False)
    connected = Column(Boolean, default=False)
    config_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ModelMetric(Base):
    __tablename__ = "model_metrics"
    id = Column(String, primary_key=True)
    model_version = Column(String, nullable=False)
    accuracy = Column(Float, nullable=False)
    inference_count = Column(Integer, default=0)
    avg_latency = Column(Float, default=0)
    failure_rate = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
