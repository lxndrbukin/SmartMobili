from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File
from db import get_db
from models.categories import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryTranslationUpdate,
    CategoryImageResponse
)
from db_models.categories import Category, CategoryTranslation, CategoryImage
from db_models.items import Item
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from cloud_storage import upload_image, delete_image
from utils import Language, get_translation

categories_router = APIRouter(prefix="/categories", tags=["categories"])

@categories_router.get("/", status_code=status.HTTP_200_OK, response_model=list[CategoryResponse])
def get_categories(lang: Language = Language.ro , db: Session = Depends(get_db)):
    categories = db.query(Category) \
        .options(joinedload(Category.translations), joinedload(Category.images)).all()
    result = []
    for category in categories:
        item_count = db.query(func.count(Item.id)).filter(Item.category_id == category.id).scalar()
        translation = get_translation(category.translations, lang)
        result.append({
            "id": category.id,
            "slug": category.slug,
            "item_count": item_count,
            "name": translation.name,
            "language": translation.language,
            "images": category.images
        })
    return result

@categories_router.get("/{category_id}", status_code=status.HTTP_200_OK, response_model=CategoryResponse)
def get_category(category_id: int, lang: Language = Language.ro, db: Session = Depends(get_db)):
    category = db.query(Category).options(joinedload(Category.translations), joinedload(Category.images)) \
        .filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    translation = get_translation(category.translations, lang)
    item_count = db.query(func.count(Item.id)).filter(Item.category_id == category.id).scalar()
    return {
        "id": category.id,
        "slug": category.slug,
        "item_count": item_count,
        "name": translation.name,
        "language": translation.language
    }

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
    item_count = db.query(func.count(Item.id)).filter(Item.category_id == category.id).scalar()
    return {
        "id": db_category.id,
        "slug": db_category.slug,
        "item_count": item_count,
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
    item_count = db.query(func.count(Item.id)).filter(Item.category_id == category.id).scalar()
    return {
        "id": category.id,
        "slug": category.slug,
        "item_count": item_count,
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

@categories_router.post("/{category_id}/images", response_model=CategoryImageResponse)
def add_images(category_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = db.query(Category).get(category.id)
    image_url = upload_image(image, category.slug)
    existing_count = db.query(CategoryImage).filter(CategoryImage.category_id == category_id).count()
    db_image = CategoryImage(
        category_id=category.id,
        image_url=image_url,
        order=existing_count
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

@categories_router.delete("/{category_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(category_id: int, image_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    image = db.query(CategoryImage).get(image_id)
    if not image or image.item_id != category.id:
        raise HTTPException(status_code=404, detail="Category not found")
    delete_image(image.image_url)
    db.delete(image)
    db.commit()
    return None