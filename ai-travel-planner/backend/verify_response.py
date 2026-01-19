import urllib.request
import json

url = "http://localhost:8000/generate-trip"
data = {"destination": "Paris", "days": 6, "budget": 2500, "travel_style": "cultural"}

print(f"Sending request to {url}...")

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as f:
        resp_str = f.read().decode('utf-8')
        resp = json.loads(resp_str)
        
        print("\n--- RESPONSE ---")
        print(f"Total Budget: {resp.get('total_budget')}")
        
        daily_costs = [d.get('estimated_cost') for d in resp.get('itinerary', [])]
        print(f"Daily Costs: {daily_costs}")
        print(f"Sum of Daily Costs: {sum(daily_costs)}")
        
        print("\nFull JSON (truncated):")
        print(resp_str[:500])

except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
