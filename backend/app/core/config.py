import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    google_vision_api_key: str = ""
    gemini_api_key: str = ""
    polygon_rpc_url: str = "https://polygon-rpc.com/"
    private_key: str = ""
    contract_address: str = ""
    google_application_credentials: str = ""
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()
