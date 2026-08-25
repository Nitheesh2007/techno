from datetime import date

def calculate_product_status(expiry_date: date) -> str:
    """
    SAFE          > 30 days
    EXPIRING SOON 8–30 days
    URGENT        1–7 days
    EXPIRED       <= 0
    """
    if isinstance(expiry_date, str):
        expiry_date = date.fromisoformat(expiry_date)
        
    delta = (expiry_date - date.today()).days
    
    if delta <= 0:
        return "EXPIRED"
    elif delta <= 7:
        return "URGENT"
    elif delta <= 30:
        return "EXPIRING SOON"
    else:
        return "SAFE"
