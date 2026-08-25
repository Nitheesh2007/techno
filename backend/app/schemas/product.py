from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional
from enum import Enum

class ProductStatus(str, Enum):
    SAFE = "SAFE"
    EXPIRING_SOON = "EXPIRING SOON"
    URGENT = "URGENT"
    EXPIRED = "EXPIRED"

class ExpirySource(str, Enum):
    MANUAL = "manual"
    OCR = "ocr"
    CALCULATED = "calculated"
    BARCODE = "barcode"

class ProductBase(BaseModel):
    product_name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    barcode: Optional[str] = None
    batch_number: Optional[str] = None
    quantity: float = 1.0
    unit: str = "pcs"
    price: Optional[float] = None
    manufacturing_date: Optional[date] = None
    expiry_date: date
    reminder_days_before: Optional[int] = 2
    reminder_date: Optional[date] = None
    purchase_date: Optional[date] = None
    opened_date: Optional[date] = None
    image_url: Optional[str] = None
    storage_location: Optional[str] = None
    storage_temperature: Optional[str] = None
    notes: Optional[str] = None
    
    # OCR Data
    ocr_text: Optional[str] = None
    ocr_confidence: Optional[float] = None
    expiry_confidence: Optional[float] = None
    expiry_source: ExpirySource = ExpirySource.MANUAL

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    expiry_date: Optional[date] = None
    reminder_days_before: Optional[int] = None
    reminder_date: Optional[date] = None
    status: Optional[ProductStatus] = None

class ProductResponse(ProductBase):
    id: str
    user_id: str
    status: ProductStatus
    created_at: datetime
    updated_at: datetime
