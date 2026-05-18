@echo off
REM FitAI Setup Script for Windows
REM This script automates the setup process for the FitAI application

echo ========================================
echo FitAI - AI-Powered Nutrition and Fitness System
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python is installed
    python --version
) else (
    echo [ERROR] Python is not installed
    echo Please install Python 3.11+ from https://python.org/
    pause
    exit /b 1
)

REM Check pip
where pip >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] pip is installed
    pip --version
) else (
    echo [ERROR] pip is not installed
    pause
    exit /b 1
)

REM Check Docker (optional)
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker is installed
    docker --version
) else (
    echo [INFO] Docker is not installed (optional)
    echo Install from https://www.docker.com/
)

echo.
echo Installing dependencies...
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)
echo [OK] Root dependencies installed

REM Install backend dependencies
echo Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed

REM Install frontend dependencies
echo Installing frontend dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed

REM Install Python dependencies
echo Installing Python dependencies...
cd ml-service
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Python dependencies installed

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Start MongoDB:
echo    docker run -d -p 27017:27017 --name mongodb mongo:7.0
echo    OR use your local MongoDB installation
echo.
echo 2. Start all services:
echo    npm run dev
echo.
echo 3. Access the application:
echo    Frontend:   http://localhost:3000
echo    Backend:    http://localhost:5000
echo    ML Service: http://localhost:8000
echo.
echo Alternative: Use Docker
echo    docker-compose up --build
echo.
echo Documentation:
echo    - README.md - Main documentation
echo    - docs\QUICK_START.md - Quick start guide
echo    - docs\API.md - API documentation
echo.
echo Happy coding!
echo.
pause
