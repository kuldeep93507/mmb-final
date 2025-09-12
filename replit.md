# MMB Portfolio - Replit Setup

## Project Overview
This is a full-stack portfolio website featuring a React frontend and FastAPI backend. The application uses JSON file-based mock data storage and is fully configured for the Replit environment.

## Recent Changes
- **Date**: September 12, 2025
- **Deployment Configuration Completed**:
  - Configured unified production workflow serving both frontend and backend on port 5000
  - Updated backend server.py to use PORT environment variable for flexible deployment
  - Backend now serves built React files as static content for production deployment
  - Removed separate frontend/backend workflows in favor of unified deployment
  - Optimized for Replit's webview requirements (port 5000 with webview output)
- **Previous Fixes Applied**:
  - Configured for Replit environment with proper host configurations
  - Set up CORS for cross-origin communication  
  - Removed packageManager field from frontend/package.json to fix npm installation issues
  - Resolved "Invalid Version" errors in deployment process

## Project Architecture
### Frontend (React + TailwindCSS)
- **Port**: 5000
- **Framework**: Create React App with CRACO
- **UI Library**: shadcn/ui components with Radix UI
- **Configuration**: 
  - CRACO config allows all hosts for Replit proxy
  - Environment variables point to backend API
  - Cache-Control headers set to no-cache

### Backend (FastAPI)
- **Port**: 8000
- **Framework**: FastAPI with Uvicorn
- **Database**: JSON file-based mock database
- **Authentication**: JWT-based admin authentication
- **CORS**: Configured for Replit domain and localhost

## Environment Configuration
### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://c8c5ce43-b358-4b41-9b87-8a58609f42a6-00-kmxcabryim7l.kirk.replit.dev:8000
PORT=5000
HOST=0.0.0.0
WDS_SOCKET_HOST=0.0.0.0
```

### Backend (.env)
```
CORS_ORIGINS=https://c8c5ce43-b358-4b41-9b87-8a58609f42a6-00-kmxcabryim7l.kirk.replit.dev,http://localhost:5000
FRONTEND_URL=https://c8c5ce43-b358-4b41-9b87-8a58609f42a6-00-kmxcabryim7l.kirk.replit.dev
JWT_SECRET=mmb-portfolio-jwt-secret-key-for-replit-dev
DB_NAME=mmb_portfolio
```

## Deployment Configuration
**Production Workflow**: `cd backend && PORT=5000 python server.py`
- Unified deployment serving both frontend and backend on port 5000
- Backend serves built React files as static content
- Optimized for Replit's autoscale deployment requirements

## Admin Access
- **URL**: https://[replit-domain]/admin/login
- **Note**: Admin credentials are configured during setup for security

## Key Features
- Modern portfolio website with admin panel
- Dynamic content management
- Contact form integration
- Blog system
- Project showcase
- Testimonials management
- Media upload capabilities

## Deployment
Configured for Replit's autoscale deployment with production build process.

## Security Notes
- CORS properly configured for Replit environment
- JWT authentication for admin access
- Environment variables used for configuration
- No wildcard CORS origins in production