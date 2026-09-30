from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File
from db_models.service_categories import ServiceCategory
from models.services import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
    ServiceTranslationUpdate,
    PaginatedResponse,
    Pagination,
    ServiceImageResponse,
    ServiceCategoryResponse
)
from db import get_db
from db_models.services import Service, ServiceImage, ServiceTranslation
from db_models.auth import User
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from cloud_storage import handle_upload_image, handle_delete_image
from utils import (
    get_translation, 
    Language, 
    generate_embedding, 
    get_current_user
)

services_router = APIRouter(prefix="/services", tags=["services"])


def get_service_category_and_children_ids(category_id: int, db: Session) -> list[int]:
    category = db.query(ServiceCategory).get(category_id)
    if not category:
        return [category_id]
    ids = [category.id]
    if category.parent_id is None:
        children = db.query(ServiceCategory.id).filter(ServiceCategory.parent_id == category_id).all()
        ids.extend([c.id for c in children])
    return ids


@services_router.get("/", status_code=status.HTTP_200_OK, response_model=PaginatedResponse)
def get_services(
        skip: int = 0,
        limit: int = 10,
        desc: bool = False,
        category_id: int | None = None,
        category_slug: str | None = None,
        search_query: str | None = None,
        lang: Language = Language.ro,
        db: Session = Depends(get_db)
    ):
    category = None
    query = db.query(Service) \
        .options(joinedload(Service.images), joinedload(Service.translations))
    if desc:
        query = query.order_by(Service.id.desc())
    if category_id:
        category_ids = get_service_category_and_children_ids(category_id, db)
        query = query.filter(Service.category_id.in_(category_ids))
    if category_slug:
        category = db.query(ServiceCategory).filter(ServiceCategory.slug == category_slug).first()
        if category:
            category_ids = get_service_category_and_children_ids(category.id, db)
            query = query.filter(Service.category_id.in_(category_ids))
    if search_query:
        query = query.join(ServiceTranslation).filter(
            ServiceTranslation.language == lang,
            or_(
                ServiceTranslation.title.ilike(f"%{search_query}%"),
                ServiceTranslation.description.ilike(f"%{search_query}%")
            )
        )
    services = query.offset(skip).limit(limit).all()
    result = []
    for service in services:
        parent_category = None
        parent_translation = None
        category = db.query(ServiceCategory) \
            .options(joinedload(ServiceCategory.translations)).filter(ServiceCategory.id == service.category_id).first()
        if category.parent_id is not None:
            parent_category = db.query(ServiceCategory) \
                .options(joinedload(ServiceCategory.translations)) \
                .filter(ServiceCategory.id == category.parent_id).first()
            parent_translation = get_translation(parent_category.translations, lang)
        category_translation = get_translation(category.translations, lang)
        service_translation = get_translation(service.translations, lang)
        result.append({
            "id": service.id,
            "price": service.price,
            "currency": service.currency,
            "category": ServiceCategoryResponse(
                id=category.id,
                slug=category.slug,
                name=category_translation.name,
                parent_slug=parent_category.slug if parent_category else None,
                parent_name=parent_translation.name if parent_translation else None
            ),
            "created_at": service.created_at,
            "title": service_translation.title,
            "description": service_translation.description,
            "language": service_translation.language,
            "images": service.images
        })
    return PaginatedResponse(
        data=result,
        pagination=Pagination(skip=skip, limit=limit)
    )


