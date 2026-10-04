from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime
from utils import Language, Pagination

class LatestWorkImageResponse(BaseModel):
    id: int
    image_url: str
    order: int

    class Config:
        from_attributes = True

class LatestWorkTranslationCreate(BaseModel):
    language: Language
    title: str
    description: str | None = None

class LatestWorkTranslationUpdate(BaseModel):
    title: str
    description: str | None = None

class LatestWorkCreate(BaseModel):
    is_active: bool = True
    translations: list[LatestWorkTranslationCreate]

    @field_validator("translations")
    def romanian_required(cls, translations):
        languages = [t.language for t in translations]
        if Language.ro not in languages:
            raise ValueError("Romanian (ro) text is required")
        return translations

class LatestWorkUpdate(BaseModel):
    is_active: bool | None = None

class LatestWorkResponse(BaseModel):
    id: int
    is_active: bool
    created_at: datetime
    title: str
    description: str | None
    language: Language
    images: list[LatestWorkImageResponse] = []

class PaginatedResponse(BaseModel):
    data: List[LatestWorkResponse]
    pagination: Pagination
