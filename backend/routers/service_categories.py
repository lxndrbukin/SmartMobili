from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File
from db import get_db
from models.service_categories import (
    ServiceCatCreate,
    ServiceCatUpdate,
    ServiceCatResponse,
    ServiceCatTranslationUpdate,
    ServiceCatImageResponse
)
from db_models.service_categories import (
    ServiceCategory, 
    ServiceCatImage,
    ServiceCatTranslation
)
from db_models.services import Service
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from cloud_storage import handle_upload_image, handle_delete_image
from utils import Language, get_translation

service_categories_router = APIRouter(prefix="/service_categories", tags=["service_categories"])

@service_categories_router.get("/", status_code=status.HTTP_200_OK, response_model=list[ServiceCatResponse])
def get_categories(
        lang: Language = Language.ro, 
        limit: int | None = None, 
        db: Session = Depends(get_db)
    ):
    categories = db.query(ServiceCategory) \
        .options(joinedload(ServiceCategory.translations), joinedload(ServiceCategory.images)) \
        .order_by(ServiceCategory.order.asc())
    if limit is not None:
        categories = categories.limit(limit)
    categories = categories.all()
    result = []
    for category in categories:
        parent_category = None
        parent_translation = None
        service_count = db.query(func.count(Service.id)).filter(Service.category_id == category.id).scalar()
        translation = get_translation(category.translations, lang)
        if category.parent_id is not None:
            parent_category = db.query(ServiceCategory) \
                .options(joinedload(ServiceCategory.translations)) \
                .filter(ServiceCategory.id == category.parent_id).first()
            parent_translation = get_translation(parent_category.translations, lang)
        result.append({
            "id": category.id,
            "slug": category.slug,
            "parent_id": category.parent_id,
            "parent_name": parent_translation.name if parent_translation else None,
            "parent_slug": parent_category.slug if parent_category else None,
            "service_count": service_count,
            "item_count": service_count,
            "name": translation.name,
            "language": translation.language,
            "images": category.images,
            "order": category.order
        })
    return result

@service_categories_router.get("/{category_id}", status_code=status.HTTP_200_OK, response_model=ServiceCatResponse)
def get_category(category_id: int, lang: Language = Language.ro, db: Session = Depends(get_db)):
    parent_category = None
    parent_translation = None
    category = db.query(ServiceCategory).options(joinedload(ServiceCategory.translations), joinedload(ServiceCategory.images)) \
        .filter(ServiceCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="ServiceCat not found")
    translation = get_translation(category.translations, lang)
    if category.parent_id is not None:
        parent_category = db.query(ServiceCategory) \
            .options(joinedload(ServiceCategory.translations)) \
            .filter(ServiceCategory.id == category.parent_id).first()
        parent_translation = get_translation(parent_category.translations, lang)
    service_count = db.query(func.count(Service.id)).filter(Service.category_id == category.id).scalar()
    return {
        "id": category.id,
        "slug": category.slug,
        "parent_id": category.parent_id,
        "parent_name": parent_translation.name if parent_translation else None,
        "parent_slug": parent_category.slug if parent_category else None,
        "service_count": service_count,
        "item_count": service_count,
        "name": translation.name,
        "language": translation.language,
        "images": category.images,
        "order": category.order
    }