@services_router.put("/translation_embeddings")
def add_embeddings(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    translations = db.query(ServiceTranslation).filter(ServiceTranslation.embedding.is_(None)).all()
    for translation in translations:
        if translation.description == '' or translation.description is None:
            text_to_embed = f"Title: {translation.title}"
        else:
            text_to_embed = f"Title: {translation.title}\nDescription: {translation.description}"
        embedding_vector = generate_embedding(text_to_embed)
        translation.embedding = embedding_vector
    db.commit()
    return {"message": f"Translations updated"}


@services_router.get("/{service_id}", status_code=status.HTTP_200_OK, response_model=ServiceResponse)
def get_service(service_id: int, lang: Language = Language.ro, db: Session = Depends(get_db)):
    service = db.query(Service).options(joinedload(Service.images), joinedload(Service.translations)).get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    parent_category = None
    parent_translation = None
    category = db.query(ServiceCategory) \
        .options(joinedload(ServiceCategory.translations)).filter(ServiceCategory.id == service.category_id).first()
    if category.parent_id is not None:
        parent_category = db.query(ServiceCategory) \
            .options(joinedload(ServiceCategory.translations)) \
            .filter(ServiceCategory.id == category.parent_id).first()
        parent_translation = get_translation(parent_category.translations, lang)
    category_translation = get_translation(category.translations, lang)
    service_translation = get_translation(service.translations, lang)
    return {
            "id": service.id,
            "price": service.price,
            "currency": service.currency,
            "category": ServiceCategoryResponse(
                id=category.id,
                slug=category.slug,
                name=category_translation.name,
                parent_slug=parent_category.slug if parent_category else None,
                parent_name=parent_translation.name if parent_translation else None
            ),
            "created_at": service.created_at,
            "title": service_translation.title,
            "description": service_translation.description,
            "language": service_translation.language,
            "images": service.images
        }


@services_router.post("/", status_code=status.HTTP_201_CREATED, response_model=ServiceResponse)
def create_service(service: ServiceCreate, lang: Language = Language.ro, db: Session = Depends(get_db)):
    db_service = Service(
        price=service.price,
        currency=service.currency,
        category_id=service.category_id
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    for translation in service.translations:
        if translation.description == '' or translation.description is None:
            text_to_embed = f"Title: {translation.title}"
        else:
            text_to_embed = f"Title: {translation.title}\nDescription: {translation.description}"
        embedding_vector = generate_embedding(text_to_embed)
        db_translation = ServiceTranslation(
            service_id=db_service.id,
            language=translation.language,
            title=translation.title,
            description=translation.description,
            embedding=embedding_vector
        )
        db.add(db_translation)
    db.commit()
    db.refresh(db_service)
    category = db.query(ServiceCategory) \
        .options(joinedload(ServiceCategory.translations)).filter(ServiceCategory.id == service.category_id).first()
    category_translation = get_translation(category.translations, lang)
    translation = get_translation(db_service.translations, Language.ro)
    return {
            "id": db_service.id,
            "price": db_service.price,
            "currency": db_service.currency,
            "category": ServiceCategoryResponse(
                id=category.id,
                slug=category.slug,
                name=category_translation.name
            ),
            "created_at": db_service.created_at,
            "title": translation.title,
            "description": translation.description,
            "language": translation.language,
            "images": db_service.images,
        }


@services_router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
        service_id: int,
        data: ServiceUpdate,
        lang: Language = Language.ro,
        db: Session = Depends(get_db)
    ):
    service = db.query(Service).options(joinedload(Service.translations), joinedload(Service.images)).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(service, key, value)
    db.commit()
    db.refresh(service)
    parent_category = None
    parent_translation = None
    category = db.query(ServiceCategory) \
        .options(joinedload(ServiceCategory.translations)).filter(ServiceCategory.id == service.category_id).first()
    if category.parent_id is not None:
        parent_category = db.query(ServiceCategory) \
            .options(joinedload(ServiceCategory.translations)) \
            .filter(ServiceCategory.id == category.parent_id).first()
        parent_translation = get_translation(parent_category.translations, lang)
    category_translation = get_translation(category.translations, lang)
    translation = get_translation(service.translations, lang)
    return {
        "id": service.id,
        "price": service.price,
        "currency": service.currency,
        "category": ServiceCategoryResponse(
            id=category.id,
            slug=category.slug,
            name=category_translation.name,
            parent_slug=parent_category.slug if parent_category else None,
            parent_name=parent_translation.name if parent_translation else None
        ),
        "created_at": service.created_at,
        "title": translation.title,
        "description": translation.description,
        "language": translation.language,
        "images": service.images,
    }


@services_router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return None


@services_router.post("/{service_id}/images", response_model=ServiceImageResponse)
def add_images(service_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    service = db.query(Service).get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    category = db.query(ServiceCategory).get(service.category_id)
    image_url = handle_upload_image(image, category.slug)
    max_order = db.query(func.max(ServiceImage.order)).filter(ServiceImage.service_id == service_id).scalar()
    next_order = (max_order + 1) if max_order is not None else 0
    db_image = ServiceImage(
        service_id=service.id,
        image_url=image_url,
        order=next_order
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@services_router.delete("/{service_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(service_id: int, image_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    image = db.query(ServiceImage).get(image_id)
    if not image or image.service_id != service.id:
        raise HTTPException(status_code=404, detail="Image not found")
    handle_delete_image(image.image_url)
    db.delete(image)
    db.commit()
    return None


@services_router.put("/{service_id}/translations")
def update_translation(
        service_id: int,
        lang: Language,
        data: ServiceTranslationUpdate,
        db: Session = Depends(get_db)
    ):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    translation = db.query(ServiceTranslation).filter(
                                    ServiceTranslation.service_id == service_id,
                                            ServiceTranslation.language == lang
                                    ).first()
    if data.description == '' or data.description is None:
        text_to_embed = f"Title: {data.title}"
    else:
        text_to_embed = f"Title: {data.title}\nDescription: {data.description}"
    embedding_vector = generate_embedding(text_to_embed)
    if translation:
        translation.title = data.title
        if data.description is not None:
            translation.description = data.description
        translation.embedding = embedding_vector
        db.commit()
        return {"message": f"Updated {lang} translation"}
    else:
        new_translation = ServiceTranslation(
            service_id=service_id,
            language=lang,
            title=data.title,
            description=data.description,
            embedding=embedding_vector
        )
        db.add(new_translation)
        db.commit()
        return {"message": f"Created {lang} translation"}