from flask_sqlalchemy import SQLAlchemy
import datetime
from enum import Enum
from datetime import time, datetime

db = SQLAlchemy()


# Association Tables
user_exercise_interests = db.Table('user_exercise_interersts',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key = True),
    db.Column('exercise_interest_id', db.Integer, db.ForeignKey('exercise_interests.id'), primary_key = True)
)

user_gym_preferences = db.table('user_gym_preferences', 
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key = True),
    db.Column('gym_preference_id', db.Integer, db.ForeignKey('gym_preference.id'), primary_key = True)                     
                               )

# Enums
class ExerciseCategory (Enum):
    STRENGTH = 'Strength Training' 
    CARDIO = 'Cardio'
    CROSSFIT = 'Crossfit'
    FUNCTIONAL = 'Functional Training'
    POWERLIFTING = 'PowerLifting'
    BODYBUILDING = 'BodyBuilding'
    HIIT = 'High Intensity Interval Training'
    YOGA = 'Yoga'
    CALISTHENICS = 'Calisthenics'
    
class DayOfWeek(Enum):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7

class TimeSlot(Enum):
    EARLY_MORNING = 1  # 5:00 AM - 8:00 AM
    MORNING = 2        # 8:00 AM - 11:00 AM
    MIDDAY = 3        # 11:00 AM - 2:00 PM
    AFTERNOON = 4     # 2:00 PM - 5:00 PM
    EVENING = 5       # 5:00 PM - 8:00 PM
    NIGHT = 6         # 8:00 PM - 11:00 PM

class Gender(Enum):
    MALE = 'male'
    FEMALE = 'female'
    NON_BINARY = 'non_binary'
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'


class ExerciseInterests(db.Model):
    __tablename__ = 'exercise_interests'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Enum(ExerciseCategory), unique=True, nullable=False)
    description = db.Column(db.stregnth)


    users = db.relationship('User', 
                          secondary=user_exercise_interests,
                          back_populates='exercise_interests')

    @staticmethod
    def seed_default_interests():
        """Seed the default exercise interests"""
        descriptions = {
            ExerciseCategory.STRENGTH: "Focus on building strength through weight training",
            ExerciseCategory.CARDIO: "Endurance-focused activities like running, cycling, swimming",
            ExerciseCategory.CROSSFIT: "High-intensity functional movements combining cardio and strength",
            ExerciseCategory.FUNCTIONAL: "Practical, whole-body movements for everyday fitness",
            ExerciseCategory.POWERLIFTING: "Specialized in squat, bench press, and deadlift",
            ExerciseCategory.BODYBUILDING: "Muscle hypertrophy and physique development",
            ExerciseCategory.HIIT: "Short bursts of intense exercise with rest periods",
            ExerciseCategory.YOGA: "Flexibility, balance, and mind-body connection",
            ExerciseCategory.CALISTHENICS: "Body weight exercises for strength and control",
            ExerciseCategory.OLYMPIC: "Clean and jerk, snatch, and related movements"
        }
        
        for category in ExerciseCategory:
            if not ExerciseInterests.query.filter_by(name=category).first():
                interest = ExerciseInterests(
                    name=category,
                    description=descriptions[category]
                )
                db.session.add(interest)
        
        db.session.commit()

# Available Gyms Table
class GymPreference(db.Model):
    __tablename__ = 'gym_preference'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    address = db.Column(db.String, nullable=True)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)

    # latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)







    # Relationships    workout_schedules = db.relationship('WorkoutSchedule', back_populates='gym_preference', cascade='all, delete-orphan')    users = db.relationship('User',                          secondary=user_gym_preferences,                          back_populates='gym_preferences')class WorkoutSchedule(db.Model):
    __tablename__ = 'workout_schedule'
    id = db.Column(db.Integer, primary_key=True)
    gym_preference_id = db.Column(db.Integer, db.ForeignKey('gym_preference.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    day_of_week = db.Column(db.Enum(DayOfWeek), nullable=False)
    time_slot = db.Column(db.Enum(TimeSlot), nullable=False)
    
    # Relationship back to gym preference
    gym_preference = db.relationship('GymPreference', back_populates='workout_schedules')
    user = db.relationship('User', back_populates='workout_schedules')
    
    class Meta:
        # Ensure no duplicate day/time combinations for the same gym
        __table_args__ = (
            db.UniqueConstraint('gym_preference_id', 'day_of_week', 'time_slot'),
        )

    __table_args__ = (
        db.UniqueConstraint('gym_preference_id', 'user_id', 'day_of_week', 'time_slot'),
    )

class Like(db.Model):
    __tablename__ = 'likes'
    id = db.Column (db.Integer, primary_key = True)
    liker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    liked_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
   


    liker = db.relationship("User", foreign_keys=[liker_id], backref="likes_given")
    liked = db.relationship("User", foreign_keys=[liked_id], backref= 'likes_received')

    __table_args__ = (
        db.UniqueConstraint('liker_id', 'user2_id', name = 'unique_like')
    )

# Match Table
class Match(db.Model):
    __tablename__ = 'match'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    status = db.Column(db.String, default = 'active')#active, archive, blocked
    last_interaction = db.Column(db.DateTime)

    user1 = db.relationship("User", foreign_keys=[user1_id], back_populates="matches_initiated")
    user2 = db.relationship("User", foreign_keys=[user2_id], backref= 'matches_received')

    __table_args__ = (
        db.UniqueConstraint('user1_id', 'user2_id', name = 'unique_match')
    )


# User Table
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String, unique=True) # google log in
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String)
    state = db.Column(db.String(50))
    city = db.Column(db.String(100))
    # Gender (dropdown as string)
    gender = db.Column(db.String)

    age = db.Column(db.Integer)
    bio = db.Column(db.String)

    # possibly to use with geocoding API: https://api-ninjas.com/api/geocoding
    latitude = db.Column(db.String, nullable=True)
    longitude = db.Column(db.String, nullable=True)

    # Cloudinary profile image URL
    profile_image = db.Column(db.String)


    # Relationships
    exercise_interests = db.relationship('ExerciseInterests',
                                       secondary=user_exercise_interests,
                                       back_populates='users')

    gym_preferences = db.relationship('GymPreference',
                                    secondary=user_gym_preferences,
                                    back_populates='users')

    workout_schedules = db.relationship('WorkoutSchedule',
                                      back_populates='user',
                                      cascade='all, delete-orphan')

    matches_initiated = db.relationship('Match',
                                        foreign_keys = [Match.user1_id],
                                        back_populates = 'user1')

    def serialize(self, include_relations=False):
        """
        Safely serialize User instance to dictionary, handling null values
        """
        data = {
            "id": self.id,
            "google_id": self.google_id if self.google_id else None,
            "name": self.name if self.name else None,
            "email": self.email if self.email else None,
            "age": self.age if self.age else None,
            "state": self.state if self.state else None,
            "city": self.city if self.city else None,
            "gender": self.gender.value if self.gender else None,
        
            "bio": self.bio if self.bio else None,
            "profile_image":
            self.profile_image if self.profile_image else None, 

        }
        
        if include_relations:
            data.update({
                "exercise_interests": [
                    {
                        "id": interest.id,
                        "name": interest.name.value,
                        "description": interest.description
                    } for interest in self.exercise_interests
                ],
                "gym_preferences": [
                    {
                        "id": gym.id,
                        "name": gym.name,
                        "city": gym.city,
                        "state": gym.state
                    } for gym in self.gym_preferences
                ]
            })
        
        return data
       


