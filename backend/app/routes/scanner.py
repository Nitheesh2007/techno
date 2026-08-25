from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.dependencies import get_current_user
from app.services.ocr.ocr_manager import ocr_manager

router = APIRouter()

@router.post("/ocr")
async def scan_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File provided is not an image")
        
    image_bytes = await file.read()
    
    # Process image with OCR Manager
    result = ocr_manager.process_image(image_bytes)
    
    if not result["success"]:
        raise HTTPException(status_code=422, detail="Failed to extract text from image. Please ensure good lighting and try again.")
        
    return result
