# ✅ Nyaya-Drishti - Setup Checklist

## 📋 Pre-Flight Checklist

Use this checklist to ensure all components are properly configured before deployment.

---

## 🎯 Quick Status Check

### Core Components
- [x] Smart Contract: Rewritten with proper hash storage
- [x] Backend Services: All 4 services implemented
- [x] Frontend: Working with correct API endpoints
- [x] Dependencies: Updated to latest compatible versions
- [x] Documentation: Complete guides created

### Your Action Items
- [ ] Get API keys (see below)
- [ ] Configure .env file
- [ ] Deploy smart contract
- [ ] Copy contract ABI
- [ ] Test end-to-end

---

## 🔑 Step 1: API Keys & Credentials

### Google Gemini API Key
**Purpose:** AI-powered contradiction analysis

**How to get:**
1. Visit: https://makersuite.google.com/app/apikey
2. Create project (if needed)
3. Click "Get API Key"
4. Copy key

**Where to add:**
```bash
# backend/.env
GEMINI_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Test:**
```bash
cd backend
python -c "from app.core.config import settings; print(settings.gemini_api_key)"
```

### Google Cloud Vision Credentials
**Purpose:** OCR text extraction from images

**How to get:**
1. Visit: https://console.cloud.google.com
2. Create new project
3. Enable "Cloud Vision API"
4. Go to "IAM & Admin" → "Service Accounts"
5. Create service account
6. Create key (JSON)
7. Download as `google_creds.json`

**Where to add:**
```bash
# Place file in backend/
backend/google_creds.json
```

**Update .env:**
```bash
GOOGLE_APPLICATION_CREDENTIALS=google_creds.json
```

**Test:**
```bash
cd backend
python -c "from google.cloud import vision; print('✅ Vision API ready')"
```

---

## 🛠️ Step 2: Local Development Setup

### Terminal 1: Blockchain Network
```bash
cd smart_contracts
npm install
npx hardhat node
```

**Expected output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**✅ Keep this terminal running!**

### Terminal 2: Deploy Smart Contract
```bash
cd smart_contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Expected output:**
```
🚀 Deploying EvidenceVault contract...
✅ EvidenceVault deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**📝 Copy the contract address!**

### Terminal 2 (continued): Copy ABI
```bash
# Still in smart_contracts/
cp artifacts/contracts/EvidenceVault.sol/EvidenceVault.json ../backend/app/data/abi/
```

**Verify:**
```bash
ls ../backend/app/data/abi/EvidenceVault.json
# Should show the file exists
```

---

## ⚙️ Step 3: Backend Configuration

### Create .env file
```bash
cd backend
cp .env.example .env
```

### Edit .env with real values
```env
# Google Cloud & AI
GOOGLE_APPLICATION_CREDENTIALS=google_creds.json
GEMINI_API_KEY=AIzaSyC-your-actual-key-here

# Blockchain (from Hardhat output)
POLYGON_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Frontend CORS
FRONTEND_URL=http://localhost:5173
```

### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Expected packages:**
- fastapi, uvicorn
- pydantic, pydantic-settings
- web3
- google-cloud-vision
- google-generativeai
- PyPDF2
- python-dotenv

### Verify Installation
```bash
python -c "from app.core.config import settings; print('✅ Config OK')"
python -c "from app.services.blockchain import BlockchainService; print('✅ Blockchain OK')"
python -c "from app.services.ai_engine import analyze_documents; print('✅ AI Engine OK')"
python -c "from app.services.ocr import extract_text_from_image; print('✅ OCR OK')"
```

---

## 🚀 Step 4: Start Services

### Terminal 3: Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Test:**
```bash
curl http://localhost:8000/api/health
# Should return: {"status":"healthy", ...}
```

### Terminal 4: Frontend
```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Access:** http://localhost:5173

---

## 🧪 Step 5: End-to-End Test

### Test 1: Upload & OCR
1. Open http://localhost:5173
2. Upload a test image or PDF
3. Verify text extraction appears

**Expected:** Text extracted successfully

### Test 2: Analysis
1. Paste FIR text:
```
FIR: Incident occurred on January 5, 2026 at 10:00 AM near City Hall.
Suspect: John Doe, wearing blue shirt.
```

2. Paste Witness text:
```
Witness Statement: I saw the incident on January 5, 2026 at 2:00 PM near Park.
Person: John Doe, wearing red shirt.
```

3. Click "Analyze Documents"

**Expected:**
- Similarity score calculated
- Discrepancies detected:
  - Time conflict: 10:00 AM vs 2:00 PM
  - Place conflict: City Hall vs Park
  - Description conflict: blue vs red shirt
- Transaction hash displayed
- Evidence stored on blockchain

