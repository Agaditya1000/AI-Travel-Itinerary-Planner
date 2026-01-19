from schemas import TripResponse, TripDay
from main import fix_trip_math
from pydantic import BaseModel
from typing import List, Dict

# Mock classes to simulate the environment if schemas import fails or for standalone testing
# But since I have access to the environment, I will try to import first. 
# If this script is run in the backend directory, it should work.

def test_fix_trip_math():
    item1 = TripDay(day=1, activities=[], estimated_cost=150)
    item2 = TripDay(day=2, activities=[], estimated_cost=180)
    item3 = TripDay(day=3, activities=[], estimated_cost=200)
    item4 = TripDay(day=4, activities=[], estimated_cost=120)
    item5 = TripDay(day=5, activities=[], estimated_cost=150)
    item6 = TripDay(day=6, activities=[], estimated_cost=140)
    
    # Total sum initially = 150+180+200+120+150+140 = 940
    # User budget = 2500
    
    trip = TripResponse(
        destination="Paris",
        total_days=6,
        total_budget=2500,
        itinerary=[item1, item2, item3, item4, item5, item6],
        cost_breakdown={"Food": 940}, # dummy
        image_url="http://example.com"
    )

    print(f"Initial Daily Sum: {sum(d.estimated_cost for d in trip.itinerary)}")
    print(f"Target Budget: {trip.total_budget}")
    
    try:
        fixed_trip = fix_trip_math(trip)
        new_sum = sum(d.estimated_cost for d in fixed_trip.itinerary)
        print(f"New Daily Sum: {new_sum}")
        
        if new_sum == trip.total_budget:
            print("SUCCESS: Budget matches exactly!")
        else:
            print(f"FAILURE: Budget mismatch! Expected {trip.total_budget}, got {new_sum}")
            
    except Exception as e:
        print(f"CRASHED: {e}")

if __name__ == "__main__":
    test_fix_trip_math()
