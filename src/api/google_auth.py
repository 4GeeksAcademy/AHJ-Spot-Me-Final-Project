from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

# Replace with your Google Client ID
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

def verify_google_token(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        return id_info  # Contains user information if valid
    except ValueError:
        # Token is invalid
        return None