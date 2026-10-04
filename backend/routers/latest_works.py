from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File
from db_models.latest_works import (
    LatestWork,
    LatestWorkTranslation,
    LatestWorkImage
)
from models.latest_works import (
    LatestWorkCreate,
    LatestWorkUpdate,
    LatestWorkResponse,
    LatestWorkTranslationUpdate,
    LatestWorkImageResponse,
    PaginatedResponse
)
from db import get_db
from db_models.auth import User
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from cloud_storage import handle_upload_image, handle_delete_image
from utils import (
    get_translation,
    Language,
    Pagination,
    UserRole,
    get_current_user
)

latest_works_router = APIRouter(prefix="/latest_works", tags=["latest_works"])


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.user_role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def serialize_latest_work(latest_work: LatestWork, lang: Language):
    translation = get_translation(latest_work.translations, lang)
    return {
        "id": latest_work.id,
        "is_active": latest_work.is_active,
        "created_at": latest_work.created_at,
        "title": translation.title,
        "description": translation.description,
        "language": translation.language,
        "images": latest_work.images
    }


def get_latest_work_or_404(latest_work_id: int, db: Session) -> LatestWork:
    latest_work = db.query(LatestWork) \
        .options(joinedload(LatestWork.images), joinedload(LatestWork.translations)) \
        .filter(LatestWork.id == latest_work_id).first()
    if not latest_work:
        raise HTTPException(status_code=404, detail="Latest work not found")
    return latest_work


@latest_works_router.get("/", status_code=status.HTTP_200_OK, response_model=PaginatedResponse)
def get_latest_works(
        skip: int = 0,
        limit: int = 12,
        include_inactive: bool = False,
        lang: Language = Language.ro,
        db: Session = Depends(get_db)
    ):
    query = db.query(LatestWork) \
        .options(joinedload(LatestWork.images), joinedload(LatestWork.translations))
    if not include_inactive:
        query = query.filter(LatestWork.is_active == True)
    latest_works = query.order_by(LatestWork.created_at.desc(), LatestWork.id.desc()) \
        .offset(skip).limit(limit).all()
    return PaginatedResponse(
        data=[serialize_latest_work(latest_work, lang) for latest_work in latest_works],
        pagination=Pagination(skip=skip, limit=limit)
    )


@latest_works_router.get("/{latest_work_id}", status_code=status.HTTP_200_OK, response_model=LatestWorkResponse)
def get_latest_work(latest_work_id: int, lang: Language = Language.ro, db: Session = Depends(get_db)):
    latest_work = get_latest_work_or_404(latest_work_id, db)
    return serialize_latest_work(latest_work, lang)


@latest_works_router.post("/", status_code=status.HTTP_201_CREATED, response_model=LatestWorkResponse)
def create_latest_work(
        data: LatestWorkCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(require_admin)
    ):
    latest_work = LatestWork(is_active=data.is_active)
    db.add(latest_work)
    db.commit()
    db.refresh(latest_work)
    for translation in data.translations:
        db_translation = LatestWorkTranslation(
            latest_work_id=latest_work.id,
            language=translation.language,
            title=translation.title,
            description=translation.description
        )
        db.add(db_translation)
    db.commit()
    db.refresh(latest_work)
    return serialize_latest_work(latest_work, Language.ro)


@latest_works_router.put("/{latest_work_id}", response_model=LatestWorkResponse)
def update_latest_work(
        latest_work_id: int,
        data: LatestWorkUpdate,
        lang: Language = Language.ro,
        db: Session = Depends(get_db),
        current_user: User = Depends(require_admin)
    ):
    latest_work = get_latest_work_or_404(latest_work_id, db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(latest_work, key, value)
    db.commit()
    db.refresh(latest_work)
    return serialize_latest_work(latest_work, lang)


@latest_works_router.delete("/{latest_work_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_latest_work(
        latest_work_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(require_admin)
    ):
    latest_work = get_latest_work_or_404(latest_work_id, db)
    for image in latest_work.images:
        handle_delete_image(image.image_url)
    db.delete(latest_work)
    db.commit()
    return None


@latest_works_router.post("/{latest_work_id}/images", response_model=LatestWorkImageResponse)
def add_image(
        latest_work_id: int,
        image: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: User = Depends(require_admin)
    ):
    latest_work = db.query(LatestWork).get(latest_work_id)
    if not latest_work:
        raise HTTPException(status_code=404, detail="Latest work not found")
    image_url = handle_upload_image(image, "latest_works")
    max_order = db.query(func.max(LatestWorkImage.order)) \
        .filter(LatestWorkImage.latest_work_id == latest_work_id).scalar()
    next_order = (max_order + 1) if max_order is not None else 0
    db_image = LatestWorkImage(
        latest_work_id=latest_work.id,
        image_url=image_url,
        order=next_order
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@latest_works_router.delete("/{latest_work_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
        latest_work_id: int,
        image_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(require_admin)
    ):
    latest_work = db.query(LatestWork).get(latest_work_id)
    if not latest_work:
        raise HTTPException(status_code=404, detail="Latest work not found")
    image = db.query(LatestWorkImage).get(image_id)
    if not image or image.latest_work_id != latest_work.id:
        raise HTTPException(status_code=404, detail="Image not found")
    handle_delete_image(image.image_url)
    db.delete(image)
    db.commit()
    return None


@latest_works_router.put("/{latest_work_id}/translations")
def update_translation(
        latest_work_id: int,
        lang: Language,
        data: LatestWorkTranslationUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(require_admin)
    ):
    latest_work = db.query(LatestWork).filter(LatestWork.id == latest_work_id).first()
    if not latest_work:
        raise HTTPException(status_code=404, detail="Latest work not found")
    translation = db.query(LatestWorkTranslation).filter(
                                    LatestWorkTranslation.latest_work_id == latest_work_id,
                                            LatestWorkTranslation.language == lang
                                    ).first()
    if translation:
        translation.title = data.title
        if data.description is not None:
            translation.description = data.description
        db.commit()
        return {"message": f"Updated {lang} translation"}
    else:
        new_translation = LatestWorkTranslation(
            latest_work_id=latest_work_id,
            language=lang,
            title=data.title,
            description=data.description
        )
        db.add(new_translation)
        db.commit()
        return {"message": f"Created {lang} translation"}
