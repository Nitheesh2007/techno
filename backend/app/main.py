from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from app.database import connect_to_mongo, close_mongo_connection, get_database
from app.routes import auth, products, scanner, ai, dashboard, notifications
from app.scheduler.tasks import start_scheduler
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    start_scheduler()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="Food Expiry Guardian AI",
    description="Smart food-management platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]
frontend_url = os.getenv("FRONTEND_URL", settings.FRONTEND_URL if hasattr(settings, "FRONTEND_URL") else None)
if frontend_url and frontend_url not in origins:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(scanner.router, prefix="/api/scanner", tags=["Scanner"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Food Expiry Guardian AI API"}
    
@app.get("/health")
async def health_check():
    db = get_database()
    db_status = "connected" if db is not None else "disconnected"
    return {
        "status": "ok",
        "database": db_status
    }
