from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    user_role = Column(String(25), nullable=False)
    email = Column(String(100))
    phone = Column(String(25))
    signup_at = Column(DateTime, default=datetime.utcnow)