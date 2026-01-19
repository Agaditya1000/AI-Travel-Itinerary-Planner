from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv("OPENROUTER_API_KEY")
print(f"Key loaded: {key is not None}")
if key:
    print(f"Key length: {len(key)}")
    print(f"Key starts with: {key[:10]}")
    print(f"Contains '...': {'...' in key}")
