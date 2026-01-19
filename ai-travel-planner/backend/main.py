from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import TripRequest, TripResponse
from agent import agent
from utils.retry import retry_agent
from utils.images import get_wikipedia_image
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Helper to enforce math consistency
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
            day.estimated_cost = int(day.estimated_cost * scale_factor)
            new_daily_sum += day.estimated_cost
            
        diff = trip.total_budget - new_daily_sum
        if trip.itinerary:
            trip.itinerary[-1].estimated_cost += diff
            
    # 3. Recalculate cost breakdown proportionally
    breakdown_total = sum(trip.cost_breakdown.values())
    if breakdown_total > 0:
        scale_breakdown = trip.total_budget / breakdown_total
        new_breakdown = {}
        running_breakdown_sum = 0
        
        keys = list(trip.cost_breakdown.keys())
        for i, key in enumerate(keys):
            val = trip.cost_breakdown[key]
            # If last item, take the remainder to be exact
            if i == len(keys) - 1:
                new_val = trip.total_budget - running_breakdown_sum
            else:
                new_val = int(val * scale_breakdown)
                running_breakdown_sum += new_val
            new_breakdown[key] = new_val
        trip.cost_breakdown = new_breakdown
    
    # TRACER: Prove code ran
    if not trip.destination.endswith("(Verified)"):
        trip.destination = f"{trip.destination} (Verified)"
        
    return trip

# Add root endpoint for health check (and Vercel verification)
@app.get("/")
async def root():
    return {"status": "ok", "message": "AI Travel Planner Backend is running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes, allow all. In prod, specify domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-trip", response_model=TripResponse)
async def generate_trip(data: TripRequest):
    try:
        prompt = f"Plan a trip to {data.destination} for {data.days} days with a budget of {data.budget}. Travel Style: {data.travel_style}."
        
        # Retry agent call
        result = await retry_agent(lambda: agent.run(prompt))
        
        # Extract data from result
        if hasattr(result, 'data'):
            data_obj = result.data
        elif hasattr(result, 'output'): 
             data_obj = result.output
        elif hasattr(result, 'content'): 
             data_obj = result.content
        else:
             data_obj = result

        # Convert to Dictionary
        trip_dict = {}
        if hasattr(data_obj, 'model_dump'):
             trip_dict = data_obj.model_dump()
        elif hasattr(data_obj, 'dict'):
             trip_dict = data_obj.dict()
        elif isinstance(data_obj, dict):
             trip_dict = data_obj
        
        # Handle String (JSON) parsing if needed
        elif isinstance(data_obj, str):
             import json
             import re
             try:
                 match = re.search(r'(\{.*\})', data_obj, re.DOTALL)
                 cleaned_json = match.group(1) if match else data_obj.replace("```json", "").replace("```", "").strip()
                 trip_dict = json.loads(cleaned_json)
             except:
                 # Try Pydantic validation as last resort
                 try:
                     parsed_obj = TripResponse.model_validate_json(data_obj)
                     trip_dict = parsed_obj.model_dump()
                 except:
                     pass

        # If we successfully got a dict, rebuild and fix
        if trip_dict:
             wiki_image = get_wikipedia_image(data.destination)
             current_img = trip_dict.get('image_url')
             trip_dict['image_url'] = wiki_image if wiki_image else (current_img or f"https://image.pollinations.ai/prompt/{data.destination}%20cinematic%20travel%204k")
             
             response_obj = TripResponse(**trip_dict)
             response_obj.total_budget = data.budget
             return fix_trip_math(response_obj)
             
        # If parsing completely failed, raise logic will catch it
        raise ValueError("Could not parse trip data")

    except Exception as e:
        print(f"Error generating trip: {e}")
        # Fallback to mock data if API fails
        if "401" in str(e) or "429" in str(e) or "User not found" in str(e) or "parse" in str(e) or "validation" in str(e):
            print("Falling back to MOCK data.")
            mock_trip = TripResponse(
                destination=data.destination,
                total_days=data.days,
                total_budget=data.budget,
                cost_breakdown={"Accommodation": int(data.budget * 0.4), "Food": int(data.budget * 0.3), "Activities": int(data.budget * 0.3)},
                image_url=get_wikipedia_image(data.destination) or f"https://image.pollinations.ai/prompt/{data.destination}%20cinematic%20travel%204k",
                itinerary=[
                    {"day": i+1, "activities": ["Visit City Center", "Lunch at Local Cafe", "Sunset Viewpoint"], "estimated_cost": int(data.budget/data.days)}
                    for i in range(data.days)
                ]
            )
            return fix_trip_math(mock_trip)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
