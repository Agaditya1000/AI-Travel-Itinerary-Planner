from pydantic import BaseModel
from typing import List, Dict

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: int
    travel_style: str

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
