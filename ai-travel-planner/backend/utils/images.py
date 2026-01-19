import requests
import random

def get_destination_image(destination: str) -> str:
    """
    Fetches a real image URL for the destination from Wikipedia.
    Falls back to a high-quality generic travel image if not found.
    """
    try:
        # 1. Try Wikipedia API
        # Remove "days" or "trip" from query if present to get the location topic
        search_query = destination.replace(" trip", "").replace(" itinerary", "").strip()
        
        url = "https://en.wikipedia.org/w/api.php"
        headers = {
            "User-Agent": "AITravelPlanner/1.0 (contact@example.com)"
        }
        
        # Step 1: Search for the best matching page title
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": search_query,
            "format": "json",
            "origin": "*"
        }
        search_resp = requests.get(url, params=search_params, headers=headers, timeout=5)
        try:
            search_data = search_resp.json()
        except ValueError:
             print(f"Error decoding Wiki search response: {search_resp.text}")
             return random.choice(fallbacks)
        
        if not search_data.get("query", {}).get("search"):
             print(f"No Wikipedia page found for search: {search_query}")
             return random.choice(fallbacks)
             
        # Best match title
        title = search_data["query"]["search"][0]["title"]
        print(f"Best match for '{search_query}' is '{title}'")

        # Step 2: Get image for this title
        params = {
            "action": "query",
            "prop": "pageimages",
            "titles": title,
            "pithumbsize": 1000, # High res
            "format": "json",
            "origin": "*"
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        try:
            data = response.json()
        except ValueError:
            print(f"Error decoding Wiki image response: {response.text}")
            return random.choice(fallbacks)
        
        pages = data.get("query", {}).get("pages", {})
        for page_id, page_data in pages.items():
            if "thumbnail" in page_data:
                image_url = page_data["thumbnail"]["source"]
                print(f"Found Wikipedia image for {destination}: {image_url}")
                return image_url
                
        print(f"No Wikipedia image found for {destination} (page: {title})")
        
    except Exception as e:
        print(f"Error fetching Wikipedia image: {e}")

    # 2. Fallback to generic high-quality travel images (Unsplash Source is deprecated, using specific IDS)
    # These are real photos of travel vibes.
    fallbacks = [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&h=800", # Switzerland vibes
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&h=800", # Road trip
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=800", # Beach
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&h=800", # Hiking
    ]
    return random.choice(fallbacks)
