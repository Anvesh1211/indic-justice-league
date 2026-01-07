from google.cloud import vision
from google.api_core.client_options import ClientOptions
from app.core.config import settings
import io
from pdf2image import convert_from_bytes

def _get_vision_client():
    if not settings.GOOGLE_VISION_API_KEY:
        return None

    client_options = ClientOptions(
        api_key=settings.GOOGLE_VISION_API_KEY
    )
    return vision.ImageAnnotatorClient(client_options=client_options)


def extract_text_from_stream(file_content: bytes, filename: str) -> str:
    client = _get_vision_client()

    if client is None:
        return "OCR not configured"

    full_text = ""

    if filename.lower().endswith(".pdf"):
        images = convert_from_bytes(file_content, dpi=300)
        for i, img in enumerate(images):
            buf = io.BytesIO()
            img.save(buf, format="JPEG")
            image = vision.Image(content=buf.getvalue())
            response = client.document_text_detection(image=image)
            full_text += f"\n--- Page {i+1} ---\n"
            full_text += response.full_text_annotation.text
    else:
        image = vision.Image(content=file_content)
        response = client.document_text_detection(image=image)
        full_text = response.full_text_annotation.text

    return full_text

def extract_text_from_image(file_bytes: bytes, filename: str):
    return "OCR not configured"

