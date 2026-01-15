@echo off
echo Starting Zombie Swamp Game Server...
echo.
echo The game will open in your browser at http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when you're done playing.
echo.

cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/
    pause
    exit /b
)

REM Start Python's built-in HTTP server
echo Starting server...
start http://localhost:8000
python -m http.server 8000
