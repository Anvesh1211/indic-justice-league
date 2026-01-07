from app.core.config import settings
import google.generativeai as genai

def analyze_text(fir_text: str, witness_text: str):
    if not settings.GEMINI_API_KEY:
        return {
            "summary": "AI not configured",
            "contradictions": []
        }

    genai.configure(api_key=settings.GEMINI_API_KEY)

    model = genai.GenerativeModel("gemini-pro")

    prompt = f"""
    Compare the following documents and identify contradictions.

    FIR:
    {fir_text}

    Witness Statement:
    {witness_text}

    Return structured contradictions.
    """

    response = model.generate_content(prompt)

    return {
        "summary": "Analysis complete",
        "contradictions": response.text
    }

def analyze_documents(fir_text: str, witness_text: str):
    return {
        "summary": "AI mock analysis",
        "contradictions": [],
        "status": "ok"
    }

