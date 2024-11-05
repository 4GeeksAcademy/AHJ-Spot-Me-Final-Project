from flask_sqlalchemy import SQLAlchemy

import datetime
db = SQLAlchemy()

# Exercise/Sports Interests Table
class exercise_interests(db.Model):
    __tablename__ = 'exercise_interests'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

# Available Gyms Table
class gym_preference(db.Model):
    __tablename__ = 'gym_preference'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

# User Table
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String, unique=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer)
    gender_id = db.Column(db.Integer) 
    exercise_interests_id = db.Column(db.Integer, db.ForeignKey('exercise_interests.id'))
    gym_preference_id = db.Column(db.Integer, db.ForeignKey('gym_preference.id'))
    preferred_day_id = db.Column(db.Integer) 
    preferred_time_id = db.Column(db.Integer)
    profile_image = db.Column(db.String)
    fitness_level = db.Column(db.String)  # Enum removed, you can replace with a Foreign Key if needed
    gym_membership = db.Column(db.String)
    preferred_spotting_style = db.Column(db.String)  # Enum removed, you can replace with a Foreign Key if needed
    bio = db.Column(db.String)
    exercise_interest = db.relationship("exercise_interests")
    gym_pref = db.relationship("gym_preference")
    matches = db.relationship("Match", foreign_keys="[Match.user1_id]", back_populates="user1")

# Match Table
class Match(db.Model):
    __tablename__ = 'match'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    is_accepted = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_interaction = db.Column(db.DateTime)

    user1 = db.relationship("User", foreign_keys=[user1_id], back_populates="matches")
    user2 = db.relationship("User", foreign_keys=[user2_id])

# Draw from SQLAlchemy db.Model

