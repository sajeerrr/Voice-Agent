import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LiveKit Configuration
    LIVEKIT_URL: str
    LIVEKIT_API_KEY: str
    LIVEKIT_API_SECRET: str
    
    # STT and TTS Key
    DEEPGRAM_API_KEY: str
    
    # LLM API Key
    GROQ_API_KEY: str

    class Config:
        env_file = ".env"
        case_sensitive = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set environment variables when settings are loaded
        os.environ["LIVEKIT_URL"] = self.LIVEKIT_URL
        os.environ["LIVEKIT_API_KEY"] = self.LIVEKIT_API_KEY
        os.environ["LIVEKIT_API_SECRET"] = self.LIVEKIT_API_SECRET


settings = Settings()
