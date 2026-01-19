import requests
import logging

logger = logging.getLogger(__name__)

def get_wikipedia_image(query: str) -> str:
    """
    Fetches the main image URL for a given query (city/location) from Wikipedia.
    Returns None if no image is found.
    """
    try:
        # Search for the page
        search_url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "format": "json",
            "prop": "pageimages",
            "piprop": "original",
            "titles": query,
            "redirects": 1,
            "pithumbsize": 1000 
        }
        
        headers = {
            "User-Agent": "AITravelPlanner/1.0 (mailto:test@example.com)"
        }
        
        response = requests.get(search_url, params=params, headers=headers, timeout=5)
        
        try:
            data = response.json()
        except Exception:
            logger.error(f"Wikipedia response not JSON: {response.text[:200]}")
            return None
        
        pages = data.get("query", {}).get("pages", {})
        if not pages:
            return None
            
        for page_id, page_data in pages.items():
            if "original" in page_data:
                return page_data["original"]["source"]
            if "thumbnail" in page_data:
                return page_data["thumbnail"]["source"]
                
        return None
        
    except Exception as e:
        logger.error(f"Error fetching Wikipedia image for {query}: {e}")
        return None
