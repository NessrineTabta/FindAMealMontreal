import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Load Firebase credentials securely
cred_path = os.getenv("FIREBASE_CREDENTIALS")

if not cred_path:
    raise ValueError("❌ FIREBASE_CREDENTIALS environment variable not set. Run `echo $FIREBASE_CREDENTIALS` to verify.")

if not os.path.exists(cred_path):
    raise FileNotFoundError(f"❌ Firebase credentials file not found at: {cred_path}")

# Initialize Firebase only if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def upload_menu_to_firebase(restaurant_name):
    """Upload scraped menu JSON file to Firestore in a flat structure with batch writes."""
    file_path = os.path.join("menu-scraper", "output", f"{restaurant_name}.json")

    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        try:
            menu_data = json.load(f)
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON format in {file_path}")
            return

    if not menu_data:
        print(f"⚠️ Warning: No menu data found in {file_path}")
        return

    restaurant_ref = db.collection("Restaurants").document(restaurant_name)
    restaurant_ref.set({"Name": restaurant_name})  # Store restaurant name

    menu_ref = restaurant_ref.collection("Menu")  # Keep menu as a simple collection

    batch = db.batch()
    batch_size = 0
    total_items = 0

    for item in menu_data:
        item_doc_ref = menu_ref.document(item["name"])  # Store each item separately
        batch.set(item_doc_ref, item)
        total_items += 1
        batch_size += 1

        if batch_size == 100:  # Commit batch if limit is reached
            batch.commit()
            batch = db.batch()
            batch_size = 0

    if batch_size > 0:  # Commit remaining items
        batch.commit()

    print(f"✅ Uploaded '{restaurant_name}' menu to Firebase with {total_items} items.")



if __name__ == "__main__":
    upload_menu_to_firebase("Fish Bone")
