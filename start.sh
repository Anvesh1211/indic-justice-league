#!/bin/bash
# 🚀 Nyaya-Drishti Quick Start Script

echo "🚀 Starting Nyaya-Drishti Deployment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if Hardhat is running
echo "📡 Step 1: Checking Hardhat node..."
if curl -s http://127.0.0.1:8545 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Hardhat node is running${NC}"
else
    echo -e "${RED}❌ Hardhat node not running${NC}"
    echo "Starting Hardhat node in background..."
    cd smart_contracts
    npx hardhat node > hardhat.log 2>&1 &
    HARDHAT_PID=$!
    echo "Waiting 5 seconds for node to start..."
    sleep 5
    cd ..
fi

# Step 2: Deploy Smart Contract
echo ""
echo "📜 Step 2: Deploying EvidenceVault contract..."
cd smart_contracts
CONTRACT_OUTPUT=$(npx hardhat run scripts/deploy.js --network localhost 2>&1)
CONTRACT_ADDRESS=$(echo "$CONTRACT_OUTPUT" | grep "deployed to:" | awk '{print $NF}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}❌ Contract deployment failed${NC}"
    echo "$CONTRACT_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Contract deployed: $CONTRACT_ADDRESS${NC}"

# Step 3: Copy ABI
echo ""
echo "📋 Step 3: Copying contract ABI..."
mkdir -p ../backend/app/data/abi
cp artifacts/contracts/EvidenceVault.sol/EvidenceVault.json ../backend/app/data/abi/
echo -e "${GREEN}✅ ABI copied${NC}"

# Step 4: Update .env
echo ""
echo "⚙️  Step 4: Updating .env file..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Update contract address in .env
if grep -q "CONTRACT_ADDRESS=" .env; then
    sed -i "s/CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" .env
else
    echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env
fi

echo -e "${GREEN}✅ .env updated${NC}"

# Step 5: Start Backend
echo ""
echo "🐍 Step 5: Starting FastAPI backend..."
echo -e "${YELLOW}⚠️  Make sure you have configured:${NC}"
echo "   - GEMINI_API_KEY in .env"
echo "   - google_creds.json file"
echo ""
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
sleep 3

# Step 6: Health Check
echo ""
echo "🏥 Step 6: Health check..."
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

# Step 7: Frontend (optional)
echo ""
echo "⚛️  Step 7: Starting frontend..."
echo "Run this in a new terminal:"
echo -e "${YELLOW}cd frontend && npm run dev${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Access Points:"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Frontend: http://localhost:5173 (run 'npm run dev' in frontend/)"
echo ""
echo "📄 Next Steps:"
echo "   1. Configure GEMINI_API_KEY in backend/.env"
echo "   2. Add google_creds.json to backend/"
echo "   3. Start frontend: cd frontend && npm run dev"
echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID"
if [ ! -z "$HARDHAT_PID" ]; then
    echo "   kill $HARDHAT_PID"
fi
