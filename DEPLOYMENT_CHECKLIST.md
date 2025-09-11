# 🚀 MMB Portfolio - Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Domain name purchased and configured
- [ ] VPS/Server provisioned (min 1GB RAM, 10GB storage)
- [ ] SSH access to server configured
- [ ] Firewall rules planned

### 2. DNS Configuration
- [ ] A record: `@` → `your-server-ip`
- [ ] A record: `www` → `your-server-ip`
- [ ] TTL set to 3600 seconds
- [ ] DNS propagation completed (check with `nslookup yourdomain.com`)

### 3. File Preparation
- [ ] All project files uploaded to server
- [ ] File permissions set correctly
- [ ] Environment variables configured
- [ ] Admin credentials noted securely

## Deployment Steps

### Step 1: Server Login
```bash
ssh root@your-server-ip
```

### Step 2: Upload Project Files
```bash
# Option A: Using SCP
scp -r /local/path/mmb-portfolio root@your-server-ip:/var/www/

# Option B: Using Git
cd /var/www
git clone https://github.com/yourusername/mmb-portfolio.git

# Option C: Using rsync
rsync -avz /local/path/mmb-portfolio/ root@your-server-ip:/var/www/mmb-portfolio/
```

### Step 3: Run Installation Script
```bash
cd /var/www/mmb-portfolio
chmod +x install.sh
sudo ./install.sh
```

### Step 4: Configure Domain
```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/mmb-portfolio

# Replace 'yourdomain.com' with your actual domain
# Update CORS origins in backend/.env
```

### Step 5: Update Environment Variables
```bash
# Backend configuration
nano /var/www/mmb-portfolio/backend/.env
```

Update with your domain:
```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

```bash
# Frontend configuration  
nano /var/www/mmb-portfolio/frontend/.env
```

Update with your domain:
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

### Step 6: Rebuild Frontend
```bash
cd /var/www/mmb-portfolio/frontend
npm run build
```

### Step 7: Restart Services
```bash
sudo systemctl reload nginx
pm2 restart all
```

### Step 8: Get SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Post-Deployment Verification

### 1. Service Status Check
```bash
# Check Nginx
sudo systemctl status nginx

# Check MongoDB
sudo systemctl status mongod

# Check Backend
pm2 status

# Check processes
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :8001
```

### 2. Website Testing
- [ ] Visit `http://yourdomain.com` - should redirect to HTTPS
- [ ] Visit `https://yourdomain.com` - should load homepage
- [ ] Test all pages: About, Services, Portfolio, Testimonials, Blog, Contact
- [ ] Test contact form submission
- [ ] Test WhatsApp button functionality

### 3. Admin Panel Testing
- [ ] Visit `https://yourdomain.com/admin/login`
- [ ] Login with default credentials
- [ ] Change admin password immediately
- [ ] Update profile information
- [ ] Test all admin functions:
  - [ ] Dashboard loads correctly
  - [ ] Services management
  - [ ] Projects management
  - [ ] Testimonials management
  - [ ] Blog management
  - [ ] Media management
  - [ ] Contact inquiries
  - [ ] Profile settings

### 4. Performance Testing
```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s "https://yourdomain.com"

# Test API endpoints
curl https://yourdomain.com/api/profile
curl https://yourdomain.com/api/services
curl https://yourdomain.com/api/projects
```

### 5. Security Check
- [ ] HTTPS working correctly
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] Admin panel accessible only with authentication
- [ ] Firewall rules active
- [ ] Unnecessary ports closed

## Backup Setup

### 1. Database Backup Script
```bash
# Create backup directory
mkdir -p /backup/mongodb

# Create backup script
cat > /backup/mongodb-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mongodb"
mongodump --db mmb_portfolio --out $BACKUP_DIR/$DATE
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
EOF

chmod +x /backup/mongodb-backup.sh
```

### 2. Setup Cron Job for Daily Backups
```bash
# Edit crontab
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /backup/mongodb-backup.sh
```

### 3. File Backup
```bash
# Create file backup script
cat > /backup/file-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/mmb-portfolio-$DATE.tar.gz /var/www/mmb-portfolio
find /backup -name "mmb-portfolio-*.tar.gz" -mtime +7 -delete
EOF

chmod +x /backup/file-backup.sh
```

## Monitoring Setup

### 1. Log Monitoring
```bash
# View real-time logs
pm2 logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. System Monitoring
```bash
# Check system resources
htop
df -h
free -h
```

### 3. Uptime Monitoring
Consider setting up:
- UptimeRobot
- Pingdom  
- StatusCake

## Maintenance Tasks

### Daily
- [ ] Check service status
- [ ] Monitor disk space
- [ ] Review error logs

### Weekly  
- [ ] Check backup integrity
- [ ] Update system packages
- [ ] Review security alerts

### Monthly
- [ ] Update SSL certificates (auto-renewal check)
- [ ] Performance analysis
- [ ] Security audit

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ```

2. **SSL Certificate Issues**
   ```bash
   sudo certbot renew --dry-run
   sudo certbot renew
   ```

3. **Database Connection Issues**
   ```bash
   sudo systemctl restart mongod
   ```

4. **High Memory Usage**
   ```bash
   pm2 restart all
   pm2 monit
   ```

### Emergency Contacts
- **Developer**: kuldeep@mmb.dev
- **Phone**: +91 9817034573
- **Support**: Available 9 AM - 6 PM IST

## Success Criteria

Deployment is successful when:
- [x] Website loads at your domain with HTTPS
- [x] All pages function correctly
- [x] Admin panel is accessible and functional
- [x] Contact form works and sends emails
- [x] SSL certificate is valid
- [x] All services are running stable
- [x] Backups are configured
- [x] Monitoring is in place

## Final Notes

- Save all credentials securely
- Document any customizations made
- Set up regular maintenance schedule
- Consider CDN setup for better performance
- Plan for scaling if needed

**🎉 Congratulations! Your MMB Portfolio website is now live!**