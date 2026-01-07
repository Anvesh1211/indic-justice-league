from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # AI
    GOOGLE_VISION_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None

    # Blockchain
    POLYGON_RPC_URL: str | None = None
    PRIVATE_KEY: str | None = None
    CONTRACT_ADDRESS: str | None = None

    # Mode
    MOCK_MODE: bool = True  # turn off when real keys are added

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()

