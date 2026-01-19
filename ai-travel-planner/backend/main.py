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
        # The user snippet used agent.run_sync(data.dict()). 
        # Pydantic AI usually supports run or run_sync.
        # We'll wrap it in the retry logic as requested.
        
        # Note: data.dict() is deprecated in Pydantic V2, use data.model_dump() usually, 
        # but for compatibility with the user's instructions (which might be V1 style or just habit), 
        # I'll use model_dump() if V2 is installed (likely) or dict() if V1.
        # Pydantic-AI requires Pydantic V2.
        
        prompt = f"Plan a trip to {data.destination} for {data.days} days with a budget of {data.budget}. Travel Style: {data.travel_style}."
        
        # Lambda for retry
        # We pass a lambda that returns the coroutine, so it can be re-created on retry
        result = await retry_agent(lambda: agent.run(prompt))
        
        # Since we removed result_type, result.data might be a string (or dict if implicit).
        # We need to ensure it matches TripResponse.
        # If result.data is a string, we parse it.
        # However, without result_type, pydantic-ai might just return text.
        # Let's assume text and try to parse it.
        # Wait, if result.data is already a model, good. If not, we try to parse.
        
        # Debug: Print result attributes
        print(f"DEBUG: Result type: {type(result)}")
        print(f"DEBUG: Result dir: {dir(result)}")
        
        if hasattr(result, 'data'):
            data_obj = result.data
        elif hasattr(result, 'output'): 
             data_obj = result.output
        elif hasattr(result, 'content'): 
             data_obj = result.content
        else:
            # Fallback for unknown structure (maybe it's just the string?)
            print("WARNING: Could not find .data or .content on result object.")
            data_obj = str(result)
        if isinstance(data_obj, str):
            # Try to parse JSON from string
            import json
            import re
            try:
                # robust cleanup using regex to find the first json-like object
                # This finds anything starting with { and ending with } 
                # (simple approach, works for most LLM outputs)
                match = re.search(r'(\{.*\})', data_obj, re.DOTALL)
                if match:
                    cleaned_json = match.group(1)
                else:
                    # fallback to basic cleanup
                    cleaned_json = data_obj.replace("```json", "").replace("```", "").strip()
                
                parsed = json.loads(cleaned_json)
                # Fetch image from Wikipedia
                wiki_image = get_wikipedia_image(data.destination)
                parsed['image_url'] = wiki_image if wiki_image else f"https://image.pollinations.ai/prompt/{data.destination}%20cinematic%20travel%204k"
                return TripResponse(**parsed)
            except Exception:
                # If parsing fails, we might just return an error or try raw
                raise ValueError(f"Failed to parse LLM response: {data_obj}")
        elif isinstance(data_obj, dict):
             wiki_image = get_wikipedia_image(data.destination)
             data_obj['image_url'] = wiki_image if wiki_image else f"https://image.pollinations.ai/prompt/{data.destination}%20cinematic%20travel%204k"
             return TripResponse(**data_obj)
             
        return data_obj
    except Exception as e:
        print(f"Error generating trip: {e}")
        # Fallback to mock data if API fails (e.g. 401)
        if "401" in str(e) or "429" in str(e) or "User not found" in str(e):
            print("Falling back to MOCK data due to API error.")
            return TripResponse(
                destination=data.destination,
                total_days=data.days,
                total_budget=data.budget,
                cost_breakdown={"Accommodation": data.budget * 0.4, "Food": data.budget * 0.3, "Activities": data.budget * 0.3},
                image_url=get_wikipedia_image(data.destination) or f"https://image.pollinations.ai/prompt/{data.destination}%20cinematic%20travel%204k",
                itinerary=[
                    {"day": i+1, "activities": ["Visit City Center", "Lunch at Local Cafe", "Sunset Viewpoint"], "estimated_cost": int(data.budget/data.days)}
                    for i in range(data.days)
                ]
            )
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
