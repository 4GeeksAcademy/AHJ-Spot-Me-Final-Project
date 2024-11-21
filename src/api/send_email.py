import smtplib
from email.message import EmailMessage
import os

MAIL_SERVER = "smtp.gmail.com"

MAIL_PORT = 465
MAIL_USE_TLS = True
MAIL_USERNAME = os.getenv("GMAIL")
MAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")


def send_email(recipient, body, subject):
    try:
        with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT) as server:
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
            smg = EmailMessage()
            smg["Subject"] = subject
            smg["From"] = MAIL_USERNAME
            smg["To"] = recipient
            smg.set_content(body)
            server.send_message(smg)
    except smtplib.SMTPException as e: 
        #log the exception e
        raise Exception(f"failed to send email: {str(e)}")



# import logging

# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

# def send_email(recipient, body, subject):
#     try:
#         logger.debug(f"Attempting to connect to {MAIL_SERVER}:{MAIL_PORT}")
#         with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT) as server:
#             logger.debug("Connected to SMTP server")
#             logger.debug(f"Attempting login with username: {MAIL_USERNAME}")
#             server.login(MAIL_USERNAME, MAIL_PASSWORD)
#             logger.debug("Login successful")
            
#             smg = EmailMessage()
#             smg["Subject"] = subject
#             smg["From"] = MAIL_USERNAME
#             smg["To"] = recipient
#             smg.set_content(body)
            
#             logger.debug(f"Attempting to send email to {recipient}")
#             server.send_message(smg)
#             logger.debug("Email sent successfully")
            
#     except smtplib.SMTPAuthenticationError as e:
#         logger.error(f"Authentication failed: {str(e)}")
#         raise Exception(f"Authentication failed: {str(e)}")
#     except smtplib.SMTPException as e:
#         logger.error(f"SMTP error occurred: {str(e)}")
#         raise Exception(f"Failed to send email: {str(e)}")
#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         raise Exception(f"Failed to send email: {str(e)}")