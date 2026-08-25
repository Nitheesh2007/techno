from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.database import get_database
from app.services.expiry_engine import calculate_product_status
import datetime
import logging

logger = logging.getLogger(__name__)

async def check_expiries():
    logger.info("Running scheduled expiry check...")
    db = get_database()
    if not db:
        return
        
    cursor = db.products.find({"status": {"$ne": "EXPIRED"}})
    products = await cursor.to_list(length=None)
    
    for product in products:
        new_status = calculate_product_status(product["expiry_date"].date())
        if product["status"] != new_status:
            # Update product
            await db.products.update_one(
                {"_id": product["_id"]}, 
                {"$set": {"status": new_status, "updated_at": datetime.datetime.utcnow()}}
            )
            
            # Create notification
            notification = {
                "user_id": product["user_id"],
                "product_id": str(product["_id"]),
                "type": "EXPIRY_ALERT",
                "title": f"Product Status Changed: {product['product_name']}",
                "message": f"Your {product['product_name']} is now marked as {new_status}.",
                "priority": "HIGH" if new_status in ["URGENT", "EXPIRED"] else "MEDIUM",
                "is_read": False,
                "created_at": datetime.datetime.utcnow()
            }
            await db.notifications.insert_one(notification)
            logger.info(f"Created notification for {product['product_name']}")

def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(check_expiries, 'interval', hours=12) # Run every 12 hours
    scheduler.start()
    logger.info("Scheduler started.")
