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
        "profile_image": self.profile_image if self.profile_image else None,
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
            "workout_schedules": [
                {
                    "id": schedule.id,
                    "day_of_week": schedule.day_of_week.name,
                    "time_slot": schedule.time_slot.name
                } for schedule in self.workout_schedules
            ]
        })
    
    return data