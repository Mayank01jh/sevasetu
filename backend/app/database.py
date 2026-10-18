import logging
from motor.motor_asyncio import AsyncIOMotorClient
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("sevasetu.database")

# MongoDB Client
mongo_client: AsyncIOMotorClient = None
mongo_db = None

# Supabase Client
supabase_client: Client = None

async def init_databases():
    global mongo_client, mongo_db, supabase_client

    # Initialize MongoDB if URI provided
    if settings.MONGODB_URI:
        try:
            mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
            mongo_db = mongo_client[settings.MONGODB_DB_NAME]
            logger.info("Connected to MongoDB Atlas successfully.")
        except Exception as e:
            logger.warning(f"Could not connect to MongoDB Atlas: {e}. Using fallback storage.")
    else:
        logger.info("MONGODB_URI not provided. High-throughput logs will use in-memory fallback.")

    # Initialize Supabase if URL and KEY provided
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Connected to Supabase client successfully.")
        except Exception as e:
            logger.warning(f"Could not connect to Supabase: {e}. Using fallback storage.")
    else:
        logger.info("SUPABASE credentials not provided. Relational statutory storage will use in-memory fallback.")

async def close_databases():
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB client closed.")
