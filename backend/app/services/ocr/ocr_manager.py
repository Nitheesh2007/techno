import logging
from app.services.ocr.preprocessing import preprocess_image
from app.services.ocr.date_extractor import extract_fields

logger = logging.getLogger(__name__)

class OCRManager:
    def __init__(self):
        self.paddle = None
        self.easyocr = None
        
    def _init_paddle(self):
        if self.paddle is None:
            try:
                from paddleocr import PaddleOCR
                self.paddle = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=False)
            except ImportError:
                logger.error("PaddleOCR not installed")
                
    def _init_easyocr(self):
        if self.easyocr is None:
            try:
                import easyocr
                self.easyocr = easyocr.Reader(['en'], gpu=False)
            except ImportError:
                logger.error("EasyOCR not installed")

    def process_image(self, image_bytes: bytes):
        img_np = preprocess_image(image_bytes)
        
        raw_text = ""
        confidence = 0.0
        engine_used = ""
        
        # 1. Try PaddleOCR
        self._init_paddle()
        if self.paddle:
            try:
                result = self.paddle.ocr(img_np, cls=True)
                if result and result[0]:
                    texts = [line[1][0] for line in result[0]]
                    confs = [line[1][1] for line in result[0]]
                    raw_text = " ".join(texts)
                    confidence = sum(confs) / len(confs) if confs else 0
                    engine_used = "paddleocr"
            except Exception as e:
                logger.error(f"PaddleOCR failed: {e}")
                
        # 2. Try EasyOCR if Paddle failed or confidence is low
        if confidence < 0.75:
            self._init_easyocr()
            if self.easyocr:
                try:
                    result = self.easyocr.readtext(img_np)
                    if result:
                        texts = [r[1] for r in result]
                        confs = [r[2] for r in result]
                        easy_text = " ".join(texts)
                        easy_conf = sum(confs) / len(confs) if confs else 0
                        
                        if easy_conf > confidence:
                            raw_text = easy_text
                            confidence = easy_conf
                            engine_used = "easyocr"
                except Exception as e:
                    logger.error(f"EasyOCR failed: {e}")
                    
        # 3. Tesseract Fallback (omitted for brevity unless required)
        # Using pytesseract if both failed...
        if confidence < 0.5:
            try:
                import pytesseract
                # Requires tesseract binary installed on system
                tess_text = pytesseract.image_to_string(img_np)
                if len(tess_text.strip()) > 5:
                    raw_text = tess_text
                    confidence = 0.5 # Tesseract doesn't give simple overall confidence easily
                    engine_used = "tesseract"
            except Exception as e:
                logger.error(f"Tesseract failed: {e}")

        extracted = extract_fields(raw_text)
        
        return {
            "success": bool(raw_text.strip()),
            "engine": engine_used,
            "overall_confidence": confidence,
            "raw_text": raw_text,
            "extracted_fields": extracted
        }

ocr_manager = OCRManager()
