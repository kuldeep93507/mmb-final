@echo off
echo ===============================================
echo   MMB Portfolio - Local Development Starter
echo ===============================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: backend folder not found!
    echo Please run this script from the mmb-portfolio directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend folder not found!
    echo Please run this script from the mmb-portfolio directory
    pause
    exit /b 1
)

echo [1/5] Setting up Backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit backend\.env with your MongoDB connection!
)

echo Installing Python dependencies...
pip install -r requirements.txt

echo [2/5] Seeding database...
python seed_data.py

echo [3/5] Setting up Frontend...
cd ..\frontend

REM Check if .env exists
if not exist ".env" (
    echo Creating frontend .env file...
    copy .env.example .env
)

echo Installing Node.js dependencies...
call npm install

echo [4/5] Starting servers...
echo.
echo ===============================================
echo   Starting Backend Server (Port 8001)
echo ===============================================

REM Start backend in a new window
start "MMB Backend Server" cmd /k "cd /d %CD%\..\backend && venv\Scripts\activate && python server.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

echo.
echo ===============================================
echo   Starting Frontend Server (Port 3000)  
echo ===============================================

REM Start frontend in a new window
start "MMB Frontend Server" cmd /k "cd /d %CD% && npm start"

echo.
echo [5/5] Setup Complete!
echo.
echo ===============================================
echo   🎉 MMB Portfolio is starting up!
echo ===============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8001
echo Admin:    http://localhost:3000/admin/login
echo.
echo Default Admin Credentials:
echo Email:    kuldeep@mmb.dev
echo Password: MMB@2024!Secure
echo.
echo ⚠️  REMEMBER: Change admin password after first login!
echo.
echo Two new windows should open automatically.
echo If not, run the servers manually:
echo   Backend:  cd backend ^&^& venv\Scripts\activate ^&^& python server.py
echo   Frontend: cd frontend ^&^& npm start
echo.
echo Press any key to exit this window...
pause > nul