from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False)

    images = relationship("CategoryImage", back_populates="category", cascade="all, delete-orphan")
    items = relationship("Item", back_populates="category", cascade="all, delete-orphan")
    translations = relationship("CategoryTranslation", back_populates="category", cascade="all, delete-orphan")

class CategoryTranslation(Base):
    __tablename__ = "category_translations"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    language = Column(String(2), nullable=False)
    name = Column(String(100), nullable=False)

    category = relationship("Category", back_populates="translations")

class CategoryImage(Base):
    __tablename__ = "category_images"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(500), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    order = Column(Integer, default=0)

    category = relationship("Category", back_populates="images")