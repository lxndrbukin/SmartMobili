from pydantic import BaseModel, field_validator
from typing import List
from utils import Language, Pagination

class BannerImageResponse(BaseModel):
    id: int
    image_url: str
    order: int

    class Config:
        from_attributes = True

class BannerTranslationCreate(BaseModel):
    language: Language
    header: str
    body: str | None = None

class BannerTranslationUpdate(BaseModel):
    header: str
    body: str | None = None

class BannerTranslationResponse(BaseModel):
    id: int
    language: Language
    header: str
    body: str | None = None

class BannerCreate(BaseModel):
    url: str
    translations: list[BannerTranslationCreate]

    @field_validator("translations")
    def romanian_required(cls, translations):
        languages = [t.language for t in translations]
        if Language.ro not in languages:
            raise ValueError("Romanian (ro) text is required")
        return translations

class BannerUpdate(BaseModel):
    url: str

class BannerResponse(BaseModel):
    id: int
    url: str
    header: str
    body: str | None
    language: Language
    images: list[BannerImageResponse] = [],
    order: int

class PaginatedResponse(BaseModel):
    data: List[BannerResponse]
    pagination: Pagination