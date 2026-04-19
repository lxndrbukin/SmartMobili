from pydantic import BaseModel, field_validator
from utils import Language

class CategoryImageResponse(BaseModel):
    id: int
    image_url: str
    order: int

    class Config:
        from_attributes = True

class CategoryTranslationCreate(BaseModel):
    language: Language
    name: str

class CategoryTranslationUpdate(BaseModel):
    name: str

class CategoryTranslationResponse(BaseModel):
    id: int
    language: Language
    name: str

    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    slug: str
    translations: list[CategoryTranslationCreate]

    @field_validator("translations")
    def romanian_required(cls, translations):
        languages = [t.language for t in translations]
        if Language.ro not in languages:
            raise ValueError("Romanian (ro) text is required")
        return translations

class CategoryUpdate(BaseModel):
    slug: str | None = None

class CategoryResponse(BaseModel):
    id: int
    slug: str
    item_count: int
    name: str
    language: Language
    images: list[CategoryImageResponse] = []