import os
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "bit_mesra_db")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

# Website Ingestion Configurations
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "10"))
MAX_PAGE_SIZE = int(os.getenv("MAX_PAGE_SIZE", "5242880"))
USER_AGENT = os.getenv("USER_AGENT", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
MAX_CHUNKS = int(os.getenv("MAX_CHUNKS", "500"))
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))

# Website Synchronization Configurations
WEBSITE_SYNC_ENABLED = os.getenv("WEBSITE_SYNC_ENABLED", "True").lower() == "true"
WEBSITE_SYNC_INTERVAL_MINUTES = int(os.getenv("WEBSITE_SYNC_INTERVAL_MINUTES", "60"))
MAX_CONCURRENT_WEBSITE_SYNCS = int(os.getenv("MAX_CONCURRENT_WEBSITE_SYNCS", "3"))
RESPECT_ROBOTS_TXT = os.getenv("RESPECT_ROBOTS_TXT", "False").lower() == "true"

# Website Content Normalization Configurations
ENABLE_NORMALIZED_HASH = os.getenv("ENABLE_NORMALIZED_HASH", "True").lower() == "true"
IGNORE_DATES = os.getenv("IGNORE_DATES", "True").lower() == "true"
IGNORE_TIMESTAMPS = os.getenv("IGNORE_TIMESTAMPS", "True").lower() == "true"
IGNORE_COUNTERS = os.getenv("IGNORE_COUNTERS", "True").lower() == "true"
IGNORE_SESSION_IDS = os.getenv("IGNORE_SESSION_IDS", "True").lower() == "true"
IGNORE_EXTRA_WHITESPACE = os.getenv("IGNORE_EXTRA_WHITESPACE", "True").lower() == "true"