@echo off
REM FitAI - Windows Startup Script
REM This script helps you start all services easily

echo ========================================
echo FitAI - Starting Application
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB is running
) else (
    echo [INFO] MongoDB service not found or not running
    echo.
    echo Please start MongoDB using one of these methods:
    echo.
    echo Option 1: If MongoDB is installed as a service:
    echo    net start MongoDB
    echo.
    echo Option 2: If using portable MongoDB:
    echo    Open a new terminal and run:
    echo    cd C:\mongodb\bin
    echo    mongod.exe --dbpath C:\mongodb\data
    echo.
    echo Option 3: Use MongoDB Atlas (cloud):
    echo    Update server/.env with your Atlas connection string
    echo.
    pause
)

echo.
echo Starting services...
echo.
echo This will open 3 new windows:
echo   1. Backend Server (Port 5000)
echo   2. Frontend (Port 3000)
echo   3. ML Service (Port 8000)
echo.
pause

REM Start Backend
echo Starting Backend Server...
start "FitAI Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start "FitAI Frontend" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak >nul

REM Start ML Service
echo Starting ML Service...
start "FitAI ML Service" cmd /k "cd ml-service && python app.py"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Wait a few seconds, then open your browser:
echo.
echo    http://localhost:3000
echo.
echo To stop all services:
echo    Close all the terminal windows
echo    OR press Ctrl+C in each window
echo.
echo ========================================
pause
