from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime
from app.schemas.user import UserCreate, UserResponse, Token
from app.database import get_database
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    db = get_database()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    
    now = datetime.utcnow()
    user_dict = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "preferred_language": user.preferred_language,
        "notification_preferences": {"email": True, "push": True},
        "created_at": now,
        "updated_at": now
    }
    
    result = await db.users.insert_one(user_dict)
    
    created_user = await db.users.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    
    return created_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    user = await db.users.find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
