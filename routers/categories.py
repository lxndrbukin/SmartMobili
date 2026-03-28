from fastapi import APIRouter, status, Depends, HTTPException
from db import get_db
from models.categories import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryTranslationUpdate
from db_models.categories import Category, CategoryTranslation
from sqlalchemy.orm import Session, joinedload
from utils import Language, get_translation

categories_router = APIRouter(prefix="/categories", tags=["categories"])

@categories_router.get("/", status_code=status.HTTP_200_OK, response_model=list[CategoryResponse])
def get_categories(lang: Language = Language.ro , db: Session = Depends(get_db)):
    categories = db.query(Category).options(joinedload(Category.translations)).all()
    result = []
    for category in categories:
        translation = get_translation(category.translations, lang)
        result.append({
            "id": category.id,
            "slug": category.slug,
            "name": translation.name,
            "language": translation.language
        })
    return result

@categories_router.post("/", status_code=status.HTTP_201_CREATED, response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(
        slug=category.slug
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    for translation in category.translations:
        db_translation = CategoryTranslation(
            category_id=db_category.id,
            language=translation.language,
            name=translation.name
        )
        db.add(db_translation)
    db.commit()
    db.refresh(db_category)
    translation = get_translation(db_category.translations, Language.ro)
    return {
        "id": db_category.id,
        "slug": db_category.slug,
        "name": translation.name,
        "language": translation.language
    }

@categories_router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, data: CategoryUpdate, lang: Language = Language.ro, db: Session = Depends(get_db)):
    category = db.query(Category).options(joinedload(Category.translations)).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    if data.slug is not None:
        category.slug = data.slug
    db.commit()
    db.refresh(category)
    translation = get_translation(category.translations, lang)
    return {
        "id": category.id,
        "slug": category.slug,
        "name": translation.name,
        "language": translation.language
    }

@categories_router.put("/{category_id}/translations")
def update_translation(
        category_id: int,
        lang: Language,
        data: CategoryTranslationUpdate,
        db: Session = Depends(get_db)
    ):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    translation = db.query(CategoryTranslation).filter(
                                                    CategoryTranslation.category_id == category_id,
                                                    CategoryTranslation.language == lang
                                                ).first()
    if translation:
        translation.name = data.name
        db.commit()
        return {"message": f"Updated {lang} translation"}
    else:
        new_translation = CategoryTranslation(
            category_id=category_id,
            name=data.name,
            language=lang
        )
        db.add(new_translation)
        db.commit()
        return {"message": f"Created {lang} translation"}