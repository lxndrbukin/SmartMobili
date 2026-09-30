from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime
from utils import Language, Pagination

class ServiceImageResponse(BaseModel):
    id: int
    image_url: str
    order: int

    class Config:
        from_attributes = True

class ServiceTranslationCreate(BaseModel):
    language: Language
    title: str
    description: str | None = None

class ServiceTranslationUpdate(BaseModel):
    title: str
    description: str | None = None

class ServiceTranslationResponse(BaseModel):
    id: int
    language: Language
    title: str
    description: str | None = None

    class Config:
        from_attributes = True

class ServiceCreate(BaseModel):
    price: float | None = None
    currency: str | None = None
    category_id: int
    translations: list[ServiceTranslationCreate]

    @field_validator("translations")
    def romanian_required(cls, translations):
        languages = [t.language for t in translations]
        if Language.ro not in languages:
            raise ValueError("Romanian (ro) text is required")
        return translations

class ServiceUpdate(BaseModel):
    price: float | None = None
    currency: str | None = None
    category_id: int | None = None
    in_gallery: bool | None = None

class ServiceCategoryResponse(BaseModel):
    id: int
    slug: str
    parent_slug: str | None = None
    parent_name: str | None = None
    name: str

class ServiceResponse(BaseModel):
    id: int
    price: float | None = None
    currency: str | None = None
    category: ServiceCategoryResponse
    created_at: datetime
    title: str
    description: str | None
    language: Language
    images: list[ServiceImageResponse] = []

class PaginatedResponse(BaseModel):
    data: List[ServiceResponse]
    pagination: Pagination