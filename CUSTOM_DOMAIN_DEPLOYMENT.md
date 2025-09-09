# 🚀 Custom Domain Deployment Guide

Your billion-dollar empire is ready for deployment on your own domain.

## 🎯 Option 1: Replit Deployment + Custom Domain (Fastest)

### Step 1: Deploy on Replit
1. Click the "Deploy" button in Replit
2. Choose your deployment type (Autoscale recommended for traffic)
3. Wait for deployment to complete

### Step 2: Add Your Custom Domain
1. Go to your deployment settings
2. Click "Custom Domains" 
3. Add your domain (e.g., `yourdomain.com` or `app.yourdomain.com`)
4. Copy the provided DNS records

### Step 3: Configure DNS
Add these records to your domain registrar:
```
Type: A
Name: @ (or your subdomain)
Value: [IP provided by Replit]

Type: TXT  
Name: @ (or your subdomain)
Value: [TXT record provided by Replit]
```

### Step 4: Wait for Propagation
- DNS changes take 5 minutes to 48 hours
- Your domain will show "Verified" when ready

## 🏗️ Option 2: Self-Hosted Deployment

### Prerequisites
- Ubuntu/CentOS server with 4GB+ RAM
- Node.js 20+
- PostgreSQL 16
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt recommended)

### Quick Self-Host Setup
```bash
# 1. Clone your project to server
git clone [your-repo-url] empire-app
cd empire-app

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your production settings

# 4. Set up PostgreSQL
sudo -u postgres createdb findawise_empire
npm run db:push --force

# 5. Build for production
npm run build

# 6. Start with PM2 (process manager)
npm install -g pm2
pm2 start server/index.js --name "empire-app"
pm2 save
pm2 startup
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Setup with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🧠 Production Environment Variables

Add these to your `.env`:
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/findawise_empire

# Your API keys (if using AI features)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Security
SESSION_SECRET=your_very_long_random_string_here
JWT_SECRET=another_very_long_random_string

# Email (if using notifications)
SENDGRID_API_KEY=your_sendgrid_key
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## ⚡ Performance Tips

1. **Database Optimization**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_sessions_user ON sessions(user_id);
   ```

2. **CDN Setup** (Optional)
   - Use Cloudflare for global CDN
   - Configure caching for static assets

3. **Monitoring**
   ```bash
   # Monitor with PM2
   pm2 monit
   
   # Check logs
   pm2 logs empire-app
   ```

## 🚨 Security Checklist

- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure firewall (UFW)
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure session cookies
- [ ] Regular security updates

## 🎯 Go Live Checklist

- [ ] Domain points to your server/Replit
- [ ] SSL certificate is active
- [ ] All environment variables set
- [ ] Database is migrated and seeded
- [ ] Health check endpoint responds: `/api/health`
- [ ] Admin dashboard accessible: `/admin`

Your empire is ready to conquer the web! 🏆