from pydantic_ai import Agent
from schemas import TripResponse, TripRequest
import os
from dotenv import load_dotenv

load_dotenv()

# Using the requested model. 
# We do not pass result_type to the constructor as it causes issues in this version.
# We will pass it at runtime or use type hints on the run method if supported, 
# but per previous error, we are removing it from __init__.

# Check API Key
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key or "..." in api_key or len(api_key) < 10:
    print("WARNING: OPENROUTER_API_KEY appears invalid or missing. Please check your .env file.")

agent = Agent(
    model="openrouter:mistralai/mistral-7b-instruct",
)

@agent.system_prompt
def system_prompt_logic(ctx):
    return """
    You are a travel planning AI agent.
    Generate a realistic day-wise itinerary based on the user's request.
    Ensure total cost does NOT exceed the provided budget.
    Provide a cost breakdown.
    
    CRITICAL: You MUST respond with ONLY valid JSON with no other text, matching this structure:
    {
        "destination": "string",
        "total_days": int,
        "total_budget": int,
        "cost_breakdown": {"category": amount},
        "itinerary": [
            {"day": int, "activities": ["string"], "estimated_cost": int}
        ]
    }
    """
