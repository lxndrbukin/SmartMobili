from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from os import getenv
from models.auth import (
    UserAuth,
    UserCreate,
    UserResponse,
    TokenResponse
)
from db_models.auth import User
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from jose import jwt, JWTError
from db import get_db
from utils import create_token, get_current_user

load_dotenv()

auth_router = APIRouter(prefix="/auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"])

@auth_router.post("/register", status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = User(
            username=data.username,
            hash_password = pwd_context.hash(data.password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        jwt_token = create_token(user.id, secret_key=SECRET_KEY, algorith=ALGORITHM)
        return TokenResponse(access_token=jwt_token)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username already exists")

@auth_router.post("/login", status_code=status.HTTP_200_OK, response_model=TokenResponse)
def login(data: UserAuth, db: Session):
    user = db.query(User).filter(User.username == data.username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    is_valid = pwd_context.verify(data.password, user.hash_password)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    jwt_token = create_token(user.id)
    return TokenResponse(access_token=jwt_token)

@auth_router.get("/users/me", status_code=status.HTTP_200_OK, response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    pass