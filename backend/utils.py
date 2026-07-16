from enum import Enum
from dotenv import load_dotenv
from os import getenv
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from db import get_db
from db_models.auth import User
from db_models.items import Item, ItemTranslation
from google.genai import types
from gemini_client import client

load_dotenv()

SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = "HS256"

class Language(str, Enum):
    ro = "ro"
    ru = "ru"

class Pagination(BaseModel):
    skip: int
    limit: int

class UserRole(str, Enum):
    user = "user"
    admin = "admin"

def get_translation(translations, lang: Language):
    translation = next(
        (t for t in translations if t.language == lang),
        None
    )
    if not translation:
        translation = next(
            (t for t in translations if t.language == Language.ro),
            None
        )
    return translation

def create_token(user_id: int, secret_key, algorithm) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, secret_key, algorithm=algorithm)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
    ):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

SYSTEM_PROMPT = '''
You are a helpful assistant for SmartMobili, a custom furniture manufacturer.

SCOPE OF PRODUCTS
SmartMobili makes custom-made furniture only, including: kitchens, kitchen 
dining tables ("столы-книжки" / mese pliante), wardrobes, and living room 
furniture. SmartMobili does NOT make or sell glass tables, sofas, chairs, or 
other soft/upholstered furniture. If a customer asks about something outside 
this scope, politely explain that SmartMobili doesn't offer that category, 
and mention what the company does make instead.

STAYING GROUNDED IN THE CATALOGUE
Never describe, recommend, or invent specific products, materials, dimensions, 
or prices from general knowledge. Always use the search_products tool to check 
the actual catalogue before answering any question about available items, 
materials, dimensions, or pricing. If the tool returns no matching items, tell 
the customer honestly that nothing matching their request is currently 
available, rather than guessing or suggesting something that wasn't returned.

CONVERSATION STYLE
Answer in the same language the customer writes in (Romanian or Russian). 
Ask clarifying questions only about things the catalogue actually varies on 
(e.g., which room the furniture is for, size constraints, style preferences) 
— never ask about materials, finishes, or options that aren't reflected in 
the catalogue data you retrieve.

OUT-OF-SCOPE REQUESTS
Only answer questions about SmartMobili's furniture, custom orders, dimensions, 
delivery, and general shopping help. If asked something unrelated to furniture 
or SmartMobili, politely redirect the conversation back to how you can help 
with their furniture needs.
'''

def generate_embedding(text: str):
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=768)
    )
    return result.embeddings[0].values

def search_products(query: str, lang: str, db: Session):
    query_embedding = generate_embedding(query)
    results = (
        db.query(ItemTranslation)
        .join(Item, ItemTranslation.item_id == Item.id)
        .filter(ItemTranslation.language == lang)
        .order_by(ItemTranslation.embedding.cosine_distance(query_embedding))
        .limit(5)
        .all()
    )
    return [
        {
            'title': r.title, 'description': r.description,  'price': r.item.price
        } for r in results
    ]