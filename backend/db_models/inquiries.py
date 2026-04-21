from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db import Base
from datetime import datetime

class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False)
    subject = Column(String(100), nullable=False)
    description = Column(Text)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    phone = Column(String(25))
    email = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    telegram = Column(Boolean)
    whatsapp = Column(Boolean)
    viber = Column(Boolean)

    item = relationship("Item", back_populates="inquiries")
    user = relationship("User", back_populates="inquiries")