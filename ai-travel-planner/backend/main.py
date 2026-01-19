from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import TripRequest, TripResponse
from agent import agent
from utils.retry import retry_agent
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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
        result = retry_agent(lambda: agent.run_sync(prompt))
        
        # Since we removed result_type, result.data might be a string (or dict if implicit).
        # We need to ensure it matches TripResponse.
        # If result.data is a string, we parse it.
        # However, without result_type, pydantic-ai might just return text.
        # Let's assume text and try to parse it.
        # Wait, if result.data is already a model, good. If not, we try to parse.
        
        data_obj = result.data
        if isinstance(data_obj, str):
            # Try to parse JSON from string
            import json
            try:
                # Sometimes LLM wraps in ```json ... ```
                cleaned_json = data_obj.replace("```json", "").replace("```", "").strip()
                parsed = json.loads(cleaned_json)
                return TripResponse(**parsed)
            except Exception:
                # If parsing fails, we might just return an error or try raw
                raise ValueError(f"Failed to parse LLM response: {data_obj}")
        elif isinstance(data_obj, dict):
             return TripResponse(**data_obj)
             
        return data_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
