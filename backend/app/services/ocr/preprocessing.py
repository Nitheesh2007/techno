import cv2
import numpy as np

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 1. Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 2. Resize if too small to improve OCR accuracy
    height, width = gray.shape
    if height < 1000 or width < 1000:
        gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        
    # 3. Denoising
    denoised = cv2.fastNlMeansDenoising(gray, h=30)
    
    # 4. Adaptive Thresholding (optional, sometimes harms PaddleOCR which works well on grayscale, but good for Tesseract)
    # We will return multiple variants and let the manager try them if needed, or just return the best general one.
    
    # Let's return the denoised grayscale image as the primary preprocessed image.
    return denoised
