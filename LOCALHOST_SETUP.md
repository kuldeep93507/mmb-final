# 🏠 MMB Portfolio - Localhost Setup Guide

## 🚀 Local Development Setup (5 minutes)

### Prerequisites

आपके system में ये installed होना चाहिए:
- **Node.js** (18+) - [Download](https://nodejs.org/)
- **Python** (3.8+) - [Download](https://python.org/)
- **MongoDB** - [Download](https://mongodb.com/try/download/community)

## Step 1: MongoDB Setup

### Option A: Install MongoDB Locally
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Linux
sudo apt update
sudo apt install -y mongodb

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option B: Use MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free account
3. Create cluster
4. Get connection string
5. Update in backend/.env

## Step 2: Clone/Download Project

```bash
# If using Git
git clone <your-project-url>
cd mmb-portfolio

# Or extract if downloaded as ZIP
```

## Step 3: Backend Setup (Terminal 1)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env file with your settings
# Windows: notepad .env
# macOS: open .env
# Linux: nano .env
```

**Update backend/.env file:**
```env
MONGO_URL=mongodb://localhost:27017/mmb_portfolio
DB_NAME=mmb_portfolio
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=your-local-secret-key-for-development
```

```bash
# Seed database with initial data
python seed_data.py

# Start backend server
python server.py
# या
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Backend will run on:** http://localhost:8001

## Step 4: Frontend Setup (Terminal 2)

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install Node.js dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file
# Windows: notepad .env
# macOS: open .env  
# Linux: nano .env
```

**Update frontend/.env file:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

```bash
# Start frontend development server
npm start
```

**Frontend will run on:** http://localhost:3000

## 🎉 Access Your Website

### User Website
- **URL**: http://localhost:3000
- **Pages**: Home, About, Services, Portfolio, Testimonials, Blog, Contact

### Admin Panel
- **URL**: http://localhost:3000/admin/login
- **Email**: kuldeep@mmb.dev
- **Password**: MMB@2024!Secure

## 🔧 Development Commands

### Backend Commands
```bash
cd backend
source venv/bin/activate  # Activate virtual environment

# Start server
python server.py

# Start with auto-reload
uvicorn server:app --reload

# Seed database
python seed_data.py

# Check requirements
pip list
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Install new package
npm install package-name

# Check dependencies
npm list
```

## 📁 File Structure

```
mmb-portfolio/
├── backend/
│   ├── venv/                # Virtual environment
│   ├── uploads/             # Uploaded media files
│   ├── .env                 # Environment variables
│   ├── server.py            # Main FastAPI app
│   ├── models.py            # Database models
│   ├── auth.py              # Authentication
│   ├── admin_routes.py      # Admin API routes
│   ├── public_routes.py     # Public API routes
│   ├── seed_data.py         # Database seeding
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── node_modules/        # Node.js dependencies
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts
│   │   └── hooks/           # Custom hooks
│   ├── public/              # Static files
│   ├── .env                 # Frontend environment
│   └── package.json         # Node.js dependencies
└── README.md
```

## 🛠️ Development Workflow

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   source venv/bin/activate
   python server.py
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

3. **Make Changes**:
   - Backend changes: Server auto-reloads with `--reload` flag
   - Frontend changes: Browser auto-refreshes

4. **Test Changes**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001/docs
   - Admin Panel: http://localhost:3000/admin/login

## 🔍 Testing APIs

### Using Browser
- **API Documentation**: http://localhost:8001/docs
- **Profile API**: http://localhost:8001/api/profile
- **Services API**: http://localhost:8001/api/services

### Using curl
```bash
# Test profile API
curl http://localhost:8001/api/profile

# Test services API
curl http://localhost:8001/api/services

# Test admin login
curl -X POST http://localhost:8001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kuldeep@mmb.dev","password":"MMB@2024!Secure"}'
```

## 📊 Database Management

### View Database
```bash
# Connect to MongoDB
mongo
# or
mongosh

# Use database
use mmb_portfolio

# View collections
show collections

# View admin users
db.admins.find()

# View services
db.services.find()
```

### Reset Database
```bash
cd backend
source venv/bin/activate
python seed_data.py
```

## 🆘 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Or use MongoDB Atlas connection string
```

**Port Already in Use:**
```bash
# Kill process on port 8001
lsof -ti:8001 | xargs kill -9

# Or use different port
uvicorn server:app --port 8002
```

**Python Dependencies Error:**
```bash
# Upgrade pip
pip install --upgrade pip

# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Node.js Dependencies Error:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or React will ask to use different port
```

**Environment Variables Not Loading:**
```bash
# Make sure .env file exists
ls -la .env

# Restart development server
npm start
```

## 🔧 Development Tips

### VS Code Extensions (Recommended)
- Python
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Thunder Client (API testing)
- MongoDB for VS Code

### Hot Reload Setup
- **Backend**: Use `uvicorn server:app --reload`
- **Frontend**: `npm start` automatically includes hot reload

### API Testing
- **Swagger UI**: http://localhost:8001/docs
- **Thunder Client**: VS Code extension
- **Postman**: Desktop application
- **curl**: Command line tool

## 📝 Making Changes

### Add New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.js`
3. Add navigation link if needed

### Add New API Endpoint
1. Add route in `backend/admin_routes.py` or `backend/public_routes.py`
2. Add model in `backend/models.py` if needed
3. Test in http://localhost:8001/docs

### Update Database Schema
1. Update models in `backend/models.py`
2. Update seed data in `backend/seed_data.py`
3. Run `python seed_data.py` to refresh

## 🎯 Next Steps

1. **Customize Content**: Update profile, services, projects in admin panel
2. **Add Your Data**: Replace mock data with your information
3. **Test Everything**: Forms, admin panel, all pages
4. **Build for Production**: `npm run build` when ready
5. **Deploy**: Use installation package for production

## 📞 Development Support

- **Email**: kuldeep@mmb.dev
- **Phone**: +91 9817034573

**Happy Coding! 🚀**