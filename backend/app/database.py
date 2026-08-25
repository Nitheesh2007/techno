from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

def get_database():
    return db.db

async def connect_to_mongo():
    print("Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db.db = db.client[settings.DATABASE_NAME]
    
    # Create indexes
    await db.db.users.create_index("email", unique=True)
    await db.db.products.create_index("user_id")
    await db.db.products.create_index("expiry_date")
    await db.db.products.create_index("barcode")
    await db.db.notifications.create_index("user_id")
    await db.db.notifications.create_index("is_read")
    
    print("Connected to MongoDB!")

async def close_mongo_connection():
    print("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    print("Closed MongoDB connection.")
