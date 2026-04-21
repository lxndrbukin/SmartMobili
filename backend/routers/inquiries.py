from fastapi import APIRouter, status, Depends, HTTPException
from models.inquiries import InquiryCreate, InquiryResponse, InquiryUpdate, PaginatedResponse
from utils import Pagination
from db_models.inquiries import Inquiry
from sqlalchemy.orm import Session
from db import get_db

inquiries_router = APIRouter(prefix="/inquiries", tags=["inquiries"])

@inquiries_router.post("/", status_code=status.HTTP_201_CREATED, response_model=InquiryResponse)
def create_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    inquiry = Inquiry(
        name=data.name,
        subject=data.subject,
        description=data.description,
        phone=data.phone,
        email=data.email,
        item_id=data.item_id,
        telegram=data.telegram,
        whatsapp=data.whatsapp,
        viber=data.viber
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry

@inquiries_router.get("/", status_code=status.HTTP_200_OK, response_model=PaginatedResponse)
def get_inquiries(user_id: int = None, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    if user_id:
        inquiries = db.query(Inquiry).filter(Inquiry).offset(skip).limit(limit).all()
    else:
        inquiries = db.query(Inquiry).offset(skip).limit(limit).all()
    return PaginatedResponse(
        data=inquiries,
        pagination=Pagination(skip=skip, limit=limit)
    )

@inquiries_router.get("/{inquiry_id}", status_code=status.HTTP_200_OK, response_model=InquiryResponse)
def get_inquiry(inquiry_id: int, db: Session = Depends(get_db)):
    inquiry = db.query(Inquiry).get(inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry

@inquiries_router.put("/{inquiry_id}", response_model=InquiryResponse)
def update_inquiry(inquiry_id: int, data: InquiryUpdate, db: Session = Depends(get_db)):
    inquiry = db.query(Inquiry).get(inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if data.name is not None:
        inquiry.name = data.name
    if data.subject is not None:
        inquiry.subject = data.subject
    if data.description is not None:
        inquiry.description = data.description
    if data.phone is not None:
        inquiry.phone = data.phone
    if data.email is not None:
        inquiry.email = data.email
    if data.telegram is not None:
        inquiry.telegram = data.telegram
    if data.whatsapp is not None:
        inquiry.whatsapp = data.whatsapp
    if data.viber is not None:
        inquiry.viber = data.viber
    db.commit()
    db.refresh(inquiry)
    return inquiry

@inquiries_router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry(inquiry_id: int, db: Session = Depends(get_db)):
    inquiry = db.query(Inquiry).get(inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inquiry)
    db.commit()
    return None