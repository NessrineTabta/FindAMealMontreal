import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
import unicodedata
import re

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

def sanitize_string(value):
    """Sanitize strings for Firebase document paths by removing accents and disallowed characters."""
    if not isinstance(value, str):
        return "Unnamed"

    # Normalize special characters (fixes encoding issues)
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("utf-8")  # Removes accents
    
    # Replace problematic Firestore characters
    value = re.sub(r'[.#$/\[\]]+', "_", value)

    return value.strip()

def rename_files(output_dir):
    """Rename files with incorrect encoding issues."""
    json_files = [f for f in os.listdir(output_dir) if f.endswith(".json")]

    for file_name in json_files:
        corrected_name = sanitize_string(file_name.replace(".json", "")) + ".json"
        if file_name != corrected_name:
            old_path = os.path.join(output_dir, file_name)
            new_path = os.path.join(output_dir, corrected_name)
            os.rename(old_path, new_path)
            print(f"🔄 Renamed: {file_name} → {corrected_name}")

def upload_all_menus():
    """Upload all JSON menu files from the output directory to Firebase."""
    output_dir = os.path.join("menu-scraper", "output")

    if not os.path.exists(output_dir):
        print("❌ Output directory not found!")
        return

    # Fix any encoding issues in filenames
    rename_files(output_dir)

    json_files = [f for f in os.listdir(output_dir) if f.endswith(".json")]

    if not json_files:
        print("⚠️ No JSON files found in output directory!")
        return

    print(f"📤 Uploading {len(json_files)} menu files to Firebase...")

    for file_name in json_files:
        restaurant_name = file_name.replace(".json", "")  # Extract name from filename
        restaurant_name_cleaned = sanitize_string(restaurant_name)  # Fix encoding issues
        file_path = os.path.join(output_dir, file_name)

        with open(file_path, "r", encoding="utf-8") as f:
            try:
                menu_data = json.load(f)
            except json.JSONDecodeError:
                print(f"❌ Skipping {file_name} due to invalid JSON format.")
                continue

        if not menu_data:
            print(f"⚠️ Warning: No menu data found in {file_path}, skipping...")
            continue

        # Debugging: Check if menu sections and items are extracted properly
        print(f"\n🔍 Debugging {restaurant_name_cleaned}:")
        for section in menu_data:
            section_name_cleaned = sanitize_string(section.get("section", "Unknown Section"))
            print(f"  🔹 Section: {section_name_cleaned}")
            for item in section.get("items", []):
                item_name_cleaned = sanitize_string(item.get("name", "Unnamed Item"))
                print(f"    - {item_name_cleaned}: {item.get('price', 'N/A')}")

        # Ensure at least one valid item exists before uploading
        valid_items = [
            item for section in menu_data for item in section.get("items", []) 
            if item.get("name") and item["name"] != "Unknown Item"
        ]
        if not valid_items:
            print(f"⚠️ No valid items found for {restaurant_name_cleaned}, skipping Firebase upload.")
            continue

        restaurant_ref = db.collection("Restaurants").document(restaurant_name_cleaned)

        if isinstance(menu_data, dict) and "external_menu" in menu_data:
            # ✅ External menu link
            restaurant_ref.set({
                "name": restaurant_name_cleaned,
                "menu_status": "external",
                "external_menu_url": menu_data["external_menu"]
            })
            print(f"🔗 External menu saved for {restaurant_name_cleaned}")

        elif menu_data == "not_available":
            # ✅ No menu available
            restaurant_ref.set({
                "name": restaurant_name_cleaned,
                "menu_status": "not_available"
            })
            print(f"⚠️ No menu found for {restaurant_name_cleaned}")

        else:
            # ✅ Internal menu available -> Save under "Menu" subcollection
            restaurant_ref.set({
                "name": restaurant_name_cleaned,
                "menu_status": "internal"
            })

            menu_ref = restaurant_ref.collection("Menu")
            batch = db.batch()
            batch_size = 0
            total_items = 0

            for section in menu_data:
                section_name_cleaned = sanitize_string(section.get("section", "Unknown Section"))

                for item in section.get("items", []):
                    item_name_cleaned = sanitize_string(item.get("name", "Unnamed_Item"))

                    if not item_name_cleaned or item_name_cleaned == "Unknown_Item":
                        print(f"⚠️ Skipping an item in {restaurant_name_cleaned} (Section: {section_name_cleaned}) due to missing name.")
                        continue

                    item_doc_ref = menu_ref.document(item_name_cleaned)
                    batch.set(item_doc_ref, {
                        "name": item_name_cleaned,
                        "price": item.get("price", "N/A"),
                        "description": item.get("description", "No description"),
                        "section": section_name_cleaned
                    })
                    total_items += 1
                    batch_size += 1

                    if batch_size == 100:
                        batch.commit()
                        batch = db.batch()
                        batch_size = 0

            if batch_size > 0:
                batch.commit()

            print(f"✅ Uploaded '{restaurant_name_cleaned}' menu to Firebase with {total_items} items.")

if __name__ == "__main__":
    upload_all_menus()
