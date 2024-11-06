import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import create_engine
from eralchemy2 import render_er
import datetime

Base = declarative_base()

# Gender Table
class Gender(Base):
    __tablename__ = 'gender'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

# Day of Week Table
class DayOfWeek(Base):
    __tablename__ = 'day_of_week'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

# Time of Day Table
class TimeOfDay(Base):
    __tablename__ = 'time_of_day'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

# User Table
class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    # city = Column(String(100), nullable=False)
    # state = Column(String(50), nullable=False)
    age = Column(Integer)
    gender_id = Column(Integer, ForeignKey('gender.id'))
    preferred_day_id = Column(Integer, ForeignKey('day_of_week.id'))
    preferred_time_id = Column(Integer, ForeignKey('time_of_day.id'))
    profile_image = Column(String)
    fitness_level = Column(String)  # Enum removed, you can replace with a Foreign Key if needed
    gym_membership = Column(String)
    preferred_spotting_style = Column(String)  # Enum removed, you can replace with a Foreign Key if needed
    bio = Column(String)
    date_joined = Column(DateTime, default=datetime.datetime.utcnow)
    is_verified = Column(Boolean, default=False)

    gender = relationship("Gender")
    preferred_day = relationship("DayOfWeek")
    preferred_time = relationship("TimeOfDay")
    matches = relationship("Match", foreign_keys="[Match.user1_id]", back_populates="user1")

# Match Table
class Match(Base):
    __tablename__ = 'match'
    id = Column(Integer, primary_key=True)
    user1_id = Column(Integer, ForeignKey('user.id'))
    user2_id = Column(Integer, ForeignKey('user.id'))
    is_accepted = Column(Boolean, default=False)
    created_on = Column(DateTime, default=datetime.datetime.utcnow)
    last_interaction = Column(DateTime)

    user1 = relationship("User", foreign_keys=[user1_id], back_populates="matches")
    user2 = relationship("User", foreign_keys=[user2_id])

# Draw from SQLAlchemy base
try:
    result = render_er(Base, 'diagram.png')
    print("Success! Check the diagram.png file")
except Exception as e:
    print("There was a problem generating the diagram")
    raise e
