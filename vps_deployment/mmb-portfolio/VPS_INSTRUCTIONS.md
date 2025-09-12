# MMB Portfolio - VPS Deployment Instructions

## 🎯 Target VPS: Ubuntu 24.04 (IP: 194.238.23.105)

### 📋 Quick Deployment Steps:

#### 1. Upload Files to VPS
```bash
# Using SCP (from your local machine):
scp -r mmb-portfolio/ root@194.238.23.105:/tmp/

# Or using SFTP/FileZilla to upload the mmb-portfolio folder
```

#### 2. SSH to Your VPS
```bash
ssh root@194.238.23.105
```

#### 3. Run Automated Deployment Script
```bash
cd /tmp/mmb-portfolio
chmod +x deploy_to_vps.sh
./deploy_to_vps.sh
```

#### 4. Start the Servers

**Terminal 1 - Backend Server:**
```bash
cd /var/www/mmb-portfolio
source .venv/bin/activate
cd backend
python server.py
```

**Terminal 2 - Frontend Server:**
```bash
cd /var/www/mmb-portfolio/frontend
npm start
```

#### 5. Access Your Website
- **Main Website:** http://194.238.23.105:5000
- **Admin Panel:** http://194.238.23.105:5000/admin  
- **API Backend:** http://194.238.23.105:8000

### 🔧 Manual Setup (if automated script fails):

#### Backend Setup:
```bash
cd /var/www/mmb-portfolio
python3.11 -m venv .venv
source .venv/bin/activate
cd backend
pip install fastapi uvicorn python-dotenv python-jose python-multipart bcrypt passlib
```

#### Frontend Setup:
```bash
cd /var/www/mmb-portfolio/frontend
npm install
```

#### Configure Environment Variables:

**Backend (.env):**
```
CORS_ORIGINS=http://194.238.23.105:5000,http://localhost:5000
FRONTEND_URL=http://194.238.23.105:5000
JWT_SECRET=mmb-portfolio-jwt-secret-key-for-vps
DB_NAME=mmb_portfolio
```

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=http://194.238.23.105:8000
PORT=5000
HOST=0.0.0.0
WDS_SOCKET_HOST=0.0.0.0
```

### 🚀 Production Setup (Optional):

#### Using PM2 for Auto-Restart:
```bash
# Install PM2
npm install -g pm2

# Start Backend
cd /var/www/mmb-portfolio/backend
pm2 start server.py --name "mmb-backend" --interpreter python

# Start Frontend  
cd /var/www/mmb-portfolio/frontend
pm2 start npm --name "mmb-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 🔒 Security Configuration:

#### UFW Firewall:
```bash
sudo ufw allow ssh
sudo ufw allow 5000/tcp
sudo ufw allow 8000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 📝 Notes:
- The project uses JSON file-based mock database (no external DB required)
- Admin credentials will be set during first admin setup
- All static files and uploads will be stored locally
- Logs are available in respective server terminal outputs

### 🎊 Success Indicators:
- ✅ Backend: "Uvicorn running on http://0.0.0.0:8000"
- ✅ Frontend: "webpack compiled successfully"
- ✅ Website loads at http://194.238.23.105:5000
- ✅ API responds at http://194.238.23.105:8000

### 🆘 Troubleshooting:
- **Port conflicts:** Kill existing processes with `sudo pkill -f "python server.py"` or `sudo pkill -f "npm"`
- **Permission issues:** Check `/var/www/mmb-portfolio` ownership with `ls -la`
- **Firewall issues:** Verify with `sudo ufw status verbose`
- **Dependencies:** Reinstall with `pip install -r requirements.txt --force-reinstall`

---
**🎉 Your MMB Portfolio will be live on http://194.238.23.105:5000 after successful deployment!**