from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    user_role = Column(String(25), nullable=False, default="user")
    signup_at = Column(DateTime, default=datetime.utcnow)

    inquiries = relationship("Inquiry", back_populates="user")

class UserData(Base):
    __tablename__ = "userdata"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100))
    phone = Column(String(25))
    user_id = Column(Integer, ForeignKey("users.id"))