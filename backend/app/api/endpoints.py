from fastapi import APIRouter, UploadFile, File
from typing import List
import json

from app.services.ai_engine import analyze_documents
from app.services.ocr import extract_text_from_image
from app.services.blockchain import store_evidence

router = APIRouter()

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        content = await file.read()
        # Assume PDF or image, extract text
        text = extract_text_from_image(content)  # Placeholder
        results.append({"filename": file.filename, "text": text})
    return {"uploaded": results}

@router.post("/analyze")
async def analyze(fir_text: str, witness_text: str):
    analysis = analyze_documents(fir_text, witness_text)
    # Store on blockchain
    tx_hash = store_evidence(json.dumps(analysis))
    return {"analysis": analysis, "tx_hash": tx_hash}