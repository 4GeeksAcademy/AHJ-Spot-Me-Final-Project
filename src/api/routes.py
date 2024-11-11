"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, Blueprint
from api.models import db, User, Match
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from api.blacklist import blacklist
from api.db_functions import get_user_by_google_id, create_user
from api.google_auth import verify_google_token


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


# This endpoint needs to return something
@api.route('/logout', methods=['POST'])
@jwt_required()
def logout_user():
    jti = get_jwt()['jti'] # Get the token ID
    blacklist.add(jti) # Invalidate the token


# We got errors in this endpoint
@api.route('/edit-profile', methods=['PUT'])
@jwt_required()
def edit_profile():
    request_data = request.get_json()
    age = request_data.get("age")
    bio = request_data.get("bio")
    gender = request_data.get("gender")
    name = request_data.get("name")
    profile_picture = request.data.get("profile_picture")

    #New
    if user:
        # Validate age
        if age:
            if not isinstance(age, int) or age < 0 or age > 120:
                return jsonify({"msg": "Age must be a positive integer between 0 and 120."}), 400
            user.age = age

        # Validate bio length
        if bio and len(bio) > 250:
            return jsonify({"msg": "Bio must be less than 250 characters."}), 400
        user.bio = bio

        # Validate gender (assuming you have specific acceptable values)
        if gender and gender not in ["male", "female", "other"]:
            return jsonify({"msg": "Gender must be 'male', 'female', or 'other'."}), 400
        user.gender = gender

        # Validate name
        if name is None:
            return jsonify({"msg": "Name field is required."}), 400
        user.name = name

        # Validate profile picture URL format if needed
        if profile_picture and not isinstance(profile_picture, str):
            return jsonify({"msg": "Profile picture must be a valid URL string."}), 400
        user.profile_picture = profile_picture
        
    user = User.query.filter_by(email=get_jwt_identity()).first()

    if user:
        user.age= age
        user.bio=bio
        user.gender=gender
        user.name=name 
        user.profile_picture=profile_picture
        db.session.commit()
        return jsonify({ "message": "Success your profile has been updated", "user": user.serialize() }), 200

    return jsonify({ "message": "The user doesnt exist"}), 404

@api.route('/matches', methods=['GET'])
@jwt_required()
def get_matches():
    matches=Match.query.all()
    return jsonify([matches.serialize()for match in matches])
    