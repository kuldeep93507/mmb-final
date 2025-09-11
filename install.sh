#!/bin/bash

# MMB Portfolio Website - Automated Installation Script
# Author: Kuldeep Parjapati
# Version: 1.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root. Use: sudo ./install.sh"
    fi
}

# Get system information
get_system_info() {
    log "Detecting system information..."
    
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        error "Cannot detect OS version"
    fi
    
    info "Operating System: $OS"
    info "Version: $VER"
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check RAM
    RAM=$(free -m | grep '^Mem:' | awk '{print $2}')
    if [[ $RAM -lt 512 ]]; then
        warning "Low RAM detected ($RAM MB). Minimum 1GB recommended."
    else
        info "RAM: ${RAM}MB ✓"
    fi
    
    # Check disk space
    DISK=$(df -h / | awk 'NR==2 {print $4}' | sed 's/G//')
    if [[ ${DISK%.*} -lt 5 ]]; then
        error "Insufficient disk space. Minimum 5GB required."
    else
        info "Disk Space: ${DISK}GB available ✓"
    fi
}

# Update system
update_system() {
    log "Updating system packages..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        apt update && apt upgrade -y
        apt install -y curl wget git software-properties-common
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        yum update -y
        yum install -y curl wget git
    else
        error "Unsupported operating system: $OS"
    fi
}

# Install Node.js
install_nodejs() {
    log "Installing Node.js 18..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        info "Node.js already installed: $NODE_VERSION"
    else
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
        
        # Verify installation
        if command -v node &> /dev/null; then
            NODE_VERSION=$(node --version)
            info "Node.js installed successfully: $NODE_VERSION"
        else
            error "Node.js installation failed"
        fi
    fi
    
    # Install PM2
    npm install -g pm2
    info "PM2 installed successfully"
}

# Install Python
install_python() {
    log "Installing Python and dependencies..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        apt install -y python3 python3-pip python3-venv python3-dev
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        yum install -y python3 python3-pip python3-devel
    fi
    
    # Verify installation
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        info "Python installed successfully: $PYTHON_VERSION"
    else
        error "Python installation failed"
    fi
}

# Install MongoDB
install_mongodb() {
    log "Installing MongoDB..."
    
    if command -v mongod &> /dev/null; then
        info "MongoDB already installed"
    else
        if [[ "$OS" == *"Ubuntu"* ]]; then
            wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
            apt-get update
            apt-get install -y mongodb-org
        elif [[ "$OS" == *"CentOS"* ]]; then
            cat > /etc/yum.repos.d/mongodb-org-7.0.repo << EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF
            yum install -y mongodb-org
        fi
        
        # Start and enable MongoDB
        systemctl start mongod
        systemctl enable mongod
        
        info "MongoDB installed and started successfully"
    fi
}

# Install Nginx
install_nginx() {
    log "Installing Nginx..."
    
    if command -v nginx &> /dev/null; then
        info "Nginx already installed"
    else
        if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
            apt install -y nginx
        elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
            yum install -y nginx
        fi
        
        # Start and enable Nginx
        systemctl start nginx
        systemctl enable nginx
        
        info "Nginx installed and started successfully"
    fi
}

# Install SSL Certificate tools
install_certbot() {
    log "Installing Certbot for SSL certificates..."
    
    if command -v certbot &> /dev/null; then
        info "Certbot already installed"
    else
        if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
            apt install -y certbot python3-certbot-nginx
        elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
            yum install -y certbot python3-certbot-nginx
        fi
        
        info "Certbot installed successfully"
    fi
}

# Setup project directory
setup_project() {
    log "Setting up project directory..."
    
    PROJECT_DIR="/var/www/mmb-portfolio"
    
    # Create project directory if it doesn't exist
    if [[ ! -d "$PROJECT_DIR" ]]; then
        mkdir -p "$PROJECT_DIR"
        info "Project directory created: $PROJECT_DIR"
    fi
    
    # Set proper permissions
    chown -R www-data:www-data "$PROJECT_DIR"
    chmod -R 755 "$PROJECT_DIR"
    
    info "Project directory setup completed"
}

