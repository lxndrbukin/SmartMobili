from pydantic import BaseModel, field_validator
from utils import Language

class ServiceCatImageResponse(BaseModel):
    id: int
    image_url: str
    order: int

    class Config:
        from_attributes = True

class ServiceCatTranslationCreate(BaseModel):
    language: Language
    name: str

class ServiceCatTranslationUpdate(BaseModel):
    name: str

class ServiceCatTranslationResponse(BaseModel):
    id: int
    language: Language
    name: str

    class Config:
        from_attributes = True

class ServiceCatCreate(BaseModel):
    slug: str
    parent_id: int | None = None
    translations: list[ServiceCatTranslationCreate]
    order: int

    @field_validator("translations")
    def romanian_required(cls, translations):
        languages = [t.language for t in translations]
        if Language.ro not in languages:
            raise ValueError("Romanian (ro) text is required")
        return translations

class ServiceCatUpdate(BaseModel):
    slug: str | None = None
    order: int | None = None

class ServiceCatResponse(BaseModel):
    id: int
    slug: str
    parent_id: int | None = None
    parent_name: str | None = None
    parent_slug: str | None = None
    service_count: int = 0
    item_count: int = 0
    name: str
    language: Language
    images: list[ServiceCatImageResponse] = []
    order: int