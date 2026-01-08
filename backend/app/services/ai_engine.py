"""
AI Engine for analyzing and comparing legal documents.
Uses Google Generative AI (Gemini) and LangChain for document analysis.
"""

from typing import Dict, Any, List
import json
from app.core.config import settings

try:
    import google.generativeai as genai
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
except ImportError:
    genai = None


def analyze_documents(fir_text: str, witness_text: str) -> Dict[str, Any]:
    """
    Analyze FIR and witness statements to identify discrepancies.
    
    Args:
        fir_text: First Information Report text
        witness_text: Witness statement text
        
    Returns:
        Dictionary containing analysis results with discrepancies
    """
    try:
        if genai is None or not settings.gemini_api_key:
            # Fallback to basic analysis
            return _basic_text_comparison(fir_text, witness_text)
        
        # Use Gemini Pro for advanced analysis
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""You are an expert legal analyst specializing in identifying contradictions in legal documents.

Analyze the following FIR and Witness Statement for logical contradictions in:
1. **Time**: Contradictory timelines or temporal impossibilities
2. **Place**: Location mismatches or geographic impossibilities
3. **Person**: Identity conflicts or behavioral contradictions
4. **Events**: Sequence or causality conflicts

**FIR (First Information Report):**
{fir_text}

**Witness Statement:**
{witness_text}

**Provide your analysis in JSON format:**
{{
  "discrepancies": [
    {{
      "type": "Time|Place|Person|Event",
      "description": "Brief description of the contradiction",
      "severity": "High|Medium|Low",
      "fir_extract": "Relevant FIR quote",
      "witness_extract": "Relevant witness quote"
    }}
  ],
  "similarity_score": 0.0-1.0,
  "recommendations": ["List of recommended actions"],
  "confidence": 0.0-1.0,
  "summary": "Brief overall assessment"
}}
"""
        
        response = model.generate_content(prompt)
        
        # Parse JSON response
        try:
            # Extract JSON from response
            result_text = response.text
            # Handle markdown code blocks
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0]
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0]
            
            analysis = json.loads(result_text.strip())
            analysis["status"] = "success"
            analysis["model"] = "gemini-pro"
            return analysis
        except json.JSONDecodeError:
            # If JSON parsing fails, return structured response
            return {
                "status": "success",
                "discrepancies": [{"description": response.text[:500]}],
                "similarity_score": 0.5,
                "recommendations": ["Review AI analysis manually"],
                "confidence": 0.6,
                "model": "gemini-pro"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "discrepancies": []
        }


def _basic_text_comparison(text1: str, text2: str) -> Dict[str, Any]:
    """Fallback basic text comparison when Gemini is unavailable"""
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    common_words = words1.intersection(words2)
    all_words = words1.union(words2)
    
    similarity = len(common_words) / len(all_words) if all_words else 0
    
    return {
        "status": "success",
        "discrepancies": ["AI analysis unavailable - Gemini API key not configured"],
        "similarity_score": similarity,
        "recommendations": ["Configure GEMINI_API_KEY for advanced AI analysis"],
        "confidence": 0.3,
        "model": "basic"
    }


def compare_texts(text1: str, text2: str) -> Dict[str, Any]:
    """
    Compare two pieces of text and identify differences.
    
    Args:
        text1: First text to compare
        text2: Second text to compare
        
    Returns:
        Dictionary containing comparison results
    """
    try:
        # TODO: Implement advanced text comparison using AI
        return {
            "status": "success",
            "similarity_score": 0.75,
            "differences": [],
            "summary": "Comparison completed"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


def extract_entities(text: str) -> Dict[str, Any]:
    """
    Extract named entities and key information from legal text.
    
    Args:
        text: Legal document text
        
    Returns:
        Dictionary containing extracted entities
    """
    try:
        # TODO: Implement entity extraction using Gemini
        return {
            "status": "success",
            "entities": [],
            "key_phrases": [],
            "dates": [],
            "locations": [],
            "persons": []
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
