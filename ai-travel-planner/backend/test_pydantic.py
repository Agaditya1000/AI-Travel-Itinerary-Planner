from schemas import TripResponse, DayPlan
import pydantic
print(f"Pydantic Version: {pydantic.VERSION}")

try:
    trip = TripResponse(
        destination="Test",
        total_days=1,
        total_budget=100,
        cost_breakdown={"a":1},
        itinerary=[DayPlan(day=1, activities=[], estimated_cost=10)]
    )
    
    print(f"Object: {trip}")
    print(f"Has model_dump: {hasattr(trip, 'model_dump')}")
    print(f"Has dict: {hasattr(trip, 'dict')}")
    
    if hasattr(trip, 'model_dump'):
        print(f"Dump: {trip.model_dump()}")
    elif hasattr(trip, 'dict'):
        print(f"Dict: {trip.dict()}")
        
except Exception as e:
    print(f"Error: {e}")