# Setup backend
setup_backend() {
    log "Setting up backend..."
    
    cd /var/www/mmb-portfolio/backend
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    # Install Python dependencies
    if [[ -f "requirements.txt" ]]; then
        pip install --upgrade pip
        pip install -r requirements.txt
        info "Backend dependencies installed"
    else
        error "requirements.txt not found in backend directory"
    fi
    
    # Create uploads directory
    mkdir -p uploads
    chown -R www-data:www-data uploads
    chmod -R 755 uploads
    
    # Setup environment file
    if [[ ! -f ".env" ]]; then
        cat > .env << EOF
MONGO_URL=mongodb://localhost:27017/mmb_portfolio
DB_NAME=mmb_portfolio
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
JWT_SECRET=$(openssl rand -hex 32)
EOF
        info "Backend .env file created"
    fi
}

# Setup frontend
setup_frontend() {
    log "Setting up frontend..."
    
    cd /var/www/mmb-portfolio/frontend
    
    # Install Node.js dependencies
    if [[ -f "package.json" ]]; then
        npm install
        info "Frontend dependencies installed"
    else
        error "package.json not found in frontend directory"
    fi
    
    # Setup environment file
    if [[ ! -f ".env" ]]; then
        cat > .env << EOF
REACT_APP_BACKEND_URL=https://yourdomain.com
EOF
        info "Frontend .env file created"
    fi
    
    # Build frontend for production
    npm run build
    info "Frontend built successfully"
}

# Seed database
seed_database() {
    log "Seeding database with initial data..."
    
    cd /var/www/mmb-portfolio/backend
    source venv/bin/activate
    
    if [[ -f "seed_data.py" ]]; then
        python seed_data.py
        info "Database seeded successfully"
    else
        warning "seed_data.py not found. You'll need to create admin user manually."
    fi
}

# Setup PM2 ecosystem
setup_pm2() {
    log "Setting up PM2 for backend..."
    
    cd /var/www/mmb-portfolio
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'mmb-backend',
    script: 'uvicorn',
    args: 'server:app --host 0.0.0.0 --port 8001',
    cwd: '/var/www/mmb-portfolio/backend',
    interpreter: '/var/www/mmb-portfolio/backend/venv/bin/python',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/var/log/pm2/mmb-backend.err.log',
    out_file: '/var/log/pm2/mmb-backend.out.log',
    log_file: '/var/log/pm2/mmb-backend.log'
  }]
};
EOF
    
    # Create PM2 log directory
    mkdir -p /var/log/pm2
    chown -R www-data:www-data /var/log/pm2
    
    # Start application with PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    # Setup PM2 startup
    pm2 startup systemd -u www-data --hp /var/www
    
    info "PM2 setup completed"
}

