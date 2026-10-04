from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base

class LatestWork(Base):
    __tablename__ = "latest_works"

    id = Column(Integer, primary_key=True, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    images = relationship("LatestWorkImage", back_populates="latest_work", cascade="all, delete-orphan", order_by="LatestWorkImage.order")
    translations = relationship("LatestWorkTranslation", back_populates="latest_work", cascade="all, delete-orphan")

class LatestWorkTranslation(Base):
    __tablename__ = "latest_work_translations"

    id = Column(Integer, primary_key=True, index=True)
    latest_work_id = Column(Integer, ForeignKey("latest_works.id"))
    language = Column(String(2), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)

    latest_work = relationship("LatestWork", back_populates="translations")

class LatestWorkImage(Base):
    __tablename__ = "latest_work_images"

    id = Column(Integer, primary_key=True, index=True)
    latest_work_id = Column(Integer, ForeignKey("latest_works.id"))
    image_url = Column(String(500), nullable=False)
    order = Column(Integer, default=0)

    latest_work = relationship("LatestWork", back_populates="images")
