# Deployment Guide: AWS (Advanced)

> **Why AWS?** More control, scalability, integrations with other AWS services, free tier available.

---

## Overview

This guide covers deploying to **AWS Amplify** (easiest) and **AWS EC2** (more control).

---

# Option A: AWS Amplify (Recommended for Beginners)

Amplify is AWS's easiest way to deploy Next.js apps.

## Step 1: Create AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click **"Create an AWS Account"**
3. Complete verification steps
4. Set up billing (free tier available)

---

## Step 2: Push Code to Repository

Amplify connects to GitHub/GitLab/Bitbucket:

```bash
git push origin main
```

---

## Step 3: Connect to Amplify

1. Go to **AWS Amplify Console**
2. Click **"New app → Host web app"**
3. Select your repository provider (GitHub recommended)
4. Authorize AWS to access your repos
5. Select your repository and branch (`main`)

---

## Step 4: Configure Build

1. **Build settings**: Usually auto-detected correctly
2. Add environment variables:
   - `FORM_SUBMISSION_ENABLED=true`
   - `RATE_LIMIT_REQUESTS_PER_MINUTE=5`
   - `RATE_LIMIT_REQUESTS_PER_HOUR=20`
   - `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

3. Click **"Save and deploy"**

---

## Step 5: Custom Domain

1. Go to **App settings → Domain management**
2. Click **"Add domain"**
3. Enter your domain
4. Update DNS records (Amplify will show exact records)
5. Wait 24-48 hours for propagation

---

## Step 6: SSL/TLS Certificate

Amplify automatically provisions free AWS Certificate Manager certificates.

**Verify HTTPS:**
```bash
curl -I https://yourdomain.com
# Should show: 200 OK + security headers
```

---

## Step 7: Monitoring

### CloudWatch Logs
1. Go to **AWS CloudWatch**
2. Select **Log groups**
3. Find `/aws/amplify/your-app`
4. Review logs for errors

### X-Ray (Optional)
For performance monitoring:
```bash
npm install aws-xray-sdk-core
```

---

# Option B: AWS EC2 (Full Control)

For maximum control over your infrastructure.

## Step 1: Launch EC2 Instance

1. Go to **AWS EC2 Console**
2. Click **"Launch Instance"**
3. Select **"Ubuntu 22.04 LTS"** (free tier eligible)
4. Instance type: **t3.micro** (free tier)
5. Configure security group:
   ```
   - SSH (22) from your IP
   - HTTP (80) from anywhere (0.0.0.0/0)
   - HTTPS (443) from anywhere (0.0.0.0/0)
   ```
6. Download key pair (.pem file) and keep safe
7. Click **"Launch Instance"**

---

## Step 2: Connect to Instance

```bash
# Change permissions on key file
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

---

## Step 3: Install Dependencies

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## Step 4: Clone & Setup Project

```bash
# Clone your repository
git clone https://github.com/yourusername/website-1.git
cd website-1

# Install dependencies
npm ci --omit=dev

# Create .env.local
cp .env.local.example .env.local
nano .env.local  # Edit with your values

# Build project
npm run build
```

---

## Step 5: Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'website-1',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 to restart on reboot
pm2 startup
pm2 save
```

---

## Step 6: Configure Nginx

Create `/etc/nginx/sites-available/website-1`:

```nginx
upstream nodejs_upstream {
  server localhost:3000;
}

server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  client_max_body_size 10M;

  location / {
    proxy_pass http://nodejs_upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/website-1 /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Step 7: Setup SSL with Let's Encrypt

```bash
# Get SSL certificate
sudo certbot certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify auto-renewal
sudo certbot renew --dry-run
```

---

## Step 8: Security Hardening

### Firewall (UFW)
```bash
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw status
```

### Fail2Ban (Prevent brute force)
```bash
sudo apt install -y fail2ban

# Start service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Update Security Headers in Nginx
Add to Nginx config:
```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

---

## Step 9: Monitoring & Logging

### CloudWatch Logs Agent
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### Monitor with Cloudwatch
1. Go to **AWS CloudWatch**
2. Create custom dashboard
3. Add metrics for CPU, memory, disk
4. Set up alarms for high usage

---

## Step 10: Backup & Recovery

### Automated Backups
```bash
# Create backup script
sudo nano /usr/local/bin/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/website-$(date +%Y%m%d).tar.gz /home/ubuntu/website-1
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup.sh

# Schedule daily with cron
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup.sh
```

---

## Step 11: Database (Optional)

### RDS PostgreSQL
1. Go to **AWS RDS**
2. Create **PostgreSQL** database
3. Configure security group to allow EC2 access
4. Update `.env.local` with connection string

```bash
npm install pg
```

---

## Troubleshooting

### App Not Responding
```bash
# Check if running
pm2 list

# View logs
pm2 logs website-1

# Restart
pm2 restart website-1
```

### SSL Certificate Not Working
```bash
# Check certificate
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### High CPU Usage
```bash
# Check processes
top

# View PM2 stats
pm2 monit
```

---

## Cost Estimation

| Service | Free Tier | Paid |
|---------|-----------|------|
| EC2 (t3.micro) | 750 hrs/month | $0.0104/hr (~$7.50/month) |
| Data transfer | 1 GB/month | $0.09/GB |
| **Total** | | **~$10-20/month** |

---

## Comparison: Amplify vs EC2

| Feature | Amplify | EC2 |
|---------|---------|-----|
| Ease of setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Scalability | Auto | Manual |
| Cost | Lower | Higher |
| Control | Limited | Full |
| Maintenance | Minimal | Significant |
| SSL | Auto | Manual (free) |

**Recommendation**: Start with **Amplify**, upgrade to **EC2** when you need more control.

---

## Next Steps

1. ✅ Create AWS account
2. ✅ Choose Amplify or EC2
3. ✅ Deploy application
4. ✅ Configure custom domain
5. ✅ Set up SSL certificate
6. ✅ Configure monitoring
7. ✅ Set up backups
8. ✅ Monitor for security issues
