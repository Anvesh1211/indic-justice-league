# OCR Service — PDF & Image Safe Handler
# Responsibility: Backend orchestration (Member 3)

import io

def extract_text_from_image(file_bytes: bytes, filename: str = "") -> str:
    """
    Extract text from PDF or Image.
    Uses Google Vision if available, otherwise falls back safely.
    """

    try:
        from google.cloud import vision
        from pdf2image import convert_from_bytes

        client = vision.ImageAnnotatorClient()
        full_text = ""

        # 📄 Handle PDF
        if filename.lower().endswith(".pdf"):
            images = convert_from_bytes(file_bytes, dpi=300)

            for idx, img in enumerate(images):
                img_byte_arr = io.BytesIO()
                img.save(img_byte_arr, format="JPEG")

                image = vision.Image(content=img_byte_arr.getvalue())
                response = client.document_text_detection(image=image)

                if response.error.message:
                    raise Exception(response.error.message)

                full_text += f"\n--- Page {idx + 1} ---\n"
                full_text += response.full_text_annotation.text

            return full_text.strip()

        # 🖼️ Handle image
        image = vision.Image(content=file_bytes)
        response = client.document_text_detection(image=image)

        if response.error.message:
            raise Exception(response.error.message)

        return response.full_text_annotation.text

    except Exception as e:
        # 🔥 Safe fallback (DO NOT CRASH BACKEND)
        print("OCR fallback activated:", e)
        return "Mock OCR text (PDF/Image OCR not configured)"

