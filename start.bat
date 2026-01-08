@echo off
REM 🚀 Nyaya-Drishti Quick Start Script for Windows

echo 🚀 Starting Nyaya-Drishti Deployment...
echo.

REM Step 1: Check if Hardhat is running
echo 📡 Step 1: Checking Hardhat node...
curl -s http://127.0.0.1:8545 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Hardhat node is running
) else (
    echo ❌ Hardhat node not running
    echo Starting Hardhat node in new window...
    cd smart_contracts
    start "Hardhat Node" cmd /k "npx hardhat node"
    timeout /t 5 >nul
    cd ..
)

REM Step 2: Deploy Smart Contract
echo.
echo 📜 Step 2: Deploying EvidenceVault contract...
cd smart_contracts
for /f "tokens=*" %%a in ('npx hardhat run scripts/deploy.js --network localhost ^| findstr "deployed to:"') do set CONTRACT_LINE=%%a
for %%a in (%CONTRACT_LINE%) do set CONTRACT_ADDRESS=%%a
echo ✅ Contract deployed: %CONTRACT_ADDRESS%

REM Step 3: Copy ABI
echo.
echo 📋 Step 3: Copying contract ABI...
if not exist "..\backend\app\data\abi" mkdir "..\backend\app\data\abi"
copy "artifacts\contracts\EvidenceVault.sol\EvidenceVault.json" "..\backend\app\data\abi\" >nul
echo ✅ ABI copied

REM Step 4: Update .env
echo.
echo ⚙️  Step 4: Updating .env file...
cd ..\backend
if not exist ".env" copy ".env.example" ".env"
echo CONTRACT_ADDRESS=%CONTRACT_ADDRESS%>> .env
echo ✅ .env updated

REM Step 5: Start Backend
echo.
echo 🐍 Step 5: Starting FastAPI backend...
echo ⚠️  Make sure you have configured:
echo    - GEMINI_API_KEY in .env
echo    - google_creds.json file
echo.
start "FastAPI Backend" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 >nul

REM Step 6: Health Check
echo.
echo 🏥 Step 6: Health check...
timeout /t 2 >nul
curl -s http://localhost:8000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy
) else (
    echo ❌ Backend health check failed
)

REM Step 7: Frontend instructions
echo.
echo ⚛️  Step 7: Starting frontend...
echo Run this in a new terminal:
echo   cd frontend ^&^& npm run dev
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ Deployment Complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📍 Access Points:
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo    Frontend: http://localhost:5173 (run 'npm run dev' in frontend/)
echo.
echo 📄 Next Steps:
echo    1. Configure GEMINI_API_KEY in backend\.env
echo    2. Add google_creds.json to backend\
echo    3. Start frontend: cd frontend ^&^& npm run dev
echo.
pause
