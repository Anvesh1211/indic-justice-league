import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    google_vision_api_key: str = os.getenv("GOOGLE_VISION_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    polygon_rpc_url: str = os.getenv("POLYGON_RPC_URL", "https://polygon-rpc.com/")
    private_key: str = os.getenv("PRIVATE_KEY", "")
    contract_address: str = os.getenv("CONTRACT_ADDRESS", "")

    class Config:
        env_file = ".env"

settings = Settings()