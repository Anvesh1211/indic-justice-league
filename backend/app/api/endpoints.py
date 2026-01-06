from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi import Depends
from app.core.security import require_role
import hashlib
import asyncio

from app.services import ocr, ai_engine, blockchain

router = APIRouter()

@router.post("/analyze", dependencies=[Depends(require_role("analyst"))])
async def analyze_case(
    fir: UploadFile = File(...),
    witness: UploadFile = File(...)
):
    try:
        # 1. Read files
        fir_bytes = await fir.read()
        witness_bytes = await witness.read()

        # 2. Hash files (Trust Layer)
        fir_hash = hashlib.sha256(fir_bytes).hexdigest()
        witness_hash = hashlib.sha256(witness_bytes).hexdigest()

        # 3. Blockchain anchoring (non-blocking / safe)
        try:
            fir_tx = blockchain.store_evidence(fir_hash)
            witness_tx = blockchain.store_evidence(witness_hash)
        except Exception as e:
            print("Blockchain error:", e)
            fir_tx = "mock_tx"
            witness_tx = "mock_tx"

        # 4. OCR in parallel
        fir_text, witness_text = await asyncio.gather(
            asyncio.to_thread(ocr.extract_text_from_image, fir_bytes, fir.filename),
            asyncio.to_thread(ocr.extract_text_from_image, witness_bytes, witness.filename)
        )

        # 5. AI Analysis
        analysis = ai_engine.analyze_documents(fir_text, witness_text)

        return {
            "trust_layer": {
                "fir_hash": fir_hash,
                "fir_tx": fir_tx,
                "witness_hash": witness_hash,
                "witness_tx": witness_tx
            },
            "perception_layer": {
                "fir_text": fir_text,
                "witness_text": witness_text
            },
            "cognition_layer": {
                "analysis": analysis
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
