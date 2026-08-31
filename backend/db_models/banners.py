from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    
    images = relationship("BannerImage", back_populates="banner", cascade="all, delete-orphan")
    translations = relationship("BannerTranslation", back_populates="banner", cascade="all, delete-orphan")

class BannerTranslation(Base):
    __tablename__ = "banner_translation"

    id = Column(Integer, primary_key=True, index=True)
    banner_id = Column(Integer, ForeignKey("banners.id"))
    language = Column(String(2), nullable=False)
    header = Column(String(50), nullable=False)
    body = Column(String(200), nullable=True)

    banner = relationship("Banner", back_populates="translations")

class BannerImage(Base):
    __tablename__ = "banner_images"

    id = Column(Integer, primary_key=True, index=True)
    banner_id  = Column(Integer, ForeignKey("banners.id"))
    image_url = Column(String(500), nullable=False)
    order = Column(Integer, default=0)

    banner = relationship("Banner", back_populates="images")

