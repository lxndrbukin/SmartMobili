from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File
from db_models.categories import Category
from models.items import ItemCreate, ItemUpdate, ItemResponse, ItemTranslationUpdate, PaginatedResponse, Pagination, ItemImageResponse
from db import get_db
from db_models.items import Item, ItemImage, ItemTranslation
from sqlalchemy.orm import Session, joinedload
from cloud_storage import upload_item_image, delete_item_image
from utils import get_translation, Language

items_router = APIRouter(prefix="/items", tags=["items"])

@items_router.get("/", status_code=status.HTTP_200_OK, response_model=PaginatedResponse)
def get_items(
        skip: int = 0,
        limit: int = 10,
        category_id: int | None = None,
        lang: Language = Language.ro,
        db: Session = Depends(get_db)
    ):
    query = db.query(Item) \
        .options(joinedload(Item.images), joinedload(Item.translations))
    if category_id:
        query = query.filter(Item.category_id == category_id)
    items = query.offset(skip).limit(limit).all()
    result = []
    for item in items:
        translation = get_translation(item.translations, lang)
        result.append({
            "id": item.id,
            "price": item.price,
            "category_id": item.category_id,
            "created_at": item.created_at,
            "title": translation.title,
            "description": translation.description,
            "language": translation.language,
            "images": item.images
        })
    return PaginatedResponse(
        data=result,
        pagination=Pagination(skip=skip, limit=limit)
    )

@items_router.get("/{item_id}", status_code=status.HTTP_200_OK, response_model=ItemResponse)
def get_item(item_id: int, lang: Language = Language.ro, db: Session = Depends(get_db)):
    item = db.query(Item).options(joinedload(Item.images), joinedload(Item.translations)).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    translation = get_translation(item.translations, lang)
    return {
            "id": item.id,
            "price": item.price,
            "category_id": item.category_id,
            "created_at": item.created_at,
            "title": translation.title,
            "description": translation.description,
            "language": translation.language,
            "images": item.images
        }

@items_router.post("/", status_code=status.HTTP_201_CREATED, response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(
        price=item.price,
        category_id=item.category_id
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    for translation in item.translations:
        db_translation = ItemTranslation(
            item_id=db_item.id,
            language=translation.language,
            title=translation.title,
            description=translation.description
        )
        db.add(db_translation)
    db.commit()
    db.refresh(db_item)
    translation = get_translation(db_item.translations, Language.ro)
    return {
            "id": db_item.id,
            "price": db_item.price,
            "category_id": db_item.category_id,
            "created_at": db_item.created_at,
            "title": translation.title,
            "description": translation.description,
            "language": translation.language,
            "images": db_item.images
        }

@items_router.put("/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, data: ItemUpdate, db: Session = Depends(get_db)):
    item = db.query(Item).options(joinedload(Item.translations), joinedload(Item.images)).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if data.price is not None:
        item.price = data.price
    if data.category_id is not None:
        item.category_id = data.category_id
    db.commit()
    db.refresh(item)
    translation = get_translation(item.translations, Language.ro)
    return {
        "id": item.id,
        "price": item.price,
        "category_id": item.category_id,
        "created_at": item.created_at,
        "title": translation.title,
        "description": translation.description,
        "language": translation.language,
        "images": item.images
    }

@items_router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()

    return None

@items_router.post("/{item_id}/images", response_model=ItemImageResponse)
def add_images(item_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    item = db.query(Item).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    category = db.query(Category).get(item.category_id)
    image_url = upload_item_image(image, category.name)
    existing_count = db.query(ItemImage).filter(ItemImage.item_id == item_id).count()
    db_image = ItemImage(
        item_id=item.id,
        image_url=image_url,
        order=existing_count
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

@items_router.delete("/{item_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(item_id: int, image_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    image = db.query(ItemImage).get(image_id)
    if not image or image.item_id != item.id:
        raise HTTPException(status_code=404, detail="Image not found")
    delete_item_image(image.image_url)
    db.delete(image)
    db.commit()
    return None

@items_router.put("/{item_id}/translations")
def update_translation(
        item_id: int,
        lang: Language,
        data: ItemTranslationUpdate,
        db: Session = Depends(get_db)
    ):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    translation = db.query(ItemTranslation).filter(
                                    ItemTranslation.item_id == item_id,
                                            ItemTranslation.language == lang
                                    ).first()
    if translation:
        translation.title = data.title
        if data.description is not None:
            translation.description = data.description
        db.commit()
        return {"message": f"Updated {lang} translation"}

    else:
        new_translation = ItemTranslation(
            item_id=item_id,
            language=lang,
            title=data.title,
            description=data.description
        )
        db.add(new_translation)
        db.commit()
        return {"message": f"Created {lang} translation"}