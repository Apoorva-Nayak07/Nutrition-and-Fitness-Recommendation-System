@echo off
echo ========================================
echo FitAI - Complete Setup and Run
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed
echo.

echo Step 2: Installing Frontend Dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed
echo.

echo Step 3: Installing Python Dependencies...
cd ml-service
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python installation failed
    pause
    exit /b 1
)
cd ..
echo [OK] Python dependencies installed
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Now starting the application...
echo.
echo IMPORTANT: Make sure MongoDB is running!
echo.
echo If MongoDB is not running:
echo   - Install from: https://www.mongodb.com/try/download/community
echo   - OR use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
echo.
pause

echo Starting services in 3 new windows...
echo.

start "FitAI Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

start "FitAI Frontend" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak >nul

start "FitAI ML Service" cmd /k "cd ml-service && python app.py"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Wait 15-20 seconds, then open:
echo    http://localhost:3000
echo.
echo Services running:
echo    Backend:    http://localhost:5000
echo    Frontend:   http://localhost:3000
echo    ML Service: http://localhost:8000
echo.
pause
