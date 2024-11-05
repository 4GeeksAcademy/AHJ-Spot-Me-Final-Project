"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api. models import db, User, Match
#from api. models import db, User, Preferences, Match, TrainingSessions, UserFeedback, Report
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from api.blacklist import blacklist



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)






@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/users', methods=['GET'])
def get_all_users():
    users= User.query.all()
    serialized_users = [user.serialize() for user in users]
    response_body = {
        "message": "Here's a list of all users", "users": serialized_users 
    }

    return jsonify(response_body), 200


@api.route("/users/<int:user_id>", methods= ["GET"])
def get_user_info(user_id):
    user= User.query.get(user_id)
    if user is None:
        return jsonify({
            "success": False,
            "message": "user not found",
            "error": "USER_NOT_FOUND",

        }), 404
    
    return jsonify({
        "success": True,
        "message": "user retrieve successfuly",
        "data": user.serialize()
    }), 200



@api.route('/login', methods=['POST'])
def login_user():
    request_data = request.get_json()
    email = request_data.get("email")
    password = request_data.get("password")
    if None in [email, password]:
        return jsonify({"msg": "Some requiered are missing"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None: 
        return jsonify({ "message": "The user doesnt exist"}), 404


    if user.password==password:
        access_token = create_access_token(identity=id)
        return jsonify({ "access_token": access_token }), 200
    return jsonify({"msg":"Incorrect password"}), 401
    

@api.route('/signup', methods=['POST'])
def create_user():
    request_data = request.get_json()
    email = request_data.get("email")
    password = request_data.get("password")
    if None in [email, password]:
        return jsonify({"msg": "Some requiered are missing"}), 400

    user = User.query.filter_by(email=email).first()
    if user: 
        return jsonify({ "message": "The user already exist"}), 409

    new_user = User(email=email, password=password, is_active=True)

    db.session.add(new_user)
    db.session.commit()

   

    return jsonify({ "msg": "Congrats! Your account was succesfully created." }), 201

#New
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


@api.route('/logout', methods=['POST'])
@jwt_required()
def logout_user():
    jti = get_jwt()['jti'] # Get the token ID
    blacklist.add(jti) # Invalidate the token



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





































# @api.route("/users/<int:user_id>/preferences", methods= ["GET", "POST"])
# def handle_preferences(user_id):
#     if request.method == "GET":
#         prefs = Preferences.query.filter_by(user_id = user_id).first()
#         if not prefs:
#             return jsonify({"message":"preferences not found"}), 404
#         return jsonify(prefs.serialize()), 200
    
#     data = request.get_json()
#     prefs = Preferences.query.filter_by(user_id = user_id).first()

#     if prefs:
#         #update existing preferences 
#         for key, value in data.items():
#             setattr(prefs, key, value)

#     else: 
#         #create new preferences
#         prefs = Preferences(user_id = user_id, **data)
#         db.session.add(prefs)

#     db.session.commit()
#     return jsonify(prefs.serialize()), 200

# api.route("/feedback", methods =["POST"])
# def create_feedback():
#     data = request.get_json(),
#     required_fields =["user_id", "match_id", "rating"]

#     if not all(field in data for field in required_fields):
#         return jsonify({"message": "missing required fields"}), 400
    
#     new_feedback = UserFeedback(
#         user_id = data["user_id"],
#         match_id = data["match_id"],
#         rating = data ["rating_id"],
#         comment = data.get("comments"),
#         submitted_on = datetime.utcnow()
#     )

#     db.session.add(new_feedback)
#     db.session.commit()
#     return jsonify(new_feedback.serialize()), 201
    
# api.route("/reports", methods =["POST"])
# def create_report():
#     data = request.get_json(),
#     required_fields =["reported_user_id", "reporter_user_id", "reason"]

#     if not all(field in data for field in required_fields):
#         return jsonify({"message": "missing required fields"}), 400
    
#     new_report = Report(
#         reported_by_id = data["reported_by_id"],
#         reported_user_id = data["reported_user_id"],
#         reason = data["reason"],
#         report_description = data.get("report_description"),
#         reported_on = datetime.utcnow(),
#         is_resolved = False

#     )

#     db.session.add(new_report)
#     db.session.commit()
#     return jsonify(new_report.serialize()), 201

# api.route("/reports/<int:report_id>/resolved", methods= ["PUT"])
# def resolved_report(report_id):
#     report = Report.query.get(report_id)

#     if report is None:
#         return jsonify({"message": "REPORT_NOT_FOUND"}), 404
    
#     report.is_resolved = True
#     db.session.commit()

#     return jsonify({"data":report.serialize()}), 200

# api.route("/reports/<int:report_id>", methods= ["DELETE"])
# def delete_report(report_id):
#     report = Report.query.get(report_id)

#     if report is None:
#         return jsonify({"message": "REPORT_NOT_FOUND"}), 404
    
#     try:
#         db.session(report)
#         db.session.commit()
#         return jsonify({"message": "report deleted"}), 200
    
#     except Exception:
#         db.session.rollback()
#         return jsonify({"message": "error deleting report"}), 500
    