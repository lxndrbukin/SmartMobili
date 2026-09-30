from sqlalchemy import (
    Column, 
    Integer, 
    String, 
    Text, 
    DateTime, 
    ForeignKey, 
    Float
)
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
from db import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float)
    currency = Column(String(50), default="MDL")
    category_id = Column(Integer, ForeignKey("service_categories.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    service_category = relationship("ServiceCategory", back_populates="services")
    images = relationship("ServiceImage", back_populates="service", cascade="all, delete-orphan", order_by="ServiceImage.order")
    translations = relationship("ServiceTranslation", back_populates="service", cascade="all, delete-orphan")

class ServiceTranslation(Base):
    __tablename__ = "service_translations"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"))
    language = Column(String(2), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    embedding = Column(Vector(768))

    service = relationship("Service", back_populates="translations")

class ServiceImage(Base):
    __tablename__ = "service_images"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("services.id"))
    image_url = Column(String(500), nullable=False)
    order = Column(Integer, default=0)

    service = relationship("Service", back_populates="images")