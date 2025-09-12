# 🌟 MMB Portfolio Website

> Professional portfolio website with powerful admin panel for content management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://mongodb.com)

## ✨ Features

### 🎨 User Website
- **Modern Design**: Clean, responsive, professional layout
- **Dynamic Content**: All content managed through admin panel
- **Contact Integration**: WhatsApp button, contact form, dynamic contact info
- **SEO Optimized**: Meta tags, structured data, fast loading
- **Legal Pages**: Privacy Policy, Terms of Service
- **Blog System**: Full blog with categories and tags
- **Portfolio Showcase**: Project gallery with filters
- **Testimonials**: Client reviews and ratings

### 🔧 Admin Panel
- **Dashboard**: Analytics and overview
- **Content Management**: Services, projects, blog posts, testimonials
- **Media Manager**: Upload and manage logos, images, favicon
- **Contact Management**: View and manage inquiries
- **Profile Settings**: Update personal information
- **Security**: Password management, secure authentication
- **Real-time Updates**: Changes reflect immediately on website

### 🛡️ Technical Features
- **Full-Stack**: React frontend + FastAPI backend
- **Database**: MongoDB with proper indexing
- **Authentication**: JWT-based secure admin access
- **File Upload**: Secure media upload with validation
- **API-First**: RESTful API design
- **Production Ready**: PM2, Nginx, SSL configuration
- **Backup System**: Automated database backups

## 🚀 Quick Installation

### Option 1: One-Line Install
```bash
curl -fsSL https://raw.githubusercontent.com/kuldeepparjapati/mmb-portfolio/main/install.sh | sudo bash
```

### Option 2: Manual Install
```bash
# Clone repository
git clone https://github.com/kuldeepparjapati/mmb-portfolio.git
cd mmb-portfolio

# Run installation script
chmod +x install.sh
sudo ./install.sh

# Update domain and get SSL
sudo nano /etc/nginx/sites-available/mmb-portfolio
sudo certbot --nginx -d yourdomain.com
```

## 📁 Project Structure

```
mmb-portfolio/
├── backend/                 # FastAPI backend
│   ├── models.py           # Database models
│   ├── auth.py             # Authentication
│   ├── admin_routes.py     # Admin API endpoints
│   ├── public_routes.py    # Public API endpoints
│   ├── server.py           # Main application
│   ├── seed_data.py        # Database seeding
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── hooks/          # Custom hooks
│   ├── public/             # Static assets
│   └── package.json        # Node dependencies
├── install.sh              # Automated installation script
├── nginx.conf              # Nginx configuration
├── ecosystem.config.js     # PM2 configuration
└── INSTALLATION_GUIDE.md   # Detailed installation guide
```

## 🔐 Default Admin Access

**URL**: `https://yourdomain.com/admin/login`

**Credentials**:
- Email: `kuldeep@mmb.dev`
- Password: `MMB@2024!Secure`

⚠️ **IMPORTANT**: Change these credentials immediately after installation!

## 📋 System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04+ / CentOS 7+
- **RAM**: 1GB (2GB recommended)
- **Storage**: 10GB free space
- **Network**: Public IP address
- **Domain**: Optional but recommended

### Dependencies (Auto-installed)
- Node.js 18+
- Python 3.8+
- MongoDB 6.0+
- Nginx
- PM2
- Certbot (for SSL)

## 🌐 Hosting Options

### VPS Providers (Recommended)
- **DigitalOcean**: Starting $6/month
- **Linode**: Starting $5/month  
- **Vultr**: Starting $5/month
- **Hostinger VPS**: Starting ₹329/month

### Cloud Platforms
- **AWS EC2**: Variable pricing
- **Google Cloud**: Variable pricing
- **Azure**: Variable pricing

### Managed Hosting
- **Hostinger**: Shared hosting option
- **SiteGround**: WordPress hosting
- **Cloudways**: Managed cloud hosting

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
MONGO_URL=mongodb://localhost:27017/mmb_portfolio
DB_NAME=mmb_portfolio
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
JWT_SECRET=your-super-secret-key
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

### Custom Domain Setup
1. Point A records to your server IP
2. Update Nginx configuration
3. Get SSL certificate with Certbot
4. Update CORS origins

## 📊 API Endpoints

### Public APIs
- `GET /api/profile` - Get profile information
- `GET /api/services` - Get services list
- `GET /api/projects` - Get projects list
- `GET /api/testimonials` - Get testimonials
- `GET /api/blogs` - Get blog posts
- `POST /api/contact` - Submit contact form
- `GET /api/media` - Get media assets

### Admin APIs
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/verify` - Verify admin token
- `PUT /api/admin/change-password` - Change password
- `CRUD /api/admin/{services,projects,testimonials,blogs}` - Content management
- `POST /api/admin/upload-media` - Upload media files

## 🛠️ Development

### Local Development Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python server.py

# Frontend  
cd frontend
npm install
npm start
```

### Production Build
```bash
# Frontend production build
cd frontend
npm run build

# Backend with PM2
pm2 start ecosystem.config.js
```

## 🔍 Monitoring & Maintenance

### Service Status
```bash
# Check all services
sudo systemctl status nginx mongod
pm2 status

# View logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
# Manual backup
mongodump --db mmb_portfolio --out /backup/$(date +%Y%m%d)

# Automated backup (runs daily at 2 AM)
0 2 * * * /backup/mongodb-backup.sh
```

### Updates
```bash
# Update application
cd /var/www/mmb-portfolio
git pull origin main
cd frontend && npm run build
pm2 restart all
```

## 🎨 Customization

### Branding
- Upload logo in Admin → Media Manager
- Update colors in `frontend/src/index.css`
- Modify layout in component files

### Content
- Update profile information in Admin Panel
- Add your projects, services, testimonials
- Write blog posts
- Customize About page content

### Features
- Add new pages by creating components
- Extend API endpoints in backend
- Integrate third-party services
- Add payment gateway for services

## 🆘 Troubleshooting

### Common Issues

**502 Bad Gateway**
```bash
pm2 restart all
sudo systemctl restart nginx
```

**Database Connection Error**
```bash
sudo systemctl restart mongod
```

**SSL Certificate Issues**
```bash
sudo certbot renew
```

**File Upload Issues**
```bash
# Check permissions
sudo chown -R www-data:www-data /var/www/mmb-portfolio
```

## 📞 Support

- **Email**: kuldeep@mmb.dev
- **Phone**: +91 9817034573
- **Hours**: 9 AM - 6 PM IST
- **Response Time**: Within 24 hours

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern portfolio websites
- **UI Components**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Hosting**: Compatible with major VPS providers

## 🚀 Deployment Status

- ✅ Development Complete
- ✅ Testing Complete  
- ✅ Production Ready
- ✅ Installation Scripts Ready
- ✅ Documentation Complete
- ✅ Support Available

---

**Made with ❤️ by [Kuldeep Parjapati](mailto:kuldeep@mmb.dev)**

*Professional portfolio website solution for developers, designers, and agencies*