from typing import Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import json

from app.services.ai_engine import analyze_documents as ai_analyze
from app.services.ocr import extract_text_from_image, process_document
from app.services.blockchain import store_evidence, retrieve_evidence

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Nyaya-Drishti Backend API",
        "version": "1.0.0"
    }


@router.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    """
    Upload and process documents (images or PDFs).
    Extracts text using OCR.
    """
    try:
        results = []
        for file in files:
            try:
                content = await file.read()
                
                # Determine file type
                file_type = "pdf" if file.filename.endswith(".pdf") else "image"
                
                # Extract text from file
                text = process_document(content, file_type)
                
                results.append({
                    "filename": file.filename,
                    "text": text,
                    "status": "success"
                })
            except Exception as e:
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "message": str(e)
                })
        
        return {
            "status": "success",
            "uploaded": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/analyze")
async def analyze_endpoint(request_data: Dict[str, Any]):
    """
    Analyze FIR and witness statements for discrepancies.
    Stores evidence on blockchain.
    """
    try:
        fir_text = request_data.get("fir_text", "")
        witness_statements = request_data.get("witness_statements", [])
        
        # Backward compatibility for single witness text
        if not witness_statements and request_data.get("witness_text"):
            witness_statements = [request_data.get("witness_text")]
        
        if not fir_text or not witness_statements:
            raise HTTPException(
                status_code=400,
                detail="fir_text and at least one witness statement are required"
            )
        
        # Analyze documents
        analysis = ai_analyze(fir_text, witness_statements)
        
        # Store evidence on blockchain
        tx_hash = store_evidence(json.dumps(analysis))
        
        return {
            "status": "success",
            "analysis": analysis,
            "tx_hash": tx_hash,
            "stored_on_blockchain": bool(tx_hash)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compare")
async def compare_endpoint(request_data: Dict[str, str]):
    """Compare two text inputs for differences"""
    try:
        text1 = request_data.get("text1", "")
        text2 = request_data.get("text2", "")
        
        if not text1 or not text2:
            raise HTTPException(
                status_code=400,
                detail="Both text1 and text2 are required"
            )
        
        # Simple line-by-line comparison
        lines1 = text1.split("\n")
        lines2 = text2.split("\n")
        
        differences = []
        for i, (l1, l2) in enumerate(zip(lines1, lines2)):
            if l1 != l2:
                differences.append({
                    "line": i + 1,
                    "text1": l1,
                    "text2": l2
                })
        
        similarity = 1 - (len(differences) / max(len(lines1), len(lines2))) if max(len(lines1), len(lines2)) > 0 else 1
        
        return {
            "status": "success",
            "similarity_score": similarity,
            "differences_count": len(differences),
            "differences": differences
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-text")
async def extract_text_endpoint(file: UploadFile = File(...)):
    """Extract text from a single image file"""
    try:
        content = await file.read()
        text = extract_text_from_image(content)
        
        return {
            "status": "success",
            "filename": file.filename,
            "text": text
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/evidence/{tx_hash}")
async def get_evidence_endpoint(tx_hash: str):
    """Retrieve evidence from blockchain by transaction hash"""
    try:
        evidence = retrieve_evidence(tx_hash)
        return {
            "status": "success",
            "tx_hash": tx_hash,
            "evidence": evidence
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
