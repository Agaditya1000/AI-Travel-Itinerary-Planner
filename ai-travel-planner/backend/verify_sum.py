import urllib.request
import json

url = "http://localhost:8000/generate-trip"
data = {"destination": "Paris", "days": 6, "budget": 2500, "travel_style": "cultural"}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as f:
        resp = json.loads(f.read().decode('utf-8'))
        
        daily_costs = [d.get('estimated_cost') for d in resp.get('itinerary', [])]
        total_sum = sum(daily_costs)
        
        print(f"SUM: {total_sum}")
        print(f"TARGET: {resp.get('total_budget')}")
        print(f"MATCH: {total_sum == resp.get('total_budget')}")

except Exception as e:
    print(f"Error: {e}")
