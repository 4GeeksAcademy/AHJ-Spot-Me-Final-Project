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
    state = db.Column(db.String(50))
    city = db. Column(db.String(100))
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
            "gender_id": self.gender_id if self.gender_id else None,
            "exercise_interests_id": self.exercise_interests_id if self.exercise_interests_id else None,
            "gym_preference_id": self.gym_preference_id if self.gym_preference_id else None,
            "preferred_day_id": self.preferred_day_id if self.preferred_day_id else None,
            "preferred_time_id": self.preferred_time_id if self.preferred_time_id else None,
            "profile_image": self.profile_image if self.profile_image else None,
            "fitness_level": self.fitness_level if self.fitness_level else None,
            "gym_membership": self.gym_membership if self.gym_membership else None,
            "preferred_spotting_style": self.preferred_spotting_style if self.preferred_spotting_style else None,
            "bio": self.bio if self.bio else None
        }
        
        if include_relations:
            data.update({
                "exercise_interest": self.exercise_interest.serialize() if self.exercise_interest else None,
                "gym_preference": self.gym_pref.serialize() if self.gym_pref else None
            })
        
        return data

    # Alternative concise version using getattr
    # def serialize_concise(self, include_relations=False):
    #     fields = [
    #         "id", "google_id", "name", "email", "age", "state", "city", 
    #         "gender_id", "exercise_interests_id", "gym_preference_id", 
    #         "preferred_day_id", "preferred_time_id", "profile_image", 
    #         "fitness_level", "gym_membership", "preferred_spotting_style", "bio"
    #     ]
    #     data = {field: getattr(self, field, None) for field in fields}
        
    #     if include_relations:
    #         data.update({
    #             "exercise_interest": self.exercise_interest.serialize() if self.exercise_interest else None,
    #             "gym_preference": self.gym_pref.serialize() if self.gym_pref else None
    #         })
            
    #     return data

    # how you would use this info above in routes.py: 
    # Or using the concise version
        # user_data = user.serialize_concise()  # Just user data
        # user_data_with_relations = user.serialize_concise(include_relations=True)  # Include related data

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

