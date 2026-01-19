import requests

def debug_wiki(query):
    url = "https://en.wikipedia.org/w/api.php"
    # Current method check
    params = {
        "action": "query",
        "prop": "pageimages",
        "titles": query,
        "pithumbsize": 1000,
        "format": "json",
        "origin": "*"
    }
    print("Direct title search:", requests.get(url, params=params).json())
    
    # Better method check (search first)
    search_params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "origin": "*"
    }
    search_res = requests.get(url, params=search_params).json()
    print("Search results:", search_res)
    if search_res.get("query", {}).get("search"):
        title = search_res["query"]["search"][0]["title"]
        print(f"Top result title: {title}")

debug_wiki("Ayodhya")
