"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api. models import db, User, Match
#from api. models import db, User, Preferences, Match, TrainingSessions, UserFeedback, Report
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime




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
    