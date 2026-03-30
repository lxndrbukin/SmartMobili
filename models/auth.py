from pydantic import BaseModel
from datetime import datetime
from utils import UserRole

class UserAuth(BaseModel):
    username: str
    password: str

class UserDataCreate(BaseModel):
    email: str | None = None
    phone: str | None = None
    name: str | None = None

class UserDataUpdate(BaseModel):
    email: str | None = None
    phone: str | None = None
    name: str | None = None

class UserDataResponse(BaseModel):
    email: str | None = None
    phone: str | None = None
    name: str | None = None

class UserCreate(BaseModel):
    username: str
    password: str
    user_role: UserRole = UserRole.user

class UserResponse(BaseModel):
    id: int
    username: str
    user_role: UserRole
    signup_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    user_role: UserRole | None = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"