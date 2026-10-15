from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/boutique_db"
    secret_key: str = "insecure-dev-secret-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    # Comma-separated list of frontend URLs allowed to call this API
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    admin_email: str = "admin@boutique.com"
    admin_password: str = "admin123"

    class Config:
        env_file = ".env"


settings = Settings()
