#!/bin/bash
echo "Starting Zombie Swamp Game Server..."
echo ""
echo "The game will open in your browser at http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server when you're done playing."
echo ""

cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Python is not installed."
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

# Start Python's built-in HTTP server
echo "Starting server..."
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
else
    python -m http.server 8000
fi
