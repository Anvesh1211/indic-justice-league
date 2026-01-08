"""
AI Engine for analyzing and comparing legal documents.
Uses Google Generative AI (Gemini) for document analysis.
"""

from typing import Dict, Any, List
import json
import google.generativeai as genai
import chromadb
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.core.config import settings
import chromadb
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Configure Gemini
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)
else:
    print("Warning: GEMINI_API_KEY not found in settings")

def _get_gemini_response_json(prompt: str) -> Dict[str, Any]:
    """Helper to get JSON response from Gemini"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        # Clean up the response text to ensure it's valid JSON
        text = response.text.replace('```json', '').replace('```', '').strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return None

def analyze_documents(fir_text: str, witness_statements: List[str]) -> Dict[str, Any]:
    """
    Analyze FIR and witness statements to identify discrepancies.
    
    Args:
        fir_text: First Information Report text
        witness_statements: List of Witness statement texts
        
    Returns:
        Dictionary containing analysis results with discrepancies
    """
    try:
        if not settings.gemini_api_key:
            return {
                "status": "error",
                "message": "Gemini API Key not configured",
                "discrepancies": []
            }
        
        witness_text_formatted = "\n\n".join([f"WITNESS {i+1}:\n{stmt}" for i, stmt in enumerate(witness_statements)])

        prompt = f"""
        Act as a legal expert AI. Analyze the consistency between the following First Information Report (FIR) and multiple Witness Statements.
        
        FIR TEXT:
        {fir_text}
        
        WITNESS STATEMENTS:
        {witness_text_formatted}
        
        Task:
        1. Compare each witness statement against the FIR for contradictions.
        2. Compare witness statements against EACH OTHER for contradictions.
        3. Identify missing details or discrepancies.
        
        Output the result ONLY in the following JSON format:
        {{
            "status": "success",
            "discrepancies": [
                {{
                    "source": "Witness 1 vs FIR" or "Witness 1 vs Witness 2",
                    "details": "Description of the discrepancy"
                }}
            ],
            "similarity_score": <float between 0 and 1 indicating overall consistency>,
            "recommendations": ["list of actionable recommendations"],
            "confidence": <float between 0 and 1 representing confidence in this analysis>
        }}
        """
        
        result = _get_gemini_response_json(prompt)
        if result:
            return result
        else:
            raise Exception("Failed to generate analysis")

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "discrepancies": []
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
        if not settings.gemini_api_key:
            raise Exception("Gemini API Key missing")

        prompt = f"""
        Compare the following two texts and summarize the differences.
        
        TEXT 1:
        {text1}
        
        TEXT 2:
        {text2}
        
        Output the result ONLY in the following JSON format:
        {{
            "status": "success",
            "similarity_score": <float 0-1>,
            "differences": ["list of key differences"],
            "summary": "brief summary of comparison"
        }}
        """
        
        result = _get_gemini_response_json(prompt)
        if result:
            return result
        else:
            return {
                "status": "error",
                "message": "Model returned empty response"
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
        if not settings.gemini_api_key:
            raise Exception("Gemini API Key missing")
            
        prompt = f"""
        Extract key legal entities and information from the following text.
        
        TEXT:
        {text}
        
        Output the result ONLY in the following JSON format:
        {{
            "status": "success",
            "entities": ["list of general entities"],
            "key_phrases": ["list of key phrases"],
            "dates": ["list of dates found"],
            "locations": ["list of locations found"],
            "persons": ["list of names found"]
        }}
        """

        result = _get_gemini_response_json(prompt)
        if result:
            return result
        else:
             return {
                "status": "error",
                "message": "Model extraction failed"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_ipc_retriever():
    """Connects to the existing ChromaDB and returns a retriever."""
    try:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004", 
            google_api_key=settings.gemini_api_key
        )
        
        # Connect to the SAME path used in the ingestion script
        persistent_client = chromadb.PersistentClient(path="./chroma_db")
        
        db = Chroma(
            client=persistent_client,
            embedding_function=embeddings,
            collection_name="ipc_data" # Must match the ingestion script
        )
        
        # Return retriever configured to find the top 3 relevant sections
        return db.as_retriever(search_kwargs={"k": 3})
        
    except Exception as e:
        print(f"⚠️ Vector Store Error: {e}")
        return None
