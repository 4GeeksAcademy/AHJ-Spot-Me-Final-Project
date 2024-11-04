from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
import datetime

# Initialize the SQLAlchemy instance
db = SQLAlchemy()

# User Model
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)  # Empty for Google sign-ins
    age = db.Column(db.Integer)
    gender_id = db.Column(db.Integer, ForeignKey('gender.id'))
    preferred_day_id = db.Column(db.Integer, ForeignKey('day_of_week.id'))
    preferred_time_id = db.Column(db.Integer, ForeignKey('time_of_day.id'))
    profile_image = db.Column(db.String)
    fitness_level = db.Column(db.String)  # Can be replaced with ForeignKey to another table if needed
    gym_membership = db.Column(db.String)
    preferred_spotting_style = db.Column(db.String)  # Can be replaced with ForeignKey to another table if needed
    bio = db.Column(db.String)
    date_joined = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)

    # Relationships
    gender = relationship("Gender", backref="users")
    preferred_day = relationship("DayOfWeek", backref="users")
    preferred_time = relationship("TimeOfDay", backref="users")
    matches = relationship("Match", foreign_keys="[Match.user1_id]", back_populates="user1")

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "age": self.age,
            "profile_image": self.profile_image,
            "fitness_level": self.fitness_level,
            "gym_membership": self.gym_membership,
            "preferred_spotting_style": self.preferred_spotting_style,
            "bio": self.bio,
            "date_joined": self.date_joined.isoformat(),
            "is_verified": self.is_verified
        }

# Gender Table
class Gender(db.Model):
    __tablename__ = 'gender'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    def __repr__(self):
        return f'<Gender {self.name}>'

# Day of Week Table
class DayOfWeek(db.Model):
    __tablename__ = 'day_of_week'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    def __repr__(self):
        return f'<DayOfWeek {self.name}>'

# Time of Day Table
class TimeOfDay(db.Model):
    __tablename__ = 'time_of_day'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    def __repr__(self):
        return f'<TimeOfDay {self.name}>'

# Match Table
class Match(db.Model):
    __tablename__ = 'match'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, ForeignKey('user.id'))
    user2_id = db.Column(db.Integer, ForeignKey('user.id'))
    is_accepted = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_interaction = db.Column(db.DateTime)

    # Relationships
    user1 = relationship("User", foreign_keys=[user1_id], back_populates="matches")
    user2 = relationship("User", foreign_keys=[user2_id])

    def __repr__(self):
        return f'<Match between User {self.user1_id} and User {self.user2_id}>'
    def serialize(self):
        return{
            "id":self.id,
            "user1_id":self.user1_id,
            "user2_id":self.user2_id,
            "is_accepted":self.is_accepted,
            "created_on":self.created_on,
            "last_interaction":self.last_interaction

        }