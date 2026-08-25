from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.database import get_database

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    db = get_database()
    pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {
            "_id": "$status",
            "count": {"$sum": 1}
        }}
    ]
    cursor = db.products.aggregate(pipeline)
    results = await cursor.to_list(length=100)
    
    stats = {
        "total_products": 0,
        "safe_products": 0,
        "expiring_soon": 0,
        "urgent_products": 0,
        "expired_products": 0,
        "wasted_products": 0
    }
    
    for res in results:
        status = res["_id"]
        count = res["count"]
        stats["total_products"] += count
        if status == "SAFE":
            stats["safe_products"] += count
        elif status == "EXPIRING SOON":
            stats["expiring_soon"] += count
        elif status == "URGENT":
            stats["urgent_products"] += count
        elif status == "EXPIRED":
            stats["expired_products"] += count
            
    # Dummy logic for wasted products (could be fetched from a disposal collection)
    return stats

@router.get("/expiring")
async def get_expiring_products(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.products.find(
        {"user_id": current_user["id"], "status": {"$in": ["URGENT", "EXPIRING SOON"]}}
    ).sort("expiry_date", 1).limit(5)
    products = await cursor.to_list(length=5)
    for p in products:
        p["id"] = str(p["_id"])
    return products
