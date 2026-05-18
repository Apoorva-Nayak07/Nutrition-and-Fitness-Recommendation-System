@echo off
REM FitAI - Windows Installation Script
REM This script installs all dependencies

echo ========================================
echo FitAI - Installation Script
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

echo.
echo ========================================
echo Installing Dependencies
echo ========================================
echo.

REM Install root dependencies
echo [1/4] Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)
echo [OK] Root dependencies installed
echo.

REM Install backend dependencies
echo [2/4] Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed
echo.

REM Install frontend dependencies
echo [3/4] Installing frontend dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed
echo.

REM Install Python dependencies
echo [4/4] Installing Python dependencies...
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
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Make sure MongoDB is installed and running
echo    Download from: https://www.mongodb.com/try/download/community
echo    OR use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
echo.
echo 2. Start the application:
echo    Double-click: START_WINDOWS.bat
echo    OR run: npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.
echo For detailed instructions, read:
echo    - WINDOWS_SETUP_GUIDE.md
echo    - START_HERE.md
echo    - FINAL_OUTPUT.md
echo.
echo ========================================
pause
