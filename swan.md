# Member 3 — Backend, Security & Orchestration (System Glue)

This document describes the **backend work completed by Member 3**, the **current backend architecture**, and **clear instructions for other members** on how to integrate or extend the system without breaking the pipeline.

The backend follows the architecture defined in the project PDF:
**Trust-first, Analyze-second Hybrid AI + Blockchain System**.

---

## 1. Role Summary (What Member 3 Owns)

Member 3 is responsible for:
- Backend orchestration using FastAPI
- Secure file upload pipeline
- SHA-256 hashing (Trust Layer)
- Blockchain anchoring (mock + real ready)
- Asynchronous coordination of OCR and AI
- Role-based API protection
- Demo-safe fallbacks (no crashes)

Member 3 **does NOT** implement:
- Smart contract logic
- AI prompt engineering
- Frontend UI

---

## 2. Backend Folder Structure

backend/
│
├── app/
│ ├── main.py
│ ├── api/
│ │ └── endpoints.py
│ ├── services/
│ │ ├── blockchain.py
│ │ ├── ocr.py
│ │ └── ai_engine.py
│ ├── core/
│ │ ├── config.py
│ │ └── security.py
│ └── data/
│ └── abi/
│ └── EvidenceVault.json
│
├── requirements.txt
└── member-3.md


---

## 3. File-by-File Explanation

### 3.1 `app/main.py`
**Purpose:** FastAPI app entry point.

- Initializes FastAPI
- Configures CORS
- Registers API router under `/api`
- Root endpoint for health check

⚠️ Do not move or rename this file.

---

### 3.2 `app/api/endpoints.py`
**Purpose:** Main orchestration endpoint.

#### Key endpoint:
POST /api/analyze

**What it does (in order):**
1. Accepts two files:
   - FIR document
   - Witness statement
2. Reads files asynchronously
3. Computes SHA-256 hashes
4. Anchors hashes to blockchain (mock or live)
5. Runs OCR concurrently on both files
6. Passes extracted text to AI engine
7. Returns a unified JSON response:
   - Trust layer
   - Perception layer
   - Cognition layer

**Important keywords used:**
- `UploadFile`
- `asyncio.gather`
- `hashlib.sha256`
- `Depends()` (role-based access)

⚠️ Do not add new endpoints without coordination.

---

### 3.3 `app/services/blockchain.py`
**Purpose:** Trust Layer (Proof of Existence).

**Key features:**
- Stores ONLY SHA-256 hashes (not raw data)
- Uses Polygon-compatible Web3 interface
- Supports `MOCK_BLOCKCHAIN = True` for hackathon/demo
- Returns transaction hash immediately (non-blocking)

**Important keywords & libraries:**
- `web3`
- `eth_account`
- `bytes32`
- `registerEvidence`

⚠️ AI output must NEVER be stored on-chain.

---

### 3.4 `app/services/ocr.py`
**Purpose:** Perception Layer (Document → Text).

**Capabilities:**
- Supports PDFs and images
- Converts PDFs → images (multi-page support)
- Adds page markers (`--- Page X ---`)
- Uses Google Vision if available
- Falls back safely if OCR is not configured

**Important libraries:**
- `google-cloud-vision`
- `pdf2image`
- `PIL`
- `io.BytesIO`

⚠️ OCR failures never crash the backend.

---

### 3.5 `app/services/ai_engine.py`
**Purpose:** Cognition Layer interface (AI reasoning).

**Current state:**
- Deterministic mock output
- Stable JSON schema
- Ready for Gemini + LangChain integration

**Output structure:**
- `contradictions` (list of structured issues)
- `summary` (risk level, confidence)
- `recommendations`

⚠️ Do NOT change output keys — frontend depends on them.

---

### 3.6 `app/core/config.py`
**Purpose:** Environment configuration.

- Uses `pydantic-settings`
- Loads `.env` variables
- Safe defaults for hackathon

**Libraries used:**
- `pydantic-settings`

---

### 3.7 `app/core/security.py`
**Purpose:** Minimal role-based access control.

**How it works:**
- Uses request header `X-Role`
- `/api/analyze` requires `X-Role: analyst`
- Easy to extend to JWT/OAuth later

⚠️ This is intentional lightweight security for demo.

---

### 3.8 `app/data/abi/EvidenceVault.json`
**Purpose:** Smart contract ABI.

- Matches `registerEvidence(bytes32)`
- Matches `verifyEvidence(bytes32)`
- Used by `blockchain.py`

⚠️ If smart contract changes, this file must be updated.

---

## 4. Libraries Used (Backend)

fastapi
uvicorn
python-multipart
python-dotenv
pydantic-settings
web3
eth-account
google-cloud-vision (optional, safe fallback)
pdf2image
pillow


---

## 5. How to Run the Backend

From `backend/` directory: uvicorn app.main:app --reload


Open:
http://127.0.0.1:8000/docs


---

## 6. Required Headers for API Calls

For `/api/analyze`:
X-Role: analyst


Without this header, the API returns `403 Forbidden`.

---

## 7. What Other Members Should Do Next

### For Member 1 (AI / NLP):
- Replace logic inside `ai_engine.py`
- Keep output JSON schema unchanged
- Integrate Gemini + LangChain internally only

### For Member 2 (Blockchain):
- Deploy EvidenceVault contract
- Share contract address
- Set `MOCK_BLOCKCHAIN = False`
- Update `.env` with:
  - `POLYGON_RPC_URL`
  - `PRIVATE_KEY`
  - `CONTRACT_ADDRESS`

### For Member 4 (Frontend):
- Call `/api/analyze` with files
- Send `X-Role: analyst` header
- Render:
  - Hashes
  - Transaction IDs
  - Contradiction table

---

## 8. Important Warnings (Please Read)

❌ Do not store raw documents on blockchain  
❌ Do not block API waiting for blockchain confirmation  
❌ Do not change response keys  
❌ Do not bypass hashing step  

---

## 9. Final Note

This backend is:
- Architecturally complete
- Demo-safe
- Extensible
- Judge-ready

All future work should **build on top of this**, not around it.

