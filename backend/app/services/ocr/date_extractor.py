import re
from datetime import datetime
from typing import Dict, Any, Optional

DATE_PATTERNS = [
    r'(\d{2}[/\.-]\d{2}[/\.-]\d{4})',
    r'(\d{2}[/\.-]\d{2}[/\.-]\d{2})',
    r'(\d{4}[/\.-]\d{2}[/\.-]\d{2})',
    r'(\d{2}\s+[A-Za-z]{3}\s+\d{4})'
]

EXP_KEYWORDS = ['EXP', 'EXP.', 'EXPIRY', 'USE BY', 'BEST BEFORE', 'BBE']
MFD_KEYWORDS = ['MFD', 'MFG', 'MFG.', 'MANUFACTURED']

def parse_date(date_str: str) -> Optional[datetime]:
    formats = ['%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y', '%d/%m/%y', '%d-%m-%y', '%Y/%m/%d', '%Y-%m-%d', '%d %b %Y']
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None

def extract_fields(text: str) -> Dict[str, Any]:
    text_upper = text.upper()
    results = {}
    
    # Simple extraction logic
    dates_found = []
    for pattern in DATE_PATTERNS:
        dates_found.extend(re.findall(pattern, text_upper))
        
    parsed_dates = []
    for d in dates_found:
        pd = parse_date(d)
        if pd:
            parsed_dates.append(pd)
            
    parsed_dates.sort()
    
    if len(parsed_dates) == 1:
        results['expiry_date'] = parsed_dates[0]
        results['expiry_source'] = "ocr"
    elif len(parsed_dates) >= 2:
        results['manufacturing_date'] = parsed_dates[0]
        results['expiry_date'] = parsed_dates[-1]
        results['expiry_source'] = "ocr"
        
    # MRP
    mrp_match = re.search(r'MRP[\s:]*(?:RS\.?|INR|₹)?\s*(\d+(?:\.\d{1,2})?)', text_upper)
    if mrp_match:
        results['mrp'] = float(mrp_match.group(1))
        
    # Batch
    batch_match = re.search(r'(?:BATCH|LOT)[\s:A-Z]*([A-Z0-9]+)', text_upper)
    if batch_match:
        results['batch_number'] = batch_match.group(1)
        
    return results
