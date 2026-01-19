import urllib.request
import json

url = "http://localhost:8000/generate-trip"
data = {"destination": "Paris", "days": 6, "budget": 2500, "travel_style": "cultural"}

print(f"Sending request to {url} with data: {data}")

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as f:
        resp = f.read().decode('utf-8')
        print("Response received:")
        # print(resp[:500]) # Print first 500 chars
        print("Success")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
