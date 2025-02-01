import requests
from bs4 import BeautifulSoup
import json
import os
import time

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"}

BASE_URL = "https://www.opentable.com/montreal-restaurants"
OUTPUT_DIR = "menu-scraper/output"

def fetch_page(url):
    """Fetch page and return a BeautifulSoup object."""
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.text, "html.parser")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def extract_restaurants():
    """Extract restaurant names & OpenTable URLs from search page."""
    soup = fetch_page(BASE_URL)
    if not soup:
        return []

    restaurants = []
    for item in soup.find_all("li", attrs={"data-rid": True}):
        name_tag = item.find("h3")
        link_tag = item.find("a", {"data-test": "restaurant-card-link"})

        if name_tag and link_tag:
            name = name_tag.text.strip()
            opentable_url = link_tag["href"]
            restaurants.append({"name": name, "opentable_url": opentable_url, "menu_status": "unknown"})

    return restaurants

def extract_menu_sections(soup):
    """Extract menu sections and items from OpenTable."""
    no_menu = soup.find("div", {"data-test": "no-menu-message"})
    if no_menu:
        return "not_available"

    external_menu = soup.find("a", {"data-test": "menu-external-link"})
    if external_menu:
        return {"external_menu": external_menu.get("href")}

    menu_sections = soup.find_all("article", {"data-test": "menu-section"})
    if not menu_sections:
        return "not_available"

    menu_data = []
    for section in menu_sections:
        section_name = section.find("h3").text.strip() if section.find("h3") else "Uncategorized"
        items = []

        for item in section.find_all("li"):
            name = item.find("span", {"data-test": "item-title"})
            price = item.find("span", {"data-test": "item-price"})
            desc = item.find("p")

            items.append({
                "name": name.text.strip() if name else "Unknown Item",
                "price": price.text.strip() if price else "N/A",
                "description": desc.text.strip() if desc else "No description"
            })

        menu_data.append({"section": section_name, "items": items})

    return menu_data

def scrape_opentable_menu(restaurant):
    """Scrape a restaurant's menu and update JSON."""
    url, name = restaurant["opentable_url"], restaurant["name"]
    soup = fetch_page(url)

    if not soup:
        return None

    menu_data = extract_menu_sections(soup)

    if isinstance(menu_data, dict) and "external_menu" in menu_data:
        restaurant["menu_status"] = "external"
        restaurant["external_menu_url"] = menu_data["external_menu"]
    elif menu_data == "not_available":
        restaurant["menu_status"] = "not_available"
    else:
        restaurant["menu_status"] = "internal"
        save_menu_to_file(menu_data, name)

    return restaurant

def save_menu_to_file(menu_data, restaurant_name):
    """Save menu data to JSON."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    file_path = os.path.join(OUTPUT_DIR, f"{restaurant_name}.json")

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(menu_data, f, indent=4, ensure_ascii=False)

    print(f"📁 Menu saved: {file_path}")

def save_restaurants_to_file(restaurants):
    """Save the restaurant list to JSON."""
    with open("menu-scraper/restaurants.json", "w", encoding="utf-8") as f:
        json.dump(restaurants, f, indent=4, ensure_ascii=False)
    print("✅ Restaurant data saved!")

if __name__ == "__main__":
    print("🔍 Fetching restaurant list from OpenTable...")
    restaurant_list = extract_restaurants()
    
    if not restaurant_list:
        print("❌ No restaurants found!")
        exit()

    print(f"✅ Found {len(restaurant_list)} restaurants!")

    for idx, restaurant in enumerate(restaurant_list):
        print(f"🍽 Scraping menu for {restaurant['name']} ({idx+1}/{len(restaurant_list)})...")
        updated_restaurant = scrape_opentable_menu(restaurant)
        time.sleep(3)  # Avoid rate-limiting

    save_restaurants_to_file(restaurant_list)
