# Quick Start Guide

Get FitAI up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check Python (need 3.11+)
python --version

# Check MongoDB
mongod --version

# Check npm
npm --version
```

## Installation (3 Steps)

### Step 1: Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd fitness-ai-system

# Install all dependencies
npm run install-all

# Install Python dependencies
cd ml-service
pip install -r requirements.txt
cd ..
```

### Step 2: Setup Environment

```bash
# Backend is already configured with .env file
# Frontend is already configured with .env file
# You can modify them if needed
```

### Step 3: Start Services

**Option A: All at once (Recommended)**
```bash
npm run dev
```

**Option B: Individual terminals**

Terminal 1 - MongoDB:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

Terminal 2 - Backend:
```bash
cd server
npm run dev
```

Terminal 3 - Frontend:
```bash
cd client
npm run dev
```

Terminal 4 - ML Service:
```bash
cd ml-service
python app.py
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **ML Service:** http://localhost:8000

## First Steps

1. **Register:** Go to http://localhost:3000/register
2. **Complete Profile:** Fill in your health information
3. **Generate Diet Plan:** Navigate to Diet Planner
4. **Generate Workout Plan:** Navigate to Workout Planner
5. **Chat with AI:** Try the AI Assistant
6. **Track Progress:** Log your meals and workouts

## Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Docker Quick Start

```bash
# Build and start all services
docker-compose up --build

# Access at http://localhost:3000
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### MongoDB Connection Error

```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or check if MongoDB is running
ps aux | grep mongod
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

## Next Steps

- Read [API Documentation](./API.md)
- Check [Architecture Overview](./ARCHITECTURE.md)
- See [Deployment Guide](./DEPLOYMENT.md)
- Review [Contributing Guidelines](../CONTRIBUTING.md)

## Demo Credentials

For testing purposes:
- **Email:** demo@fitai.com
- **Password:** demo123

(Note: Create this user first by registering)

## Support

- 📧 Email: support@fitai.com
- 💬 Discord: [Join our server]
- 🐛 Issues: [GitHub Issues]
- 📖 Docs: [Full Documentation](../README.md)

---

**Happy Coding! 🚀**
