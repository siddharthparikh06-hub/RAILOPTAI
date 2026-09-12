from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAILOPT AI — AI-Powered Railway Maintenance & Block Optimization"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database Settings (Supports Supabase PostgreSQL & SQLite fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./railopt_demo.db")
    
    # Supabase Credentials
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL", "https://odhocyzpapzgizxyjqkw.supabase.co")
    SUPABASE_PUBLISHABLE_KEY: Optional[str] = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    SUPABASE_ANON_KEY: Optional[str] = os.getenv("SUPABASE_ANON_KEY")
    SUPABASE_SECRET_KEY: Optional[str] = os.getenv("SUPABASE_SECRET_KEY")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    SUPABASE_JWKS_URL: Optional[str] = os.getenv("SUPABASE_JWKS_URL", "https://odhocyzpapzgizxyjqkw.supabase.co/auth/v1/.well-known/jwks.json")
    
    # JWT Security Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "development-only-change-me")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 Hours
    
    # Optional Server fields
    PORT: Optional[int] = 8000
    ENVIRONMENT: Optional[str] = "production"
    
    # CORS Origins
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
