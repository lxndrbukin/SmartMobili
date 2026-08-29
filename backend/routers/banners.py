from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File
from db_models.banners import (
    Banner,
    BannerTranslation,
    BannerImage
)
from models.banners import (
    BannerCreate,
    BannerResponse,
    BannerUpdate,
    BannerTranslationUpdate,
    BannerImageResponse,
    PaginatedResponse
)
from db import get_db
from utils import Language, Pagination, get_translation
from cloud_storage import handle_upload_image, handle_delete_image
from sqlalchemy.orm import Session, joinedload

banners_router = APIRouter(prefix="/banners", tags=["banners"])

@banners_router.post("/", status_code=status.HTTP_201_CREATED, response_model=BannerResponse)
def create_banner(data: BannerCreate, db: Session = Depends(get_db)):
    banner = Banner(
        url=data.url
    )
    db.add(banner)
    db.commit()
    db.refresh(banner)
    for translation in data.translations:
        banner_translation = BannerTranslation(
            banner_id=banner.id,
            header=translation.header,
            language=translation.language,
            body=translation.body
        )
        db.add(banner_translation)
    db.commit()
    db.refresh(banner)
    translation = get_translation(banner.translations, Language.ro)
    return {
        "id": banner.id,
        "url": banner.url,
        "header": translation.header,
        "body": translation.body,
        "language": translation.language,
        "images": []
    }

@banners_router.get("/", status_code=status.HTTP_200_OK, response_model=PaginatedResponse)
def get_banners(
        skip: int = 0,
        limit: int = 10,
        lang: Language = Language.ro, 
        db: Session = Depends(get_db)
    ):
    banners_query = db.query(Banner) \
        .options(
            joinedload(Banner.images),
            joinedload(Banner.translations)
        ).order_by(Banner.id.desc()).offset(skip).limit(limit).all()
    banners_list = []
    for banner in banners_query:
        translation = get_translation(banner.translations, lang)
        banners_list.append({
            "id": banner.id,
            "url": banner.url,
            "header": translation.header,
            "body": translation.body,
            "language": translation.language,
            "images": banner.images
        })
    return PaginatedResponse(
        data=banners_list,
        pagination=Pagination(skip=skip, limit=limit)
    )

@banners_router.get("/{banner_id}", status_code=status.HTTP_200_OK, response_model=BannerResponse)
def get_banner(banner_id: int, lang: Language = Language.ro, db: Session = Depends(get_db)):
    banner = db.query(Banner) \
        .options(joinedload(Banner.images), joinedload(Banner.translations)) \
        .get(banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    translation = get_translation(banner.translations, lang)
    return {
        "id": banner.id,
        "url": banner.url,
        "header": translation.header,
        "body": translation.body,
        "language": translation.language,
        "images": banner.images
    }

@banners_router.put("/{banner_id}", response_model=BannerResponse)
def update_banner(
        banner_id: int, 
        data: BannerUpdate, 
        lang: Language = Language.ro,
        db: Session = Depends(get_db)
    ):
    banner = db.query(Banner) \
        .options(joinedload(Banner.images), joinedload(Banner.translations)) \
        .get(banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(banner, key, value)
    db.commit()
    db.refresh(banner)
    translation = get_translation(banner.translations, lang)
    return {
        "id": banner.id,
        "url": banner.url,
        "header": translation.header,
        "body": translation.body,
        "language": translation.language,
        "images": banner.images
    }

@banners_router.delete("/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    db.delete(banner)
    db.commit()
    return None

@banners_router.post("/{banner_id}/images", response_model=BannerImageResponse)
def add_images(
        banner_id: int, 
        image: UploadFile = File(...),
        db: Session = Depends(get_db)
    ):
    banner = db.query(Banner).get(banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    image_url = handle_upload_image(image, "banner")
    existing_count = db.query(BannerImage).filter(BannerImage.item_id == banner_id).count()
    db_image = BannerImage(
        item_id=banner.id,
        image_url=image_url,
        order=existing_count
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

@banners_router.delete("/{banner_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(banner_id: int, image_id: int, db: Session = Depends(get_db)):
    item = db.query(Banner).get(banner_id)
    if not item:
        raise HTTPException(status_code=404, detail="Banner not found")
    image = db.query(BannerImage).get(image_id)
    if not image or image.item_id != item.id:
        raise HTTPException(status_code=404, detail="Image not found")
    handle_delete_image(image.image_url)
    db.delete(image)
    db.commit()
    return None

@banners_router.put("/{banner_id}/translations")
def update_translation(
        banner_id: int,
        lang: Language,
        data: BannerTranslationUpdate,
        db: Session = Depends(get_db)
    ):
    banner = db.query(Banner).filter(Banner.id == item_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Item not found")
    translation = db.query(BannerTranslation).filter(
                                    BannerTranslation.banner_id == banner_id,
                                            BannerTranslation.language == lang
                                    ).first()
    if translation:
        translation.header = data.header
        if data.body is not None:
            translation.body = data.body
        db.commit()
        return {"message": f"Updated {lang} translation"}

    else:
        new_translation = BannerTranslation(
            banner_id=banner_id,
            language=lang,
            header=data.title,
            body=data.description,
        )
        db.add(new_translation)
        db.commit()
        return {"message": f"Created {lang} translation"}