from pydantic import BaseModel
from typing import List, Dict

class DayPlan(BaseModel):
    day: int
    activities: List[str]
    estimated_cost: int

class TripResponse(BaseModel):
    destination: str
    total_days: int
    total_budget: int
    cost_breakdown: Dict[str, int]
    itinerary: List[DayPlan]
    image_url: str = None

def fix_trip_math(trip: TripResponse) -> TripResponse:
    # 1. Calculate actual sum of daily costs
    daily_sum = sum(day.estimated_cost for day in trip.itinerary)
    print(f"DEBUG: fix_trip_math called. Budget: {trip.total_budget}, Daily Sum: {daily_sum}")
    
    # 2. If valid sum exists, scale daily costs to match total_budget
    if daily_sum > 0 and trip.total_budget > 0:
        scale_factor = trip.total_budget / daily_sum
        print(f"DEBUG: Applying scale factor: {scale_factor}")
        new_daily_sum = 0
        
        for day in trip.itinerary:
            old_cost = day.estimated_cost
            day.estimated_cost = int(day.estimated_cost * scale_factor)
            print(f"Day {day.day}: {old_cost} -> {day.estimated_cost}")
            new_daily_sum += day.estimated_cost
            
        # Adjust rounding error on the last day
        diff = trip.total_budget - new_daily_sum
        print(f"Applying diff: {diff}")
        if trip.itinerary:
            trip.itinerary[-1].estimated_cost += diff
            
    return trip

# Mock data from user's report
# Days: 25, 30, 25, 30, 25, 30, 30 = 195
itinerary = [
    DayPlan(day=1, activities=[], estimated_cost=20), # User said 20 in Step 600, 25 in 565. Let's use 20.
    DayPlan(day=2, activities=[], estimated_cost=15),
    DayPlan(day=3, activities=[], estimated_cost=20),
    DayPlan(day=4, activities=[], estimated_cost=25),
    DayPlan(day=5, activities=[], estimated_cost=20),
    DayPlan(day=6, activities=[], estimated_cost=15),
    DayPlan(day=7, activities=[], estimated_cost=10),
]
# Sum = 20+15+20+25+20+15+10 = 125
# Wait, user Step 600 numbers:
# Day 1: 20
# Day 2: 15
# Day 3: 20
# Day 4: 25
# Day 5: 20
# Day 6: 15
# Day 7: 10
# Total: 125.

# Budget: 300

trip = TripResponse(
    destination="Test",
    total_days=7,
    total_budget=300,
    cost_breakdown={"Food": 100},
    itinerary=itinerary
)

fixed_trip = fix_trip_math(trip)

print("\nFinal Result:")
for day in fixed_trip.itinerary:
    print(f"Day {day.day}: {day.estimated_cost}")
print(f"Final Sum: {sum(d.estimated_cost for d in fixed_trip.itinerary)}")
