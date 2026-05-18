# Deployment Guide

This guide covers deploying the FitAI application to various cloud platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
  - [Vercel (Frontend)](#vercel-frontend)
  - [Render (Backend)](#render-backend)
  - [Railway (Full Stack)](#railway-full-stack)
  - [AWS](#aws)
  - [Azure](#azure)
- [Database Hosting](#database-hosting)
- [CI/CD Setup](#cicd-setup)
- [Monitoring](#monitoring)

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Cloud platform account
- Domain name (optional)
- SSL certificate (usually provided by platform)

## Environment Configuration

### Production Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-ai
JWT_SECRET=your_super_secure_secret_key_min_32_chars
JWT_EXPIRE=7d
ML_SERVICE_URL=https://your-ml-service.com
OPENAI_API_KEY=your_openai_key (optional)
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Docker Deployment

### Build Production Images

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Push to registry
docker tag fitai-frontend your-registry/fitai-frontend:latest
docker push your-registry/fitai-frontend:latest
```

### Deploy to Docker Host

```bash
# Pull images
docker-compose -f docker-compose.prod.yml pull

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

## Cloud Platforms

### Vercel (Frontend)

Vercel is ideal for deploying the React frontend.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd client
vercel --prod
```

#### Step 4: Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add: `VITE_API_URL=https://your-backend-url.com/api`

#### Step 5: Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Render (Backend)

Render is great for deploying Node.js backends.

#### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

#### Step 2: Configure Service

```yaml
Name: fitai-backend
Environment: Node
Build Command: cd server && npm install
Start Command: cd server && node server.js
```

#### Step 3: Add Environment Variables

Add all backend environment variables in the Render dashboard.

#### Step 4: Deploy

Render automatically deploys on git push.

### Railway (Full Stack)

Railway can host the entire stack.

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login

```bash
railway login
```

#### Step 3: Initialize Project

```bash
railway init
```

#### Step 4: Add Services

```bash
# Add MongoDB
railway add mongodb

# Deploy backend
cd server
railway up

# Deploy frontend
cd ../client
railway up

# Deploy ML service
cd ../ml-service
railway up
```

#### Step 5: Configure Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=${{MONGODB.DATABASE_URL}}
```

### AWS

#### Using AWS Elastic Beanstalk

**Step 1: Install EB CLI**

```bash
pip install awsebcli
```

**Step 2: Initialize**

```bash
eb init -p node.js-18 fitai-backend
```

**Step 3: Create Environment**

```bash
eb create fitai-production
```

**Step 4: Deploy**

```bash
eb deploy
```

#### Using AWS ECS (Docker)

**Step 1: Create ECR Repository**

```bash
aws ecr create-repository --repository-name fitai-backend
```

**Step 2: Build and Push Image**

```bash
docker build -t fitai-backend .
docker tag fitai-backend:latest <account-id>.dkr.ecr.region.amazonaws.com/fitai-backend:latest
docker push <account-id>.dkr.ecr.region.amazonaws.com/fitai-backend:latest
```

**Step 3: Create ECS Task Definition**

Create `task-definition.json`:

```json
{
  "family": "fitai-backend",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.region.amazonaws.com/fitai-backend:latest",
      "memory": 512,
      "cpu": 256,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

**Step 4: Create Service**

```bash
aws ecs create-service \
  --cluster fitai-cluster \
  --service-name fitai-backend \
  --task-definition fitai-backend \
  --desired-count 2
```

### Azure

#### Using Azure App Service

**Step 1: Install Azure CLI**

```bash
# macOS
brew install azure-cli

# Windows
# Download from https://aka.ms/installazurecliwindows
```

**Step 2: Login**

```bash
az login
```

**Step 3: Create Resource Group**

```bash
az group create --name fitai-rg --location eastus
```

**Step 4: Create App Service Plan**

```bash
az appservice plan create \
  --name fitai-plan \
  --resource-group fitai-rg \
  --sku B1 \
  --is-linux
```

**Step 5: Create Web App**

```bash
az webapp create \
  --resource-group fitai-rg \
  --plan fitai-plan \
  --name fitai-backend \
  --runtime "NODE|18-lts"
```

**Step 6: Configure Deployment**

```bash
az webapp deployment source config \
  --name fitai-backend \
  --resource-group fitai-rg \
  --repo-url https://github.com/your-repo \
  --branch main \
  --manual-integration
```

**Step 7: Set Environment Variables**

```bash
az webapp config appsettings set \
  --resource-group fitai-rg \
  --name fitai-backend \
  --settings NODE_ENV=production MONGODB_URI=your_uri
```

## Database Hosting

### MongoDB Atlas (Recommended)

#### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Choose your cloud provider and region

#### Step 2: Configure Network Access

1. Go to Network Access
2. Add IP Address (0.0.0.0/0 for all, or specific IPs)

#### Step 3: Create Database User

1. Go to Database Access
2. Add New Database User
3. Save credentials

#### Step 4: Get Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/fitness-ai?retryWrites=true&w=majority
```

### Alternative: DigitalOcean Managed MongoDB

```bash
# Create database cluster
doctl databases create fitai-db --engine mongodb --region nyc1

# Get connection string
doctl databases connection fitai-db
```

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd server && npm install
      
      - name: Run tests
        run: cd server && npm test
      
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: |
          curl -X POST https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys \
            -H "Authorization: Bearer $RENDER_API_KEY"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd client && npm install
      
      - name: Build
        run: cd client && npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - cd server && npm install && npm test

build:
  stage: build
  script:
    - docker build -t fitai-backend ./server
    - docker push registry.gitlab.com/your-project/fitai-backend

deploy:
  stage: deploy
  script:
    - kubectl apply -f k8s/deployment.yml
  only:
    - main
```

## Monitoring

### Application Monitoring

#### Using PM2 (Node.js)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server/server.js --name fitai-backend

# Monitor
pm2 monit

# View logs
pm2 logs fitai-backend

# Setup startup script
pm2 startup
pm2 save
```

#### Using New Relic

```bash
# Install New Relic
npm install newrelic

# Add to server.js
require('newrelic');
```

### Log Management

#### Using Papertrail

```bash
# Install winston-papertrail
npm install winston-papertrail

# Configure in server
const winston = require('winston');
require('winston-papertrail').Papertrail;

const logger = winston.createLogger({
  transports: [
    new winston.transports.Papertrail({
      host: 'logs.papertrailapp.com',
      port: 12345
    })
  ]
});
```

### Uptime Monitoring

Use services like:
- **UptimeRobot** - Free tier available
- **Pingdom** - Comprehensive monitoring
- **StatusCake** - Multiple check locations

## SSL/HTTPS

Most platforms provide free SSL certificates:

- **Vercel:** Automatic SSL
- **Render:** Automatic SSL
- **Railway:** Automatic SSL
- **AWS:** Use AWS Certificate Manager
- **Azure:** Use Azure App Service Certificates

## Performance Optimization

### Frontend

```bash
# Build with optimizations
npm run build

# Analyze bundle
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/stats.json
```

### Backend

- Enable gzip compression
- Use Redis for caching
- Implement rate limiting
- Optimize database queries
- Use CDN for static assets

### Database

- Create indexes
- Use connection pooling
- Enable query caching
- Regular backups

## Backup Strategy

### Database Backups

```bash
# MongoDB Atlas: Automatic backups enabled by default

# Manual backup
mongodump --uri="mongodb+srv://..." --out=/backup

# Restore
mongorestore --uri="mongodb+srv://..." /backup
```

### Application Backups

- Use git for code versioning
- Store environment variables securely (e.g., AWS Secrets Manager)
- Regular database snapshots
- Backup uploaded files to S3 or similar

## Rollback Strategy

```bash
# Vercel
vercel rollback

# Render
# Use dashboard to rollback to previous deployment

# Docker
docker-compose down
docker-compose up -d --force-recreate
```

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure environment variables
- [ ] Enable CORS properly
- [ ] Implement rate limiting
- [ ] Use helmet.js for security headers
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] API authentication
- [ ] Input validation
- [ ] SQL injection prevention

## Post-Deployment

1. **Test all endpoints**
2. **Monitor error rates**
3. **Check performance metrics**
4. **Verify database connections**
5. **Test user flows**
6. **Monitor logs**
7. **Setup alerts**

## Support

For deployment issues:
- Check platform documentation
- Review application logs
- Contact platform support
- Open GitHub issue
