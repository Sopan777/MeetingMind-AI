import logging
import json
from datetime import datetime
from typing import Any, Dict

class StructuredFormatter(logging.Formatter):
    """Formats log records as JSON with structured fields."""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Extract exc_info
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        # Add any extra fields passed in via `extra={...}`
        for key, value in record.__dict__.items():
            if key not in logging.LogRecord(None, None, "", 0, "", (), None).__dict__:
                log_data[key] = value
                
        return json.dumps(log_data)

def setup_logging(level: str = "INFO"):
    """Initialize structured JSON logging across the application."""
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Clear existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    handler = logging.StreamHandler()
    handler.setFormatter(StructuredFormatter())
    root_logger.addHandler(handler)
    
    # Suppress noisy library loggers
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("watchfiles").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
