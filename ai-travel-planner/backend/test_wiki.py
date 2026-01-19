from utils.images import get_wikipedia_image

query = "Ayodhya"
print(f"Searching for: {query}")
image_url = get_wikipedia_image(query)
print(f"Result URL: {image_url}")
