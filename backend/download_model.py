import os
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"
import time
from faster_whisper import download_model

model_size = "distil-large-v3"
max_retries = 5

for attempt in range(max_retries):
    try:
        print(f"Attempting to download {model_size} (Attempt {attempt + 1}/{max_retries})...")
        model_path = download_model(model_size)
        print(f"Successfully downloaded to: {model_path}")
        break
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(2)
else:
    print("Failed to download model after multiple attempts.")
