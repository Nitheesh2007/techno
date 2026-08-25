from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId

from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate, ProductStatus
from app.database import get_database
from app.dependencies import get_current_user
from app.services.expiry_engine import calculate_product_status

router = APIRouter()

@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    now = datetime.utcnow()
    
    product_dict = product.dict()
    product_dict["user_id"] = current_user["id"]
    product_dict["status"] = calculate_product_status(product.expiry_date)
    
    # Convert dates to datetime for MongoDB storage
    if product.manufacturing_date:
        product_dict["manufacturing_date"] = datetime.combine(product.manufacturing_date, datetime.min.time())
    product_dict["expiry_date"] = datetime.combine(product.expiry_date, datetime.min.time())
    if product.purchase_date:
        product_dict["purchase_date"] = datetime.combine(product.purchase_date, datetime.min.time())
    if product.opened_date:
        product_dict["opened_date"] = datetime.combine(product.opened_date, datetime.min.time())
        
    product_dict["created_at"] = now
    product_dict["updated_at"] = now
    
    result = await db.products.insert_one(product_dict)
    
    created_product = await db.products.find_one({"_id": result.inserted_id})
    created_product["id"] = str(created_product["_id"])
    
    return created_product

@router.get("/", response_model=List[ProductResponse])
async def get_products(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.products.find({"user_id": current_user["id"]})
    products = await cursor.to_list(length=1000)
    
    for product in products:
        product["id"] = str(product["_id"])
        # Recalculate status dynamically just in case it wasn't updated by scheduler
        new_status = calculate_product_status(product["expiry_date"].date())
        if product["status"] != new_status:
            product["status"] = new_status
            await db.products.update_one({"_id": product["_id"]}, {"$set": {"status": new_status}})
            
    return products

@router.get("/{id}", response_model=ProductResponse)
async def get_product(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
        
    product = await db.products.find_one({"_id": ObjectId(id), "user_id": current_user["id"]})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    product["id"] = str(product["_id"])
    return product

@router.put("/{id}", response_model=ProductResponse)
async def update_product(id: str, product_update: ProductUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
        
    existing = await db.products.find_one({"_id": ObjectId(id), "user_id": current_user["id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
        
    update_data = product_update.dict(exclude_unset=True)
    if "expiry_date" in update_data and update_data["expiry_date"]:
        update_data["expiry_date"] = datetime.combine(update_data["expiry_date"], datetime.min.time())
        update_data["status"] = calculate_product_status(update_data["expiry_date"].date())
        
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )
    
    updated_product = await db.products.find_one({"_id": ObjectId(id)})
    updated_product["id"] = str(updated_product["_id"])
    return updated_product

@router.delete("/{id}")
async def delete_product(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
        
    result = await db.products.delete_one({"_id": ObjectId(id), "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return {"message": "Product deleted successfully"}
