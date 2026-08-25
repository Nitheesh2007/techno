from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.dependencies import get_current_user
from app.database import get_database
from app.services.ai_service import ai_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    
class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.products.find({"user_id": current_user["id"]})
    products = await cursor.to_list(length=100)
    
    context = {"products": products}
    messages = [{"role": "user", "content": req.message}]
    
    reply = await ai_service.chat(messages, context)
    return {"reply": reply}

@router.post("/recipe")
async def get_recipe(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.products.find({"user_id": current_user["id"]})
    products = await cursor.to_list(length=100)
    
    recipe = await ai_service.generate_recipe(products)
    return {"recipe": recipe}
