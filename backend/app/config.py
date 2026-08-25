from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "food_expiry_guardian"
    JWT_SECRET: str = "super_secret_jwt_key_replace_me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings()