@service_categories_router.post("/", status_code=status.HTTP_201_CREATED, response_model=ServiceCatResponse)
def create_category(data: ServiceCatCreate, db: Session = Depends(get_db)):
    if data.parent_id:
        parent = db.query(ServiceCategory).get(data.parent_id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent category not found")
        if parent.parent_id is not None:
            raise HTTPException(
                status_code=400, 
                detail="Cannot create a subcategory of a subcategory"
            )
    existing_count = db.query(ServiceCategory).count()
    category = ServiceCategory(
        slug=data.slug,
        parent_id=data.parent_id,
        order=data.order or existing_count
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    for translation in data.translations:
        db_translation = ServiceCatTranslation(
            category_id=category.id,
            language=translation.language,
            name=translation.name
        )
        db.add(db_translation)
    db.commit()
    db.refresh(category)

    parent_category = None
    parent_translation = None
    if category.parent_id is not None:
        parent_category = db.query(ServiceCategory) \
            .options(joinedload(ServiceCategory.translations)) \
            .filter(ServiceCategory.id == category.parent_id).first()
        parent_translation = get_translation(parent_category.translations, Language.ro)

    translation = get_translation(category.translations, Language.ro)
    service_count = db.query(func.count(Service.id)).filter(Service.category_id == category.id).scalar()
    return {
        "id": category.id,
        "slug": category.slug,
        "parent_id": category.parent_id,
        "parent_name": parent_translation.name if parent_translation else None,
        "parent_slug": parent_category.slug if parent_category else None,
        "service_count": service_count,
        "item_count": service_count,
        "name": translation.name,
        "language": translation.language,
        "images": [],
        "order": category.order
    }

@service_categories_router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(ServiceCategory).filter(ServiceCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="ServiceCat not found")
    db.delete(category)
    db.commit()
    return None

@service_categories_router.put("/{category_id}", response_model=ServiceCatResponse)
def update_category(category_id: int, data: ServiceCatUpdate, lang: Language = Language.ro, db: Session = Depends(get_db)):
    category = db.query(ServiceCategory) \
        .options(
            joinedload(ServiceCategory.translations), joinedload(ServiceCategory.images)
        ).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="ServiceCat not found")
    if data.slug is not None:
        category.slug = data.slug
    if data.order is not None:
        category.order = data.order
    db.commit()
    db.refresh(category)

    parent_category = None
    parent_translation = None
    if category.parent_id is not None:
        parent_category = db.query(ServiceCategory) \
            .options(joinedload(ServiceCategory.translations)) \
            .filter(ServiceCategory.id == category.parent_id).first()
        parent_translation = get_translation(parent_category.translations, lang)

    translation = get_translation(category.translations, lang)
    service_count = db.query(func.count(Service.id)).filter(Service.category_id == category.id).scalar()
    return {
        "id": category.id,
        "slug": category.slug,
        "parent_id": category.parent_id,
        "parent_name": parent_translation.name if parent_translation else None,
        "parent_slug": parent_category.slug if parent_category else None,
        "service_count": service_count,
        "item_count": service_count,
        "name": translation.name,
        "language": translation.language,
        "images": category.images,
        "order": category.order
    }

@service_categories_router.put("/{category_id}/translations")
def update_translation(
        category_id: int,
        lang: Language,
        data: ServiceCatTranslationUpdate,
        db: Session = Depends(get_db)
    ):
    category = db.query(ServiceCategory).filter(ServiceCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="ServiceCat not found")
    translation = db.query(ServiceCatTranslation).filter(
                                                    ServiceCatTranslation.category_id == category_id,
                                                    ServiceCatTranslation.language == lang
                                                ).first()
    if translation:
        translation.name = data.name
        db.commit()
        return {"message": f"Updated {lang} translation"}
    else:
        new_translation = ServiceCatTranslation(
            category_id=category_id,
            name=data.name,
            language=lang
        )
        db.add(new_translation)
        db.commit()
        return {"message": f"Created {lang} translation"}

@service_categories_router.post("/{category_id}/images", response_model=ServiceCatImageResponse)
def add_images(category_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    category = db.query(ServiceCategory).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="ServiceCat not found")
    image_url = handle_upload_image(image, category.slug)
    max_order = db.query(func.max(ServiceCatImage.order)).filter(ServiceCatImage.category_id == category_id).scalar()
    next_order = (max_order + 1) if max_order is not None else 0
    db_image = ServiceCatImage(
        category_id=category.id,
        image_url=image_url,
        order=next_order
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

@service_categories_router.delete("/{category_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category_image(category_id: int, image_id: int, db: Session = Depends(get_db)):
    category = db.query(ServiceCategory).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="ServiceCat not found")
    image = db.query(ServiceCatImage).get(image_id)
    if not image or image.category_id != category.id:
        raise HTTPException(status_code=404, detail="ServiceCat not found")
    handle_delete_image(image.image_url)
    db.delete(image)
    db.commit()
    return None