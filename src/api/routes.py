"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, Blueprint
from api.models import db, User, ExerciseInterests, WorkoutSchedule, Like, Match, DayOfWeek, TimeSlot, Gender, User, db, Match
from api.send_email import send_email
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from api.blacklist import blacklist
from api.db_functions import get_user_by_google_id, create_user
from api.google_auth import verify_google_token 
from datetime import datetime, timedelta
import os


# from flask import jsonify, request
# from sqlalchemy import or_, and_

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/auth-google", methods=["POST"])
def google_login():
    data = request.json
    token = data.get("token")

    # Step 1: Verify Google Token
    user_info = verify_google_token(token)
    if not user_info:
        return jsonify({"error": "Invalid Google token"}), 400

    # Extract relevant info from the token
    google_id = user_info["sub"]  # Unique identifier for the Google account
    email = user_info["email"]
    name = user_info["name"]

    # Step 2: Check if user already exists in database (use your database logic here)
    # Assuming a function `get_user_by_google_id` checks if user exists
    user = get_user_by_google_id(google_id)
    if not user:
        # Create new user if they don't exist
        user = create_user(email=email, google_id=google_id, name=name)

    serialized_user = user.serialize()
    print(serialized_user)
    
    # Step 3: Generate a JWT token for the user
    access_token = create_access_token(identity=serialized_user["id"])

    return jsonify(
        access_token=access_token
    )





@api.route('/signup', methods=['POST'])
def sign_up():
    try:
        data = request.json
        
        # Check if required data exists
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Get data from request
        email = data.get("email")
        password = data.get("password")
        full_name = data.get("full_name")
        state = data.get("state")
        city = data.get("city")
        
        # Validate required fields
        if not email or not password or not full_name:
            return jsonify({"error": "Required fields missing (email, password, full_name)"}), 400

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 400

        # Create new user
        new_user = User(
            email=email,
            password_hash=generate_password_hash(password),
            name=full_name,
            state=state if state else None,
            city=city if city else None
        )
        
        # Add and commit to database
        db.session.add(new_user)
        db.session.commit()

        # Create response with just the basic user data
        response_body = {
            "message": "User successfully created",
            "user": new_user.serialize()  # Using basic serialization without relations
        }

        return jsonify(response_body), 201

    except Exception as e:
        # Roll back the session in case of error
        db.session.rollback()
        return jsonify({
            "error": "An error occurred while creating the user",
            "details": str(e)
        }), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        # Get data from request body
        request_data = request.get_json()
        
        # Extract email and password from request
        email = request_data.get('email')
        password = request_data.get('password')
        
        # Validate required fields
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # Check if user exists and password is correct
        if user and check_password_hash(user.password_hash, password):
            # Create access token
            access_token = create_access_token(identity=user.id)
            return jsonify({
                "message": "Login successful",
                "access_token": access_token
            }), 200
        
        return jsonify({"error": "Invalid email or password"}), 401
        
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({"error": "An error occurred during login"}), 500


@api.route('/logout', methods=['POST'])
@jwt_required()
def logout_user():
    try:
        jti = get_jwt()["jti"] # Get the token ID
        blacklist.add(jti) # Invalidate the token
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"error": f"Logout failed: {str(e)}"}), 500
    

@api.route("/forgot-password", methods=["POST"])
def forgot_password(): 
    email=request.json.get("email")

    user = User.query.filter_by(email=email).first()
    if user is None: 
        return jsonify({"message": "email does not exist"}), 400
    
    expiration_time=datetime.utcnow() + timedelta(minutes=20)
    token = jwt.encode({"email": email, "exp": expiration_time}, os.getenv("FLASK_APP_KEY"), algorithm="HS256")

    # email_value=f"Click here to reset password.\n{os.getenv('FRONTEND_URL')}/forgot-password?token={token}"
    email_value=f"""
        Hello,

        You have requested to reset your password. Please click the link below to reset your password:

        {os.getenv('FRONTEND_URL')}/reset-password?token={token}

        This link will expire in 20 minutes.

        If you didn't request this password reset, please ignore this email or contact support if you have concerns.

        Best regards,
        Spot Me Team
        """
    send_email(email, email_value, "Password Recovery: Spot Me")
    return jsonify({"message": "recovery email sent"}), 200

