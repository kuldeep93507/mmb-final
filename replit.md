# MMB Portfolio - Replit Setup

## Project Overview
This is a full-stack portfolio website featuring a React frontend and FastAPI backend. The application uses JSON file-based mock data storage and is fully configured for the Replit environment.

## Recent Changes
- **Date**: September 12, 2025
- **Hero Section Management System Implemented**:
  - ✅ Complete hero section now fully editable from admin panel
  - ✅ Created comprehensive `AdminHeroSection` page with all editing controls
  - ✅ Added backend API endpoints (`/api/admin/hero-section`, `/api/hero-section`) 
  - ✅ Updated database schema with `HeroSection` and `HeroStats` models
  - ✅ Frontend dynamically loads hero section data from API instead of hardcoded values
  - ✅ All hero section elements now editable: greeting, main heading (3 lines), subtitle, CTA button, profile info, stats
  - ✅ Live preview functionality in admin interface
  - ✅ Added hero section menu item in admin sidebar for easy access
  - ✅ Tested and verified: API working correctly, admin can update content, changes reflect on homepage
- **Previous Updates**:
  - Configured unified production workflow serving both frontend and backend on port 5000
  - Updated backend server.py to use PORT environment variable for flexible deployment
  - Backend now serves built React files as static content for production deployment
  - Configured for Replit environment with proper host configurations
  - Set up CORS for cross-origin communication and resolved deployment issues

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