from pydantic import BaseModel
from typing import List
from datetime import datetime
from utils import Pagination

class InquiryCreate(BaseModel):
    name: str
    subject: str
    description: str | None = None
    item_id: int | None = None
    phone: str
    email: str | None = None
    telegram: bool = False
    whatsapp: bool = False
    viber: bool = False

class InquiryResponse(BaseModel):
    id: int
    name: str
    subject: str
    description: str | None = None
    item_id: int | None = None
    phone: str
    email: str | None = None
    created_at: datetime
    telegram: bool = False
    whatsapp: bool = False
    viber: bool = False

    class Config:
        from_attributes = True

class InquiryUpdate(BaseModel):
    name: str | None = None
    subject: str | None = None
    description: str | None = None
    phone: str | None = None
    email: str | None = None
    telegram: bool | None = None
    whatsapp: bool | None = None
    viber: bool | None = None

class PaginatedResponse(BaseModel):
    data: List[InquiryResponse]
    pagination: Pagination