### Test 3: Blockchain Verification
```bash
# Open Hardhat console
cd smart_contracts
npx hardhat console --network localhost
```

```javascript
const Vault = await ethers.getContractFactory("EvidenceVault");
const vault = Vault.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

// Check evidence count
const count = await vault.getEvidenceCount();
console.log("Evidence count:", count.toString());
// Should be > 0 after analysis
```

---

## ✅ Success Criteria

### ✓ Backend Health Checks
- [ ] FastAPI server running on :8000
- [ ] `/api/health` returns 200 OK
- [ ] No import errors in logs
- [ ] CORS allows frontend requests

### ✓ Blockchain Health Checks
- [ ] Hardhat node running on :8545
- [ ] Contract deployed successfully
- [ ] Web3 connection established
- [ ] Can read contract functions

### ✓ Frontend Health Checks
- [ ] Vite dev server on :5173
- [ ] API calls reach backend
- [ ] File upload works
- [ ] Analysis results display

### ✓ Integration Tests
- [ ] Upload → OCR → Text extraction works
- [ ] Text → AI analysis → Results display
- [ ] Analysis → Blockchain → Hash stored
- [ ] Can verify evidence on-chain

---

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: pydantic_settings"
**Fix:**
```bash
pip install pydantic-settings
```

### Issue: "Web3 not connected"
**Fix:**
1. Verify Hardhat node is running (Terminal 1)
2. Check `POLYGON_RPC_URL=http://127.0.0.1:8545` in .env
3. Test: `curl http://127.0.0.1:8545` (should not error)

### Issue: "Contract not initialized"
**Fix:**
1. Verify `CONTRACT_ADDRESS` in .env matches deployed address
2. Verify ABI copied: `ls backend/app/data/abi/EvidenceVault.json`
3. Redeploy if needed: `npx hardhat run scripts/deploy.js --network localhost`

### Issue: "Gemini API error"
**Fix:**
1. Verify `GEMINI_API_KEY` in .env is correct
2. Test: `python -c "import google.generativeai as genai; genai.configure(api_key='YOUR_KEY'); print('OK')"`
3. Check quota: https://makersuite.google.com/app/prompts

### Issue: "Google Vision error"
**Fix:**
1. Verify `google_creds.json` exists in `backend/`
2. Check file permissions: `ls -l backend/google_creds.json`
3. Test: `python -c "from google.cloud import vision; client = vision.ImageAnnotatorClient(); print('OK')"`

### Issue: "CORS error in browser"
**Fix:**
1. Check backend logs for CORS errors
2. Verify `FRONTEND_URL=http://localhost:5173` in .env
3. Restart backend after changing .env

### Issue: "Frontend can't connect"
**Fix:**
1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check `VITE_API_URL` in frontend `.env` (if exists)
3. Check browser console for errors

---

## 📊 Verification Commands

### Check All Services
```bash
# Hardhat (should return block data)
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Backend (should return health status)
curl http://localhost:8000/api/health

# Frontend (should return HTML)
curl http://localhost:5173
```

### Check Environment Variables
```bash
cd backend
python << EOF
from app.core.config import settings
print(f"Gemini Key: {'✅ Set' if settings.gemini_api_key else '❌ Missing'}")
print(f"Contract: {'✅ Set' if settings.contract_address else '❌ Missing'}")
print(f"RPC URL: {settings.polygon_rpc_url}")
print(f"Google Creds: {settings.google_application_credentials}")
EOF
```

### Check Python Packages
```bash
pip list | grep -E "fastapi|pydantic|web3|google"
```

---

## 🎯 Next Steps After Setup

### Immediate
1. [ ] Test all features manually
2. [ ] Review logs for errors
3. [ ] Check gas costs in Hardhat output
4. [ ] Verify blockchain events are emitted

### Short Term
1. [ ] Add unit tests (pytest)
2. [ ] Add smart contract tests (Hardhat)
3. [ ] Implement error boundaries in React
4. [ ] Add loading states

### Long Term
1. [ ] Deploy to Mumbai testnet
2. [ ] Add authentication
3. [ ] Implement rate limiting
4. [ ] Add monitoring/analytics

---

## 📚 Documentation Reference

- **Setup Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Code Review:** [CODE_REVIEW.md](CODE_REVIEW.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Summary:** [REVIEW_SUMMARY.md](REVIEW_SUMMARY.md)

---

## 🆘 Need Help?

1. Check documentation files above
2. Review error logs:
   - Backend: Terminal 3 output
   - Frontend: Browser console (F12)
   - Blockchain: Terminal 1 output
3. Verify all checkboxes in this file are ✅

---

**Last Updated:** January 7, 2026  
**Version:** 1.0 (Post-Review)  
**Status:** Ready for deployment ✅
