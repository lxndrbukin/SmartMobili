from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
from db import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="items")
    images = relationship("ItemImage", back_populates="item", cascade="all, delete-orphan")
    translations = relationship("ItemTranslation", back_populates="item", cascade="all, delete-orphan")
    inquiries = relationship("Inquiry", back_populates="item")

class ItemTranslation(Base):
    __tablename__ = "item_translations"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    language = Column(String(2), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    embedding = Column(Vector(768))

    item = relationship("Item", back_populates="translations")

class ItemImage(Base):
    __tablename__ = "item_images"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    image_url = Column(String(500), nullable=False)
    order = Column(Integer, default=0)

    item = relationship("Item", back_populates="images")