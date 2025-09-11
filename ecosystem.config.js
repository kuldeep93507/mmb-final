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