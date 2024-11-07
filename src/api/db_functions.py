from api.models import db, User  # Assuming a SQLAlchemy model for users

def get_user_by_google_id(google_id):
    return User.query.filter_by(google_id=google_id).first()

def create_user(email, google_id, name):
    new_user = User(email=email, google_id=google_id, name=name)
    db.session.add(new_user)
    db.session.commit()
    return new_user