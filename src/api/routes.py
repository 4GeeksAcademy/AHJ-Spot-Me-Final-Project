"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Match
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.db_functions import create_user, get_user_by_google_id
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

    # Step 2: Check if user already exists in database (use your database logic here)
    # Assuming a function `get_user_by_google_id` checks if user exists
    user = get_user_by_google_id(google_id)
    if not user:
        # Create new user if they don't exist
        user = create_user(email=email, google_id=google_id)

    # Step 3: Generate a JWT token for the user
    access_token = create_access_token(identity=user["id"])

    return jsonify(
        access_token=access_token
    )
@api.route('/login', methods=['POST'])
def login():
    data=request.json
    email=data.get("email")
    password=data.get("password")
    if None in[email, password]:
        return jsonify({"msg":"some required fields are missing"}), 400
    user=User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg":"user not found"}), 404
    if password != user.password:
        return jsonify({"msg":"incorrect password"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify(
        access_token=access_token
    )

@api.route('/matches', methods=['GET'])
@jwt_required()
def get_matches():
    user_id = get_jwt_identity()
    matches = Match.query.all()
    serialized_matches = []
    for match in matches:
        if user_id == match.user1_id or user_id == match.user2_id:
            serialized_matches.append(match)
    return jsonify({"msg":"success here is your list of matches","matches":serialized_matches}), 200

@api.route('/matches', methods=['POST'])
@jwt_required()
def create_match():
    data = request.json
    new_match = Match(
        user_1id=data['user_1id'],
        user_2id=data['user_2id'],
        is_accepted=data.get('is_accepted', False),
        last_interaction=datetime.utcnow()
    )
    db.session.add(new_match)
    db.session.commit()
    return jsonify(new_match.to_dict()), 201





@api.route('/matches/<int:match_id>', methods=['GET'])
@jwt_required()
def get_match(match_id):
    match = Match.query.get(match_id)
    if match is None:
        return jsonify({"error": "Match not found"}), 404
    return jsonify(match.to_dict()), 200

@api.route('/user/matches', methods=['GET'])
@jwt_required()
def get_user_matches():
    user_id = get_jwt_identity()  

    
    matches = Match.query.filter(
        (Match.user_id1 == user_id) | (Match.user_id2 == user_id)
    ).all()

    matches_data = [match.to_dict() for match in matches]
    
    return jsonify(matches_data), 200











