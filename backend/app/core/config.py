from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAILOPT AI — AI-Powered Railway Maintenance & Block Optimization"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database Settings (Supports Supabase PostgreSQL & SQLite fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./railopt_demo.db")
    
    # Supabase Credentials
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: Optional[str] = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # JWT Security Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "railopt_sih2026_super_secret_jwt_key_908234")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 Hours
    
    # CORS Origins
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