# Configure Nginx
configure_nginx() {
    log "Configuring Nginx..."
    
    # Create Nginx configuration
    cat > /etc/nginx/sites-available/mmb-portfolio << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend
    location / {
        root /var/www/mmb-portfolio/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Uploaded media files
    location /uploads {
        alias /var/www/mmb-portfolio/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Security
    location ~ /\. {
        deny all;
    }
}
EOF
    
    # Enable site
    ln -sf /etc/nginx/sites-available/mmb-portfolio /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    nginx -t
    
    if [[ $? -eq 0 ]]; then
        systemctl reload nginx
        info "Nginx configured successfully"
    else
        error "Nginx configuration test failed"
    fi
}

# Setup firewall
setup_firewall() {
    log "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        ufw --force reset
        ufw default deny incoming
        ufw default allow outgoing
        ufw allow ssh
        ufw allow 'Nginx Full'
        ufw --force enable
        info "UFW firewall configured"
    else
        warning "UFW not available. Please configure firewall manually."
    fi
}

# Create admin user info file
create_admin_info() {
    log "Creating admin credentials file..."
    
    cat > /var/www/mmb-portfolio/ADMIN_CREDENTIALS.txt << EOF
=================================
MMB Portfolio Website - Admin Access
=================================

Website URL: https://yourdomain.com
Admin Panel: https://yourdomain.com/admin/login

Default Admin Credentials:
Email: kuldeep@mmb.dev
Password: MMB@2024!Secure

⚠️  IMPORTANT SECURITY NOTICE:
1. Change these credentials immediately after first login
2. Go to Admin Panel -> Profile Settings -> Change Password
3. Update your profile information
4. Delete this file after noting the credentials

Features Available:
- Dashboard with analytics
- Content management (Services, Projects, Blog, Testimonials)
- Media management (Logo, Images, Favicon)
- Contact inquiries management
- Profile settings
- Password management

Support Contact:
Email: kuldeep@mmb.dev
Phone: +91 9817034573

Generated on: $(date)
=================================
EOF
    
    chmod 600 /var/www/mmb-portfolio/ADMIN_CREDENTIALS.txt
    info "Admin credentials file created"
}

# Final setup and verification
final_setup() {
    log "Performing final setup and verification..."
    
    # Set proper permissions
    chown -R www-data:www-data /var/www/mmb-portfolio
    chmod -R 755 /var/www/mmb-portfolio
    
    # Verify services
    if systemctl is-active --quiet nginx; then
        info "✓ Nginx is running"
    else
        error "✗ Nginx is not running"
    fi
    
    if systemctl is-active --quiet mongod; then
        info "✓ MongoDB is running"
    else
        error "✗ MongoDB is not running"
    fi
    
    if pm2 list | grep -q "mmb-backend"; then
        info "✓ Backend is running"
    else
        error "✗ Backend is not running"
    fi
}

# Display completion message
display_completion() {
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}🎉 MMB Portfolio Website Installation Complete!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo -e "${YELLOW}1. Update domain name in Nginx configuration:${NC}"
    echo "   sudo nano /etc/nginx/sites-available/mmb-portfolio"
    echo ""
    echo -e "${YELLOW}2. Update environment variables:${NC}"
    echo "   Backend: nano /var/www/mmb-portfolio/backend/.env"
    echo "   Frontend: nano /var/www/mmb-portfolio/frontend/.env"
    echo ""
    echo -e "${YELLOW}3. Get SSL certificate:${NC}"
    echo "   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
    echo ""
    echo -e "${YELLOW}4. Access admin panel:${NC}"
    echo "   URL: https://yourdomain.com/admin/login"
    echo "   Credentials: See /var/www/mmb-portfolio/ADMIN_CREDENTIALS.txt"
    echo ""
    echo -e "${YELLOW}5. Change admin password immediately!${NC}"
    echo ""
    echo -e "${GREEN}Support: kuldeep@mmb.dev | +91 9817034573${NC}"
    echo -e "${GREEN}================================================${NC}"
}

# Main installation function
main() {
    echo -e "${BLUE}"
    cat << "EOF"
    ███╗   ███╗███╗   ███╗██████╗ 
    ████╗ ████║████╗ ████║██╔══██╗
    ██╔████╔██║██╔████╔██║██████╔╝
    ██║╚██╔╝██║██║╚██╔╝██║██╔══██╗
    ██║ ╚═╝ ██║██║ ╚═╝ ██║██████╔╝
    ╚═╝     ╚═╝╚═╝     ╚═╝╚═════╝ 
    
    Portfolio Website Installer v1.0
    Author: Kuldeep Parjapati
EOF
    echo -e "${NC}"
    echo ""
    
    log "Starting MMB Portfolio Website installation..."
    
    # Run installation steps
    check_root
    get_system_info
    check_requirements
    update_system
    install_nodejs
    install_python
    install_mongodb
    install_nginx
    install_certbot
    setup_project
    
    # Check if project files exist
    if [[ ! -d "/var/www/mmb-portfolio/backend" ]] || [[ ! -d "/var/www/mmb-portfolio/frontend" ]]; then
        error "Project files not found. Please upload your project files to /var/www/mmb-portfolio first."
    fi
    
    setup_backend
    setup_frontend
    seed_database
    setup_pm2
    configure_nginx
    setup_firewall
    create_admin_info
    final_setup
    display_completion
}

# Handle script interruption
trap 'error "Installation interrupted"' INT TERM

# Run main function
main "$@"