from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from os import getenv
from models.auth import (
    UserAuth,
    UserCreate,
    UserResponse,
    UserUpdate,
    UserRole,
    TokenResponse,
    PaginatedUsersResponse
)
from db_models.auth import User
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from jose import jwt, JWTError
from db import get_db
from utils import create_token, get_current_user, Pagination

load_dotenv()

auth_router = APIRouter(prefix="/auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"])

@auth_router.post("/register", status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == data.username).first()
    if existing_user is None:
        try:
            user = User(
                username=data.username,
                hashed_password=pwd_context.hash(data.password),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            jwt_token = create_token(user.id, secret_key=SECRET_KEY, algorithm=ALGORITHM)
            return TokenResponse(access_token=jwt_token)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Error: {e}")
    else:
        raise HTTPException(status_code=400, detail="Username already exists")

@auth_router.post("/login", status_code=status.HTTP_200_OK, response_model=TokenResponse)
def login(data: UserAuth, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    is_valid = pwd_context.verify(data.password, user.hashed_password)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    jwt_token = create_token(user.id, secret_key=SECRET_KEY, algorithm=ALGORITHM)
    return TokenResponse(access_token=jwt_token)

@auth_router.get("/users/me", status_code=status.HTTP_200_OK, response_model=UserResponse)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    return UserResponse(
        id=user.id,
        username=user.username,
        user_role=user.user_role,
        signup_at=user.signup_at
    )

@auth_router.get("/users", status_code=status.HTTP_200_OK, response_model=PaginatedUsersResponse)
def get_users(
        skip: int = 0,
        limit: int = 10,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    if current_user.user_role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Access denied")
    users = db.query(User).offset(skip).limit(limit).all()
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "user_role": user.user_role,
            "signup_at": user.signup_at
        })
    return PaginatedUsersResponse(
        data=result,
        pagination=Pagination(skip=skip, limit=limit)
    )

@auth_router.get("/users/{user_id}", status_code=status.HTTP_200_OK, response_model=UserResponse)
def get_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Access denied")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        username=user.username,
        user_role=user.user_role,
        signup_at=user.signup_at
    )

@auth_router.put("/users/{user_id}", status_code=status.HTTP_200_OK, response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Access denied")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.username:
        user.username = data.username
    if data.password:
        user.hashed_password=pwd_context.hash(data.password)
    if data.user_role:
        user.user_role = data.user_role
    db.commit()
    db.refresh(user)
    return UserResponse(
        id=user.id,
        username=user.username,
        user_role=user.user_role,
        signup_at=user.signup_at
    )

@auth_router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_role == UserRole.admin:
        user = db.query(User).filter(User.id == user_id).first()
        db.delete(user)
        db.commit()
    return None