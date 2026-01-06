# OCR Service using Google Vision API

from google.cloud import vision
from app.core.config import settings

def extract_text_from_image(image_bytes: bytes) -> str:
    # Placeholder for Google Vision OCR
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_bytes)
    response = client.text_detection(image=image)
    texts = response.text_annotations
    if texts:
        return texts[0].description
    return ""