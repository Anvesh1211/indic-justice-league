# Nyaya-Drishti

A legal tech application for evidence analysis and verification using AI, OCR, and blockchain.

## Overview

Nyaya-Drishti is a comprehensive platform that leverages advanced AI technologies to analyze legal documents, extract evidence through OCR, and ensure data integrity via blockchain. The system compares FIRs with witness statements, identifies discrepancies, and stores evidence immutably on the blockchain.

## Tech Stack

- **Backend**: FastAPI (Python)
- **AI Engine**: Gemini + LangChain
- **OCR**: Google Vision API
- **Blockchain**: Polygon (Web3.py)
- **Vector Store**: ChromaDB
- **Frontend**: React + Vite + Tailwind CSS
- **Smart Contracts**: Solidity + Hardhat

## Team Members

- Member 1: AI Engine & OCR
- Member 2: Blockchain Integration
- Member 3: Backend Development
- Member 4: Frontend Development

## Setup

1. Clone the repository
2. Set up environment variables in `.env`
3. Install backend dependencies: `pip install -r backend/requirements.txt`
4. Install frontend dependencies: `cd frontend && npm install`
5. Install smart contract dependencies: `cd smart_contracts && npm install`
6. Run the backend: `cd backend && uvicorn app.main:app --reload`
7. Run the frontend: `cd frontend && npm run dev`
8. Deploy smart contracts: `cd smart_contracts && npx hardhat run scripts/deploy.js --network polygon`

## Demo Flow

1. Upload FIR and witness statements via the frontend
2. OCR extracts text from documents
3. AI analyzes and compares the content
4. Discrepancies are highlighted in the diff view
5. Evidence is stored on blockchain for immutability