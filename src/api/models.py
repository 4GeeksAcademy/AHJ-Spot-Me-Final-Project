from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
import datetime



db = SQLAlchemy()

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(80), unique=False, nullable=False)
#     is_active = db.Column(db.Boolean(), unique=False, nullable=False)
#     longitude = db.Column(db.Float, nullable=False)
#     latitude = db.Column(db.Float, nullable=False)

#     gender = db.Column(db.String(80), nullable=False)
#     def __repr__(self):
#         return f'<User {self.email}>'

#     def serialize(self):
#         return {
#             "id": self.id,
#             "email": self.email,
#             "longitude": self.longitude,
#             "latitude": self.latitude,
#             "gender": self.gender,
            # do not serialize the password, its a security breach
        # }
    

# Gender Table
class Gender(db.Model):
    __tablename__ = 'gender'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

# Day of Week Table
class DayOfWeek(db.Model):
    __tablename__ = 'day_of_week'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

# Time of Day Table
class TimeOfDay(db.Model):
    __tablename__ = 'time_of_day'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

# User Table
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer)
    gender_id = db.Column(db.Integer, ForeignKey('gender.id'))
    preferred_day_id = db.Column(db.Integer, ForeignKey('day_of_week.id'))
    preferred_time_id = db.Column(db.Integer, ForeignKey('time_of_day.id'))
    profile_image = db.Column(db.String)
    fitness_level = db.Column(db.String)  # Enum removed, you can replace with a Foreign Key if needed
    gym_membership = db.Column(db.String)
    preferred_spotting_style = db.Column(db.String)  # Enum removed, you can replace with a Foreign Key if needed
    bio = db.Column(db.String)
    date_joined = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)

    gender = relationship("Gender")
    preferred_day = relationship("DayOfWeek")
    preferred_time = relationship("TimeOfDay")
    matches = relationship("Match", foreign_keys="[Match.user1_id]", back_populates="user1")

# Match Table
class Match(db.Model):
    __tablename__ = 'match'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, ForeignKey('user.id'))
    user2_id = db.Column(db.Integer, ForeignKey('user.id'))
    is_accepted = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_interaction = db.Column(db.DateTime)

    user1 = relationship("User", foreign_keys=[user1_id], back_populates="matches")
    user2 = relationship("User", foreign_keys=[user2_id])


