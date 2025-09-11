# 🚀 MMB Portfolio - Quick Start Guide

## 30-Second Setup

### Option 1: Automated Installation (Recommended)

```bash
# 1. Upload project files to your server
scp -r mmb-portfolio root@your-server-ip:/var/www/

# 2. SSH into your server  
ssh root@your-server-ip

# 3. Run installation script
cd /var/www/mmb-portfolio
chmod +x install.sh
sudo ./install.sh

# 4. Update domain name
sudo nano /etc/nginx/sites-available/mmb-portfolio
# Replace 'yourdomain.com' with your domain

# 5. Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 6. Done! Visit https://yourdomain.com
```

### Option 2: One-Line Installation

```bash
curl -fsSL https://raw.githubusercontent.com/kuldeepparjapati/mmb-portfolio/main/install.sh | sudo bash
```

## Default Admin Access

**URL**: `https://yourdomain.com/admin/login`

**Credentials**:
- Email: `kuldeep@mmb.dev`
- Password: `MMB@2024!Secure`

⚠️ **Change these immediately after first login!**

## What You Get

### User Website
- ✅ Modern responsive portfolio
- ✅ Dynamic contact information  
- ✅ Project showcase
- ✅ Blog system
- ✅ Testimonials
- ✅ Contact form with WhatsApp
- ✅ Privacy Policy & Terms

### Admin Panel
- ✅ Content management
- ✅ Media management (logo, images)
- ✅ Contact inquiries
- ✅ Analytics dashboard
- ✅ Profile settings
- ✅ Password management

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: MongoDB
- **Server**: Nginx + PM2
- **SSL**: Let's Encrypt

## System Requirements

- **VPS**: 1GB RAM, 10GB storage
- **OS**: Ubuntu 20.04+ or CentOS 7+
- **Domain**: Optional but recommended

## Support

- **Email**: kuldeep@mmb.dev
- **Phone**: +91 9817034573
- **Hours**: 9 AM - 6 PM IST

## Next Steps

1. **Customize Content**: Update your profile, services, projects
2. **Upload Media**: Add your logo, images in Media Manager  
3. **Test Everything**: Contact form, admin panel, all pages
4. **Go Live**: Share your portfolio with the world!

**🎉 Your professional portfolio is ready in minutes!**