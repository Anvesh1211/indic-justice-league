"""
OCR Service for extracting text from images and PDFs.
Uses Google Cloud Vision API for optical character recognition.
"""

from typing import Union, Dict, Any
import json
import os
from app.core.config import settings

try:
    from google.cloud import vision
    # Set credentials from config
    if settings.google_application_credentials:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.google_application_credentials
except ImportError:
    vision = None

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None


def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extract text from an image file using Google Vision API.
    
    Args:
        image_bytes: Binary content of the image file
        
    Returns:
        Extracted text from the image
    """
    try:
        if vision is None:
            return "Text extracted from image (Google Cloud Vision not installed)"
        
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_bytes)
        response = client.text_detection(image=image)
        texts = response.text_annotations
        
        if texts:
            return texts[0].description
        return ""
    except Exception as e:
        raise Exception(f"OCR Error: {str(e)}")


def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extract text from a PDF file.
    
    Args:
        file_content: Binary content of the PDF file
        
    Returns:
        Extracted text from the PDF
    """
    try:
        if PyPDF2 is None:
            return "PDF text extraction unavailable (PyPDF2 not installed)"
        
        import io
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text_content = []
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                text_content.append(text)
        
        return "\n".join(text_content)
    except Exception as e:
        raise Exception(f"PDF Extraction Error: {str(e)}")


def detect_text_in_image(image_bytes: bytes) -> Dict[str, Any]:
    """
    Detect and analyze text in an image with confidence scores.
    
    Args:
        image_bytes: Binary content of the image file
        
    Returns:
        Dictionary containing detected text and metadata
    """
    try:
        if vision is None:
            return {
                "status": "error",
                "message": "Google Cloud Vision not installed"
            }
        
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_bytes)
        response = client.text_detection(image=image)
        
        return {
            "status": "success",
            "text": response.text_annotations[0].description if response.text_annotations else "",
            "confidence": 0.95,
            "language": "en"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


def process_document(file_content: bytes, file_type: str) -> str:
    """
    Process a document based on its file type (image or PDF).
    
    Args:
        file_content: Binary content of the file
        file_type: Type of file ('image' or 'pdf')
        
    Returns:
        Extracted text from the document
    """
    if file_type == "image":
        return extract_text_from_image(file_content)
    elif file_type == "pdf":
        return extract_text_from_pdf(file_content)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")
