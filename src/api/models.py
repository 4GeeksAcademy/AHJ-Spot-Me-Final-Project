from flask_sqlalchemy import SQLAlchemy
import datetime
from enum import Enum
from datetime import datetime

db = SQLAlchemy()

# Association Tables
user_exercise_interests = db.Table('user_exercise_interests',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('exercise_interest_id', db.Integer, db.ForeignKey('exercise_interests.id'), primary_key=True)
)

# Scheduling-related Enums
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

# User-related Enums
class ExerciseCategory(Enum):
    STRENGTH = 'Strength Training' 
    CARDIO = 'Cardio'
    CROSSFIT = 'Crossfit'
    FUNCTIONAL = 'Functional Training'
    POWERLIFTING = 'PowerLifting'
    BODYBUILDING = 'BodyBuilding'
    HIIT = 'High Intensity Interval Training'
    YOGA = 'Yoga'
    CALISTHENICS = 'Calisthenics'

class Gender(Enum):
    MALE = 'male'
    FEMALE = 'female'
    NON_BINARY = 'non_binary'
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'

class PreferredContactMethod(Enum):
    PHONE = "Phone"
    EMAIL = "Email"
    SOCIAL_MEDIA = "Social Media"

# Schedule Model (independent from gyms)
class WorkoutSchedule(db.Model):                         
    """
    Represents a user's preferred workout schedule.
    This is independent of gym preferences and simply indicates when the user wants to work out.
    """
    __tablename__ = 'workout_schedule'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    day_of_week = db.Column(db.Enum(DayOfWeek), nullable=False)
    time_slot = db.Column(db.Enum(TimeSlot), nullable=False)
    
    # Relationship to User
    user = db.relationship('User', backref=db.backref('workout_schedules', cascade='all, delete-orphan'))

    __table_args__ = (
        db.UniqueConstraint('user_id', 'day_of_week', 'time_slot'),
    )

# Gym Preference Model (independent from schedules)
class GymPreference(db.Model):
    """
    Represents a user's preferred gyms.
    This is independent of workout schedules and simply indicates which gyms the user prefers.
    """
    __tablename__ = 'gym_preference'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    address = db.Column(db.String, nullable=True)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

# Exercise Interests Model
class ExerciseInterests(db.Model):
    __tablename__ = 'exercise_interests'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Enum(ExerciseCategory), unique=True, nullable=False)
    description = db.Column(db.String)

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
            ExerciseCategory.CALISTHENICS: "Body weight exercises for strength and control"
        }
        
        for category in ExerciseCategory:
            if not ExerciseInterests.query.filter_by(name=category).first():
                interest = ExerciseInterests(
                    name=category,
                    description=descriptions.get(category, "")
                )
                db.session.add(interest)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding exercise interests: {str(e)}")

# Social Connection Models
class Like(db.Model):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    liker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    liked_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
   
    liker = db.relationship("User", foreign_keys=[liker_id], backref="likes_given")
    liked = db.relationship("User", foreign_keys=[liked_id], backref="likes_received")

    __table_args__ = (
        db.UniqueConstraint('liker_id', 'liked_id', name='unique_like'),
    )

class Match(db.Model):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String, default='active')  # active, archive, blocked
    last_interaction = db.Column(db.DateTime)

    user1 = db.relationship("User", foreign_keys=[user1_id], back_populates="matches_initiated")
    user2 = db.relationship("User", foreign_keys=[user2_id], back_populates='matches_received')

    __table_args__ = (
        db.UniqueConstraint('user1_id', 'user2_id', name='unique_match'),
    )

# Main User Model
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String, unique=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String)
    state = db.Column(db.String(50))
    city = db.Column(db.String(100))
    gender = db.Column(db.Enum(Gender))
    age = db.Column(db.Integer)
    bio = db.Column(db.String)
    preferred_contact_method = db.Column(db.Enum(PreferredContactMethod))
    phone = db.Column(db.String(15))
    social_media_handle = db.Column(db.String)
    social_media_platform = db.Column(db.String)
    latitude = db.Column(db.String, nullable=True)
    longitude = db.Column(db.String, nullable=True)
    profile_image = db.Column(db.String)

    # Independent relationships
    exercise_interests = db.relationship('ExerciseInterests',
                                       secondary=user_exercise_interests,
                                       back_populates='users')

    gym_preferences = db.relationship('GymPreference',
                                    backref='user',
                                    lazy=True,
                                    cascade='all, delete-orphan')

    # Note: workout_schedules relationship is defined via backref in WorkoutSchedule model

    # Social relationships
    matches_initiated = db.relationship('Match',
                                      foreign_keys=[Match.user1_id],
                                      back_populates='user1')
    
    matches_received = db.relationship('Match',
                                     foreign_keys=[Match.user2_id],
                                     back_populates='user2')

    def serialize(self, include_relations=False):
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
            "profile_image": self.profile_image if self.profile_image else None, 
            "phone": self.phone,
            "social_media_handle": self.social_media_handle,
            "social_media_platform": self.social_media_platform
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
                        "address": gym.address,
                        "city": gym.city,
                        "state": gym.state
                    } for gym in self.gym_preferences
                ],
                "workout_schedules": [
                    {
                        "day_of_week": schedule.day_of_week.name,
                        "time_slot": schedule.time_slot.name
                    } for schedule in self.workout_schedules
                ]
            })
        
        return data

class Subscriber(db.Model):
    __tablename__ = 'subscribers'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=True)
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "subscribed_at": self.subscribed_at.isoformat()
        }