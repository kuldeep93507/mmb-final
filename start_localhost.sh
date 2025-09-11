#!/bin/bash

# MMB Portfolio - Local Development Starter for macOS/Linux

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
cat << "EOF"
===============================================
  MMB Portfolio - Local Development Starter
===============================================
EOF
echo -e "${NC}"

# Check if we're in the right directory
if [[ ! -d "backend" ]] || [[ ! -d "frontend" ]]; then
    echo -e "${RED}ERROR: backend or frontend folder not found!${NC}"
    echo "Please run this script from the mmb-portfolio directory"
    exit 1
fi

echo -e "${GREEN}[1/5] Setting up Backend...${NC}"
cd backend

# Check if virtual environment exists
if [[ ! -d "venv" ]]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env exists
if [[ ! -f ".env" ]]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}Please edit backend/.env with your MongoDB connection!${NC}"
fi

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo -e "${GREEN}[2/5] Seeding database...${NC}"
python seed_data.py

echo -e "${GREEN}[3/5] Setting up Frontend...${NC}"
cd ../frontend

# Check if .env exists
if [[ ! -f ".env" ]]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
fi

echo "Installing Node.js dependencies..."
npm install

echo -e "${GREEN}[4/5] Starting servers...${NC}"

# Function to start backend
start_backend() {
    cd backend
    source venv/bin/activate
    echo -e "${BLUE}Starting Backend Server on port 8001...${NC}"
    python server.py
}

# Function to start frontend  
start_frontend() {
    cd frontend
    echo -e "${BLUE}Starting Frontend Server on port 3000...${NC}"
    npm start
}

echo -e "${GREEN}[5/5] Setup Complete!${NC}"
echo ""
echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}🎉 MMB Portfolio is ready to start!${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""
echo -e "${YELLOW}You have two options:${NC}"
echo ""
echo -e "${YELLOW}Option 1: Automatic (Recommended)${NC}"
echo "  This will open two terminal tabs automatically"
echo ""
echo -e "${YELLOW}Option 2: Manual${NC}"
echo "  Open two terminals manually and run:"
echo "    Terminal 1: cd backend && source venv/bin/activate && python server.py"
echo "    Terminal 2: cd frontend && npm start"
echo ""

# Check if we're on macOS and can use osascript
if [[ "$OSTYPE" == "darwin"* ]] && command -v osascript &> /dev/null; then
    read -p "Choose option (1 for automatic, 2 for manual): " choice
    
    if [[ "$choice" == "1" ]]; then
        echo "Starting servers automatically..."
        
        # Get current directory
        CURRENT_DIR=$(pwd)
        
        # Start backend in new Terminal tab
        osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$CURRENT_DIR/backend' && source venv/bin/activate && echo 'Backend Server Starting...' && python server.py"
end tell
EOF
        
        # Wait a moment
        sleep 2
        
        # Start frontend in new Terminal tab
        osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$CURRENT_DIR/frontend' && echo 'Frontend Server Starting...' && npm start"
end tell
EOF
        
        echo -e "${GREEN}✅ Servers started in new Terminal tabs!${NC}"
    else
        echo -e "${YELLOW}Manual mode selected. Please open two terminals and run the commands shown above.${NC}"
    fi
    
elif command -v gnome-terminal &> /dev/null; then
    # Linux with GNOME Terminal
    read -p "Choose option (1 for automatic, 2 for manual): " choice
    
    if [[ "$choice" == "1" ]]; then
        echo "Starting servers automatically..."
        
        # Start backend
        gnome-terminal -- bash -c "cd backend && source venv/bin/activate && echo 'Backend Server Starting...' && python server.py; exec bash"
        
        # Wait a moment
        sleep 2
        
        # Start frontend
        gnome-terminal -- bash -c "cd frontend && echo 'Frontend Server Starting...' && npm start; exec bash"
        
        echo -e "${GREEN}✅ Servers started in new terminal windows!${NC}"
    else
        echo -e "${YELLOW}Manual mode selected. Please open two terminals and run the commands shown above.${NC}"
    fi
else
    echo -e "${YELLOW}Automatic terminal opening not supported on this system.${NC}"
    echo -e "${YELLOW}Please open two terminals manually and run:${NC}"
    echo ""
    echo -e "${BLUE}Terminal 1 (Backend):${NC}"
    echo "  cd $(pwd)/backend"
    echo "  source venv/bin/activate"
    echo "  python server.py"
    echo ""
    echo -e "${BLUE}Terminal 2 (Frontend):${NC}"
    echo "  cd $(pwd)/frontend"
    echo "  npm start"
fi

echo ""
echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}🌐 Access Your Application:${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend:${NC}  http://localhost:8001"
echo -e "${GREEN}Admin:${NC}    http://localhost:3000/admin/login"
echo ""
echo -e "${YELLOW}Default Admin Credentials:${NC}"
echo -e "${GREEN}Email:${NC}    kuldeep@mmb.dev"
echo -e "${GREEN}Password:${NC} MMB@2024!Secure"
echo ""
echo -e "${RED}⚠️  REMEMBER: Change admin password after first login!${NC}"
echo ""
echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}Happy Coding! 🚀${NC}"
echo -e "${BLUE}===============================================${NC}"