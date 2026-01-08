# 🚀 Nyaya-Drishti Deployment Guide

## ✅ Issues Fixed

### **1. Smart Contract - Complete Rewrite**
- ✅ Implements proper **Proof of Existence** with SHA-256 hashes
- ✅ Stores document metadata (type, submitter, timestamp)
- ✅ Events for transparency (`EvidenceStored`, `EvidenceVerified`)
- ✅ View functions to verify evidence on-chain
- ✅ Prevents duplicate hash storage

### **2. Backend Services - Production Ready**
- ✅ **Config**: Fixed Pydantic v2 compatibility (`pydantic-settings`)
- ✅ **Blockchain**: Full Web3 integration with transaction signing
- ✅ **OCR**: Implemented PDF extraction with PyPDF2
- ✅ **AI Engine**: Complete Gemini Pro integration with structured prompts
- ✅ **CORS**: Fixed port mismatch (5173 for Vite)

### **3. Dependencies Updated**
- ✅ Added `pydantic-settings` for Pydantic v2
- ✅ Added `PyPDF2` for PDF text extraction
- ✅ Added `python-dotenv` for environment management

---

## 📦 Setup Instructions

### **Step 1: Smart Contract Deployment**

```bash
cd smart_contracts
npm install
npx hardhat node  # Start local blockchain (keep running)
```

In a **new terminal**:
```bash
cd smart_contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Copy the deployed contract address!**

### **Step 2: Backend Configuration**

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
GOOGLE_APPLICATION_CREDENTIALS=google_creds.json
GEMINI_API_KEY=YOUR_ACTUAL_KEY

POLYGON_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy Contract ABI:**
```bash
cp ../smart_contracts/artifacts/contracts/EvidenceVault.sol/EvidenceVault.json app/data/abi/
```

**Install Dependencies:**
```bash
pip install -r requirements.txt
```

### **Step 3: Google Cloud Setup**

1. Create project at [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Cloud Vision API** and **Generative AI API**
3. Download `google_creds.json` and place in `backend/`
4. Get Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### **Step 4: Run Backend**

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Step 5: Run Frontend**

```bash
cd frontend
npm install
npm run dev
```

Access at: **http://localhost:5173**

---

## 🧪 Testing the System

### **Test 1: Health Check**
```bash
curl http://localhost:8000/api/health
```

### **Test 2: Blockchain Connection**
Open Python:
```python
from backend.app.services.blockchain import BlockchainService
service = BlockchainService()
print("Connected:", service.is_connected)
```

### **Test 3: AI Analysis**
Use the frontend at http://localhost:5173:
1. Paste FIR text
2. Paste Witness Statement
3. Click "Analyze Documents"

---

## 🔑 Key Improvements

| Component | Before | After |
|-----------|--------|-------|
| **Smart Contract** | Single string storage | SHA-256 hash + metadata + events |
| **Web3 Integration** | Placeholder | Full transaction signing & verification |
| **AI Analysis** | Mock response | Gemini Pro with structured prompts |
| **PDF Processing** | Placeholder | PyPDF2 implementation |
| **Config** | Pydantic v1 (broken) | Pydantic v2 with `pydantic-settings` |
| **CORS** | Port 3000 | Port 5173 (Vite) |

---

## 🐛 Common Issues

### Issue: `ModuleNotFoundError: No module named 'pydantic_settings'`
**Fix:** `pip install pydantic-settings`

### Issue: Smart contract not deployed
**Fix:** Make sure Hardhat node is running first, then deploy

### Issue: Web3 connection failed
**Fix:** Check `POLYGON_RPC_URL=http://127.0.0.1:8545` in .env

### Issue: Google Vision error
**Fix:** Verify `google_creds.json` path and API enabled

---

## 📁 Project Structure
```
backend/
├── app/
│   ├── main.py              # ✅ CORS fixed
│   ├── core/config.py       # ✅ Pydantic v2 compatible
│   ├── services/
│   │   ├── blockchain.py    # ✅ Full Web3 implementation
│   │   ├── ocr.py           # ✅ PDF extraction added
│   │   └── ai_engine.py     # ✅ Gemini Pro integrated
│   └── data/abi/            # ⚠️ Copy EvidenceVault.json here
├── requirements.txt         # ✅ All dependencies added
└── .env                     # ⚠️ Configure with real values

smart_contracts/
├── contracts/
│   └── EvidenceVault.sol    # ✅ Complete rewrite
├── scripts/deploy.js        # ✅ Enhanced with verification
└── hardhat.config.js        # ✅ Ready for local/testnet
```

---

## 🎯 Next Steps

1. **Test locally** with Hardhat network
2. **Get API keys** (Gemini + Google Cloud)
3. **Deploy to Polygon Mumbai** testnet (optional)
4. **Implement ChromaDB** for IPC law vector search
5. **Add file upload** → OCR pipeline in frontend

---

**Need help?** Check each component individually:
- Smart Contract: `npx hardhat test`
- Backend: `pytest` (add tests)
- Frontend: `npm run build`
