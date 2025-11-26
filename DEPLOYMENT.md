# 🚀 Deployment Guide

This guide provides comprehensive instructions for deploying the E-Bike Platform to various environments.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: 20.x or higher (optional)
- **Git**: 2.x or higher

### Required Services
- **Supabase**: Database and authentication
- **Anthropic API**: AI functionality
- **CDN**: Static asset delivery (optional)

## 🏗️ Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/ebike-platform.git
cd ebike-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Anthropic API
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key

# Application Configuration
VITE_APP_NAME=E-Bike Platform
VITE_APP_URL=https://ebike-platform.com
VITE_APP_ENV=production

# Analytics
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_GOOGLE_TAG_MANAGER_ID=your-gtm-id

# Security
VITE_CSRF_SECRET=your-csrf-secret
VITE_JWT_SECRET=your-jwt-secret

# Email Configuration
VITE_SMTP_HOST=smtp.your-provider.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-smtp-user
VITE_SMTP_PASS=your-smtp-password

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Rate Limiting
VITE_RATE_LIMIT_WINDOW=900000
VITE_MAX_REQUESTS=1000
```

## 🐳 Docker Deployment

### 1. Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - supabase

  supabase:
    image: supabase/postgres:15
    environment:
      POSTGRES_DB: ebike_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Build and Deploy
```bash
# Build Docker image
docker build -t ebike-platform .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f app
```

## ☁️ Cloud Deployment

### Vercel Deployment

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Configure Vercel
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

#### 3. Deploy
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify Deployment

#### 1. Configure Netlify
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_APP_ENV = "production"
```

#### 2. Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set VITE_SUPABASE_URL your-supabase-url
netlify env:set VITE_SUPABASE_ANON_KEY your-supabase-anon-key
```

### AWS Deployment

#### 1. S3 + CloudFront
```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://ebike-platform-prod

# Upload files
aws s3 sync dist/ s3://ebike-platform-prod --delete

# Set bucket policy
aws s3api put-bucket-policy --bucket ebike-platform-prod --policy file://bucket-policy.json
```

#### 2. Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

## 🗄️ Database Setup

### 1. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Generate types
supabase gen types typescript --local > src/types/supabase.ts
```

### 2. Database Migrations
```bash
# Create migration
supabase migration new add_new_table

# Apply migrations
supabase db push

# Reset database
supabase db reset
```

### 3. Seed Data
```bash
# Run seed script
npm run db:seed

# Or manually insert data
psql -h your-db-host -U postgres -d ebike_platform -f scripts/seed-data.sql
```

## 🔧 Production Configuration

### 1. Nginx Configuration
```nginx
server {
    listen 80;
    server_name ebike-platform.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. SSL Configuration
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d ebike-platform.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Performance Optimization
```bash
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 📊 Monitoring & Logging

### 1. Application Monitoring
```typescript
// Add to main.ts
import { init } from '@sentry/vue'

init({
  app,
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV
})
```

### 2. Performance Monitoring
```typescript
// Add to main.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### 3. Error Tracking
```typescript
// Add error boundary
import { ErrorBoundary } from '@/components/ErrorBoundary.vue'

app.component('ErrorBoundary', ErrorBoundary)
```

## 🔒 Security Configuration

### 1. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://api.anthropic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

### 2. Security Headers
```nginx
# Add to nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 3. Rate Limiting
```typescript
// Configure rate limiting
const rateLimits = {
  api: { windowMs: 15 * 60 * 1000, max: 1000 },
  auth: { windowMs: 15 * 60 * 1000, max: 5 },
  search: { windowMs: 60 * 1000, max: 30 }
}
```

## 📈 Performance Optimization

### 1. Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### 2. Image Optimization
```typescript
// Add to components
import { LazyImage } from '@/components/LazyImage.vue'

// Use lazy loading
<LazyImage :src="imageUrl" :alt="altText" />
```

### 3. Code Splitting
```typescript
// Lazy load routes
const routes = [
  {
    path: '/ebikes',
    component: () => import('@/views/EBikeListPage.vue')
  }
]
```

## 🧪 Testing in Production

### 1. Health Checks
```typescript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})
```

### 2. Smoke Tests
```bash
# Run smoke tests
npm run test:smoke

# Check critical paths
curl -f https://ebike-platform.com/health || exit 1
curl -f https://ebike-platform.com/api/ebikes || exit 1
```

### 3. Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run load-test.yml
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      - run: npm run test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 2. Environment Promotion
```bash
# Deploy to staging
npm run deploy:staging

# Run tests
npm run test:e2e:staging

# Deploy to production
npm run deploy:production
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Security headers configured
- [ ] Performance optimizations applied

### Post-deployment
- [ ] Health checks passing
- [ ] Smoke tests successful
- [ ] Monitoring configured
- [ ] Error tracking active
- [ ] Performance metrics collected
- [ ] User acceptance testing completed

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version
npm --version
```

#### 2. Database Connection Issues
```bash
# Check Supabase status
supabase status

# Test connection
psql -h your-db-host -U postgres -d ebike_platform -c "SELECT 1;"
```

#### 3. Environment Variable Issues
```bash
# Check environment variables
printenv | grep VITE_

# Verify in browser
console.log(import.meta.env)
```

#### 4. Performance Issues
```bash
# Check bundle size
npm run build
ls -la dist/

# Analyze bundle
npm run analyze
```

## 📞 Support

### Deployment Support
- **Email**: devops@ebike-platform.com
- **Slack**: #deployment-support
- **Documentation**: https://docs.ebike-platform.com

### Emergency Contacts
- **On-call Engineer**: +31-20-123-4567
- **Database Admin**: +31-20-123-4568
- **Security Team**: +31-20-123-4569