@api.route("/reset-password/<token>", methods=["PUT"])
def reset_password(token):
    data=request.get_json()
    password=data.get("password")

    try:
        decoded_token=jwt.decode(token, os.getenv("FLASK_APP_KEY"), algorithms=["HS256"])
        email=decoded_token.get("email")
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired" }), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 400
    
    user=User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User does not exist"}), 400
    
    user.password_hash=generate_password_hash(password)
    db.session.commit()

    send_email(email, "Password Successfully Reset", "password reset confirmation for Spot Me")
    return jsonify({"message": "your password has now been reset"}), 200

# Get got an error in this endpoint
@api.route('/check-profile', methods=['GET'])
@jwt_required()
def check_profile_completeness():
    # Get the current user based on the token
    current_user = User.query.filter_by(id=get_jwt_identity()).first()

    if not current_user:
        return jsonify({"msg": "User does not exist."}), 404

    # Check if essential profile fields are missing
    if not current_user.age or not current_user.name or not current_user.gender:
        return jsonify({
            "msg": "Profile incomplete. Please complete your profile.",
            "profile_complete": False,
            "missing_fields": {
                "age": not bool(current_user.age),
                "name": not bool(current_user.name),
                "gender": not bool(current_user.gender),
            }
        }), 200

    # If profile is complete
    return jsonify({"msg": "Profile is complete.", "profile_complete": True}), 200



@api.route('/edit-profile', methods=['PUT'])
@jwt_required()
def edit_profile():
    try:
        current_user = User.query.get(get_jwt_identity())
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        request_data = request.get_json()
        if not request_data:
            return jsonify({'error': 'No data provided'}), 400
        
    
   
        # Validate age
        if 'age' in request_data:
            if not isinstance(request_data['age'], int) or request_data['age'] < 0 or request_data['age'] > 120:
                return jsonify({"error": "Age must be a positive integer between 0 and 120."}), 400
            current_user.age = request_data['age']

        # Validate bio length
        if 'bio' in request_data:
            if len(request_data['bio']) > 250:
                return jsonify({"error": "Bio must be less than 250 characters."}), 400
        current_user.bio = (request_data['bio'])

        # Validate gender (assuming you have specific acceptable values)
        if 'gender' in request_data:
            try:
                current_user.gender = Gender(request_data['gender'])
            except ValueError:
                return jsonify({"error": "Gender must be 'male', 'female', or 'other'."}), 400

        # Validate name
        if 'name' in request_data:
            current_user.name = (request_data['name'])

        # Validate profile picture URL format if needed
        # if profile_picture and not isinstance(profile_picture, str):
        #     return jsonify({"msg": "Profile picture must be a valid URL string."}), 400
        # user.profile_picture = profile_picture

        db.session.commit()
        return jsonify({'success': True, 'user': current_user.serialize()}), 200
  
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user = User.query.get(get_jwt_identity())
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": current_user.serialize()}), 200



@api.route('/users', methods=['GET'])
def get_all_users():
    users= User.query.all()
    serialized_users = [user.serialize() for user in users]
    response_body = {
        "message": "Here's a list of all users", "users": serialized_users 
    }

    return jsonify(response_body), 200


# @api.route("/users/<int:user_id>", methods= ["GET"])
# def get_user_info(user_id):
#     user= User.query.get(user_id)
#     if user is None:
#         return jsonify({
#             "success": False,
#             "message": "user not found",
#             "error": "USER_NOT_FOUND",

#         }), 404
    
#     return jsonify({
#         "success": True,
#         "message": "user retrieve successfuly",
#         "data": user.serialize()
#     }), 200




# ------------ guide/ references for adding gym preference days & times later -------------------
# ------------ guide/ references for adding gym preference days & times later -------------------
# ------------ guide/ references for adding gym preference days & times later -------------------
# ------------ guide/ references for adding gym preference days & times later -------------------
# Add these routes to your existing routes.py

# @api.route('/exercise-interests', methods=['GET'])
# def get_exercise_interests():
#     interests = ExerciseInterests.query.all()
#     return jsonify([{
#         'id': interest.id,
#         'name': interest.name.value,
#         'description': interest.description
#     } for interest in interests])

# @api.route('/user/exercise-interests', methods=['GET', 'PUT'])
# @jwt_required()
# def handle_user_exercise_interests():
#     current_user = User.query.get(get_jwt_identity())
    
#     if request.method == 'GET':
#         return jsonify([{
#             'id': interest.id,
#             'name': interest.name.value,
#             'description': interest.description
#         } for interest in current_user.exercise_interests])
    
