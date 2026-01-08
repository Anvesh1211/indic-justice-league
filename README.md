# Nyaya-Drishti (Indic Justice League)

A legal tech application for evidence analysis and verification using AI, OCR, and blockchain.

## 🚀 Overview

Nyaya-Drishti is a comprehensive platform that leverages advanced AI technologies to analyze legal documents, extract evidence through OCR, and ensure data integrity via blockchain. The system compares First Information Reports (FIRs) with multiple witness statements, identifies discrepancies using Google's Gemini Pro model, and stores the analysis hash immutably on the Polygon blockchain.

## ✨ Key Features

- **Multi-Witness Analysis**: Cross-reference an FIR against multiple witness statements simultaneously.
- **AI Discrepancy Detection**: Uses Gemini Pro to spot contradictions (FIR vs. Witness, Witness vs. Witness).
- **Blockchain Evidence**: Hashes of analysis results are stored on the Polygon blockchain to prevent tampering.
- **OCR Integration**: Extracts text from uploaded images or scanned PDFs using Google Vision API.
- **Privacy & Security**: Secure handling of sensitive legal data.

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python 3.x)
- **AI Engine**: Google Gemini Pro (via `google-generativeai`)
- **OCR**: Google Vision API
- **Blockchain**: Polygon (Hardhat, Solidity, Web3.py)
- **Frontend**: React + Vite + Tailwind CSS

## 📋 Prerequisites

- **Python** (3.9+)
- **Node.js** (16+)
- **Google Cloud Credentials** (`google_creds.json`) with Vision API enabled.
- **Gemini API Key** (AI Studio).
- **MetaMask** (or similar wallet) for Blockchain interactions.

## ⚙️ Installation & Setup

### 1. Smart Contracts
Deploy the contracts to a local hardhat node or Polygon testnet.

```bash
cd smart_contracts
npm install
# Start local node
npx hardhat node
# Deploy (in a separate terminal)
npx hardhat run scripts/deploy.js --network localhost
```
*Note the deployed contract address.*

### 2. Backend
Set up the Python environment and API server.

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configuration**:
Ensure your `backend/.env` file is set up:
```ini
GOOGLE_APPLICATION_CREDENTIALS=google_creds.json
GEMINI_API_KEY=your_gemini_key
POLYGON_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=deployed_contract_address
FRONTEND_URL=http://localhost:5173
```

**Run Server**:
```bash
uvicorn app.main:app --reload
```

### 3. Frontend
Launch the user interface.

```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

### Manual AI Logic Test
To verify the AI analysis without running the full frontend, use the included test script in the backend:

```bash
cd backend
# Ensure venv is active
python manual_test.py
```
This script runs a scenario with 1 FIR and 2 Witness statements against the Gemini API and prints the JSON result.

## 📄 License
MIT