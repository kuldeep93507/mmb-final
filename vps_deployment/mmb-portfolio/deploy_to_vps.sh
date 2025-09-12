#!/bin/bash
# MMB Portfolio VPS Deployment Script
# For Ubuntu 24.04 VPS (194.238.23.105)

echo "🚀 MMB Portfolio VPS Deployment Script"
echo "======================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ Please don't run as root. Run as regular user.${NC}"
   exit 1
fi

echo -e "${YELLOW}📍 Current directory: $(pwd)${NC}"

# Step 1: Update system
echo -e "${GREEN}🔄 Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Step 2: Install Python 3.11 and pip
echo -e "${GREEN}🐍 Step 2: Installing Python 3.11...${NC}"
sudo apt install -y python3.11 python3.11-venv python3-pip

# Step 3: Install Node.js 20
echo -e "${GREEN}📦 Step 3: Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Step 4: Install UFW firewall
echo -e "${GREEN}🔥 Step 4: Setting up firewall...${NC}"
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow 5000/tcp
sudo ufw allow 8000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Step 5: Create project directory
echo -e "${GREEN}📁 Step 5: Setting up project directory...${NC}"
PROJECT_DIR="/var/www/mmb-portfolio"
sudo mkdir -p "$PROJECT_DIR"
sudo chown -R $USER:$USER "$PROJECT_DIR"

# Step 6: Copy files
echo -e "${GREEN}📋 Step 6: Copying project files...${NC}"
cp -r ./backend "$PROJECT_DIR/"
cp -r ./frontend "$PROJECT_DIR/"
cp -r ./mock_data "$PROJECT_DIR/" 2>/dev/null || echo "Mock data will be created automatically"

# Step 7: Setup Backend
echo -e "${GREEN}🔧 Step 7: Setting up Backend...${NC}"
cd "$PROJECT_DIR"
python3.11 -m venv .venv
source .venv/bin/activate

# Install backend dependencies
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Step 8: Setup Frontend
echo -e "${GREEN}⚛️  Step 8: Setting up Frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm install

# Step 9: Configure environment variables
echo -e "${GREEN}🔐 Step 9: Configuring environment variables...${NC}"
cd "$PROJECT_DIR"

# Backend .env
cat > backend/.env << EOF
CORS_ORIGINS=http://194.238.23.105:5000,http://localhost:5000
FRONTEND_URL=http://194.238.23.105:5000
JWT_SECRET=mmb-portfolio-jwt-secret-key-for-vps-$(date +%s)
DB_NAME=mmb_portfolio
EOF

# Frontend .env
cat > frontend/.env << EOF
REACT_APP_BACKEND_URL=http://194.238.23.105:8000
PORT=5000
HOST=0.0.0.0
WDS_SOCKET_HOST=0.0.0.0
EOF

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Start Backend: cd $PROJECT_DIR && source .venv/bin/activate && cd backend && python server.py"
echo "2. Start Frontend: cd $PROJECT_DIR/frontend && npm start"
echo "3. Visit: http://194.238.23.105:5000"
echo ""
echo -e "${GREEN}🎉 MMB Portfolio is ready on your VPS!${NC}"