#     data = request.json
#     interest_ids = data.get('interest_ids', [])
#     current_user.exercise_interests = []
#     interests = ExerciseInterests.query.filter(ExerciseInterests.id.in_(interest_ids)).all()
#     current_user.exercise_interests.extend(interests)
#     db.session.commit()
#     return jsonify({'message': 'Exercise interests updated successfully'})

# @api.route('/workout-schedule', methods=['POST', 'GET'])
# @jwt_required()
# def handle_workout_schedule():
#     current_user = User.query.get(get_jwt_identity())
    
#     if request.method == 'GET':
#         schedules = current_user.workout_schedules
#         return jsonify([{
#             'gym_id': schedule.gym_preference_id,
#             'day': schedule.day_of_week.name,
#             'time_slot': schedule.time_slot.name
#         } for schedule in schedules])

#     data = request.json
#     schedule = WorkoutSchedule(
#         user_id=current_user.id,
#         gym_preference_id=data['gym_preference_id'],
#         day_of_week=DayOfWeek[data['day_of_week']],
#         time_slot=TimeSlot[data['time_slot']]
#     )
#     db.session.add(schedule)
#     db.session.commit()
#     return jsonify({'message': 'Schedule created successfully'})

# @api.route('/like/<int:liked_id>', methods=['POST'])
# @jwt_required()
# def like_user(liked_id):
#     current_user = User.query.get(get_jwt_identity())
#     if liked_id == current_user.id:
#         return jsonify({'error': 'Cannot like yourself'}), 400
    
#     existing_like = Like.query.filter_by(liker_id=current_user.id, liked_id=liked_id).first()
#     if existing_like:
#         return jsonify({'message': 'Already liked'}), 200
    
#     new_like = Like(liker_id=current_user.id, liked_id=liked_id)
#     db.session.add(new_like)
    
#     mutual_like = Like.query.filter_by(liker_id=liked_id, liked_id=current_user.id).first()
#     if mutual_like:
#         match = Match(
#             user1_id=min(current_user.id, liked_id),
#             user2_id=max(current_user.id, liked_id)
#         )
#         db.session.add(match)
    
#     db.session.commit()
#     return jsonify({
#         'message': 'Like successful',
#         'match_created': bool(mutual_like)
#     })

# @api.route('/matches', methods=['GET'])
# @jwt_required()
# def get_matches():
#     current_user = User.query.get(get_jwt_identity())
#     matches = Match.query.filter(
#         ((Match.user1_id == current_user.id) | (Match.user2_id == current_user.id)) &
#         (Match.status == 'active')
#     ).all()
    
#     return jsonify([{
#         'match_id': match.id,
#         'matched_user': match.user2.serialize() if match.user1_id == current_user.id else match.user1.serialize(),
#         'created_at': match.created_at.isoformat(),
#         'last_interaction': match.last_interaction.isoformat() if match.last_interaction else None
#     } for match in matches])

# @api.route('/potential-spotters', methods=['GET'])
# @jwt_required()
# def get_potential_spotters():
#     try:
#         current_user = User.query.get(get_jwt_identity())
#         potential_matches = User.query.filter(
#             User.id != current_user.id,
#             User.city == current_user.city,
#             User.state == current_user.state
#         ).all()
        
#         return jsonify([user.serialize() for user in potential_matches]), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
# ---------------------------------
# @api.route('/workout-schedules/<int:gym_id>', methods=['GET'])
# def get_workout_schedules(gym_id):
#     schedules = WorkoutSchedule.query.filter_by(gym_preference_id=gym_id).all()
#     return jsonify([{
#         'day': schedule.day_of_week.name,
#         'time_slot': schedule.time_slot.name,
#         'start_time': schedule.preferred_start_time.isoformat() if schedule.preferred_start_time else None,
#         'end_time': schedule.preferred_end_time.isoformat() if schedule.preferred_end_time else None
#     } for schedule in schedules])
# ----------------------------------
# ---------------------------------
# Add exercise interests to a user
# user.exercise_interests.append(exercise_interest)

# Add gym preferences to a user
# user.gym_preferences.append(gym_preference)

# Create a workout schedule
# workout_schedule = WorkoutSchedule(
#     user=user,
#     gym_preference=gym_preference,
#     day_of_week=DayOfWeek.MONDAY,
#     time_slot=TimeSlot.MORNING
# )
# -------------------------------