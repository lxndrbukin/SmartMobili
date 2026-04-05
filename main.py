from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers.items import items_router
from routers.categories import categories_router
from routers.inquiries import inquiries_router
from db import engine, Base, get_db
from db_models.items import Item, ItemTranslation, ItemImage
from db_models.categories import Category, CategoryTranslation
from db_models.inquiries import Inquiry
from db_models.auth import User, UserData
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartMobili", description="SmartMobili", version="1.0")

v1_router = APIRouter(prefix="/api/v1")
v1_router.include_router(items_router)
v1_router.include_router(categories_router)
v1_router.include_router(inquiries_router)
app.include_router(v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://smartmobili-xi.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home(db: Session = Depends(get_db)):
    return {
        "server": "SmartMobili API",
        "version": "1.0",
        "total_items": db.query(Item).count()
    }