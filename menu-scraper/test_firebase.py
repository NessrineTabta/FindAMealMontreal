import firebase_admin
from firebase_admin import credentials, firestore
import os

# Load Firebase credentials
cred_path = os.getenv("FIREBASE_CREDENTIALS")

if not cred_path:
    raise ValueError("❌ FIREBASE_CREDENTIALS environment variable not set.")

if not os.path.exists(cred_path):
    raise FileNotFoundError(f"❌ Firebase credentials file not found at: {cred_path}")

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("✅ Firebase connection successful!")
