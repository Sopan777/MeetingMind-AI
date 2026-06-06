from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from core.config import settings
from app.database import Base

# We use the existing Base from app.database to ensure all models are registered
# But we create a new async engine for high-concurrency WebSocket persistence

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_async_db():
    """Dependency that provides an async database session."""
    async with AsyncSessionLocal() as session:
        yield session
