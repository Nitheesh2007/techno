from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from app.dependencies import get_current_user
from app.database import get_database

router = APIRouter()

@router.get("/")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.notifications.find({"user_id": current_user["id"]}).sort("created_at", -1)
    notifications = await cursor.to_list(length=50)
    for n in notifications:
        n["id"] = str(n["_id"])
    return notifications

@router.put("/{id}/read")
async def mark_notification_read(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    result = await db.notifications.update_one(
        {"_id": ObjectId(id), "user_id": current_user["id"]},
        {"$set": {"is_read": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    return {"message": "Notification marked as read"}
