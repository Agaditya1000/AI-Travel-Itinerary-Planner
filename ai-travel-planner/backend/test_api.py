import requests
import json

data = {
    "destination": "London",
    "days": 2,
    "budget": 1000
}

try:
    print("Sending request to http://localhost:8000/generate-trip...")
    response = requests.post("http://localhost:8000/generate-trip", json=data)
    print(f"Status Code: {response.status_code}")
    print("Response Body:", response.text)
    if response.status_code == 200:
        print("Success!")
except Exception as e:
    print(f"Connection Error: {e}")
