import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://sevasetu.vercel.app",
        "*"
    ]
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "sevasetu_jwt_secret_dev_key_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "sevasetu")

    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    UPI_VPA: str = os.getenv("UPI_VPA", "sevasetu@icici")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
