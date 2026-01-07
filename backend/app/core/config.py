import os
from pydantic_settings import BaseSettings
<<<<<<< HEAD
from pydantic import Field

class Settings(BaseSettings):
    # Google Cloud & AI
    google_application_credentials: str = Field(
        default="google_creds.json",
        description="Path to Google Cloud credentials JSON"
    )
    gemini_api_key: str = Field(default="", description="Google Gemini API key")
    
    # Blockchain
    polygon_rpc_url: str = Field(
        default="http://127.0.0.1:8545",
        description="Polygon RPC endpoint (defaults to local Hardhat)"
    )
    private_key: str = Field(default="", description="Wallet private key")
    contract_address: str = Field(default="", description="Deployed contract address")
    
    # CORS
    frontend_url: str = Field(
        default="http://localhost:5173",
        description="Frontend URL for CORS"
    )
    
    model_config = {"env_file": ".env", "extra": "allow"}
=======

class Settings(BaseSettings):
    google_vision_api_key: str = ""
    gemini_api_key: str = ""
    polygon_rpc_url: str = "https://polygon-rpc.com/"
    private_key: str = ""
    contract_address: str = ""

    class Config:
        env_file = ".env"
>>>>>>> 83e0940e75b112b54afd8bb023594b5b7a6adab4

settings = Settings()
