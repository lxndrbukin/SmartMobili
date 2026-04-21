from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime
from utils import Language, Pagination

class ItemImageResponse(BaseModel):
    id: int
    image_url: str
    order: int

    class Config:
        from_attributes = True

class ItemTranslationCreate(BaseModel):
    language: Language
    title: str
    description: str | None = None

class ItemTranslationUpdate(BaseModel):
    title: str
    description: str | None = None

class ItemTranslationResponse(BaseModel):
    id: int
    language: Language
    title: str
    description: str | None = None

    class Config:
        from_attributes = True

class ItemCreate(BaseModel):
    price: float | None = None
    category_id: int
    translations: list[ItemTranslationCreate]

    @field_validator("translations")
    def romanian_required(cls, translations):
        languages = [t.language for t in translations]
        if Language.ro not in languages:
            raise ValueError("Romanian (ro) text is required")
        return translations


class ItemUpdate(BaseModel):
    price: float | None = None
    category_id: int | None = None

class ItemCategoryResponse(BaseModel):
    id: int
    slug: str
    name: str

class ItemResponse(BaseModel):
    id: int
    price: float | None = None
    category: ItemCategoryResponse
    created_at: datetime
    title: str
    description: str | None
    language: Language
    images: list[ItemImageResponse] = []

class PaginatedResponse(BaseModel):
    data: List[ItemResponse]
    pagination: Pagination