# 🚀 MMB Portfolio Website - Complete Installation Guide

## 📋 System Requirements

- **VPS/Server**: Ubuntu 20.04+ or CentOS 7+
- **RAM**: Minimum 1GB (Recommended 2GB+)
- **Storage**: Minimum 10GB free space
- **Domain**: Optional but recommended

## 🎯 Quick Installation (Recommended)

### Option 1: Automated Installation Script

```bash
# Download and run installation script
curl -fsSL https://raw.githubusercontent.com/yourusername/mmb-portfolio/main/install.sh | bash
```

### Option 2: Manual Installation

1. **Upload Project Files**
```bash
# Upload your project files to server
scp -r /path/to/mmb-portfolio root@your-server-ip:/var/www/
```

2. **Run Installation Script**
```bash
cd /var/www/mmb-portfolio
chmod +x install.sh
sudo ./install.sh
```

## 🔧 Manual Step-by-Step Installation

### Step 1: System Update & Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git nginx mongodb certbot python3-certbot-nginx
```

### Step 2: Install Node.js

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Install Python & Dependencies

```bash
# Install Python
sudo apt install -y python3 python3-pip python3-venv

# Install PM2 globally
sudo npm install -g pm2
```

### Step 4: Setup Project

```bash
# Navigate to project directory
cd /var/www/mmb-portfolio

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup Frontend
cd frontend
npm install
npm run build
cd ..
```

### Step 5: Configure Environment Variables

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend environment
nano backend/.env
```

**Backend .env configuration:**
```env
MONGO_URL=mongodb://localhost:27017/mmb_portfolio
DB_NAME=mmb_portfolio
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**Frontend .env configuration:**
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

### Step 6: Setup Database

```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Seed database with initial data
cd backend
source venv/bin/activate
python seed_data.py
cd ..
```

### Step 7: Setup PM2 for Backend

```bash
# Create PM2 ecosystem file
cp ecosystem.config.example.js ecosystem.config.js

# Edit with your settings
nano ecosystem.config.js

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 8: Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/mmb-portfolio

# Edit configuration with your domain
sudo nano /etc/nginx/sites-available/mmb-portfolio

# Enable site
sudo ln -s /etc/nginx/sites-available/mmb-portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 10: Configure Firewall

```bash
# Setup UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 🎛️ Admin Panel Access

After installation, access your admin panel:

**URL**: `https://yourdomain.com/admin/login`

**Default Credentials:**
- **Email**: `kuldeep@mmb.dev`
- **Password**: `MMB@2024!Secure`

**⚠️ IMPORTANT**: Change these credentials immediately after first login!

## 🔐 Security Setup

1. **Change Admin Credentials**
   - Login to admin panel
   - Go to Profile Settings
   - Change password using "Change Password" section

2. **Update Contact Information**
   - Update your name, email, phone in Profile Settings
   - This will automatically update across all pages

3. **Configure Media**
   - Upload your logo, favicon, images in Media Manager
   - All images will be automatically optimized

## 📱 Features Available

### User Panel
- Modern responsive design
- Dynamic contact information
- Project showcase
- Blog system
- Testimonials
- Contact form with WhatsApp integration

### Admin Panel
- Dashboard with analytics
- Content management (Services, Projects, Blog, Testimonials)
- Media management (Logo, Images)
- Contact inquiries management
- Profile settings
- Password management

## 🔄 Maintenance Commands

### Update Application
```bash
cd /var/www/mmb-portfolio
git pull origin main
cd frontend && npm run build
pm2 restart all
```

### Database Backup
```bash
mongodump --db mmb_portfolio --out /backup/$(date +%Y%m%d)
```

### View Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Restart Services
```bash
# Restart all services
sudo systemctl restart nginx
sudo systemctl restart mongod
pm2 restart all
```

## 🆘 Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend is running: `pm2 status`
   - Check backend logs: `pm2 logs`
   - Restart backend: `pm2 restart all`

2. **Database Connection Error**
   - Check MongoDB status: `sudo systemctl status mongod`
   - Restart MongoDB: `sudo systemctl restart mongod`

3. **SSL Certificate Issues**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

4. **Permission Issues**
   - Fix file permissions: `sudo chown -R www-data:www-data /var/www/mmb-portfolio`

### Contact Support

If you face any issues during installation:
- Email: kuldeep@mmb.dev
- Phone: +91 9817034573

## 🎉 Success!

Your MMB Portfolio website is now live! 

- **Website**: https://yourdomain.com
- **Admin Panel**: https://yourdomain.com/admin/login

Remember to:
1. Change admin credentials
2. Update profile information
3. Upload your media files
4. Test all functionality

## 📊 Performance Optimization

### Optional Optimizations

1. **Enable Gzip Compression**
2. **Setup CDN (Cloudflare)**
3. **Database Indexing**
4. **Image Optimization**
5. **Caching Configuration**

For advanced optimization, contact: kuldeep@mmb.dev