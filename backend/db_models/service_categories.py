from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from db import Base

class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), nullable=False)
    parent_id = Column(Integer, ForeignKey("service_categories.id"), nullable=True)
    order = Column(Integer, default=0)

    images = relationship("ServiceCatImage", back_populates="service_category", cascade="all, delete-orphan", order_by="ServiceCatImage.order")
    services = relationship("Service", back_populates="service_category", cascade="all, delete-orphan")
    translations = relationship("ServiceCatTranslation", back_populates="category", cascade="all, delete-orphan")

    parent = relationship("ServiceCategory", remote_side=[id], back_populates="children")
    children = relationship("ServiceCategory", back_populates="parent", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("slug", "parent_id", name="uq_service_cat_slug_parent"),
    )

class ServiceCatTranslation(Base):
    __tablename__ = "service_cat_translations"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("service_categories.id"))
    language = Column(String(2), nullable=False)
    name = Column(String(100), nullable=False)

    category = relationship("ServiceCategory", back_populates="translations")

class ServiceCatImage(Base):
    __tablename__ = "service_cat_images"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(500), nullable=False)
    category_id = Column(Integer, ForeignKey("service_categories.id"), nullable=False)
    order = Column(Integer, default=0)

    service_category = relationship("ServiceCategory", back_populates="images")