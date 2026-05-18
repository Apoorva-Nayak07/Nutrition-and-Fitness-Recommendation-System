# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **Python** (v3.11 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v7.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

Optional:
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/)

## Installation Methods

### Method 1: Local Development Setup (Recommended for Development)

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd fitness-ai-system
```

#### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies (frontend, backend)
npm run install-all
```

#### Step 3: Install Python Dependencies

```bash
cd ml-service
pip install -r requirements.txt
cd ..
```

#### Step 4: Setup Environment Variables

**Backend Environment:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-ai
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
```

**Frontend Environment:**
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 5: Start MongoDB

**Option A: Using Docker**
```bash
docker run -d -p 27017:27017 --name fitai-mongodb mongo:7.0
```

**Option B: Local Installation**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Step 6: Start All Services

**Option A: Using npm script (all services at once)**
```bash
npm run dev
```

**Option B: Start services individually**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

Terminal 3 - ML Service:
```bash
cd ml-service
python app.py
```

#### Step 7: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **ML Service:** http://localhost:8000
- **API Health Check:** http://localhost:5000/api/health

### Method 2: Docker Setup (Recommended for Production)

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd fitness-ai-system
```

#### Step 2: Build Docker Images

```bash
docker-compose build
```

#### Step 3: Start All Services

```bash
docker-compose up -d
```

#### Step 4: Check Service Status

```bash
docker-compose ps
```

#### Step 5: View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

#### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **ML Service:** http://localhost:8000
- **MongoDB:** localhost:27017

#### Stop Services

```bash
docker-compose down
```

#### Stop and Remove Volumes

```bash
docker-compose down -v
```

## Verification

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "FitAI API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Check ML Service Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy"
}
```

### 3. Check Frontend

Open http://localhost:3000 in your browser. You should see the landing page.

## Troubleshooting

### MongoDB Connection Issues

**Problem:** Cannot connect to MongoDB

**Solution:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Or for local installation
# macOS/Linux
ps aux | grep mongod

# Windows
tasklist | findstr mongod
```

### Port Already in Use

**Problem:** Port 3000, 5000, or 8000 is already in use

**Solution:**
```bash
# Find process using the port (macOS/Linux)
lsof -i :3000

# Kill the process
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Python Dependencies Issues

**Problem:** Error installing Python packages

**Solution:**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install dependencies
pip install -r ml-service/requirements.txt
```

### Node Modules Issues

**Problem:** Module not found errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules client/node_modules server/node_modules

# Reinstall
npm run install-all
```

### Docker Issues

**Problem:** Docker build fails

**Solution:**
```bash
# Remove old images
docker-compose down --rmi all

# Rebuild without cache
docker-compose build --no-cache

# Start services
docker-compose up -d
```

## Next Steps

After successful installation:

1. **Create an Account:** Navigate to http://localhost:3000/register
2. **Complete Profile:** Fill in your health information
3. **Explore Features:** Try diet planning, workout generation, and AI assistant
4. **Check Documentation:** Read API documentation in `docs/API.md`

## Development Tips

### Hot Reload

All services support hot reload:
- **Frontend:** Vite automatically reloads on file changes
- **Backend:** Nodemon restarts on file changes
- **ML Service:** Uvicorn reloads on file changes

### Database Management

**View MongoDB data:**
```bash
# Using MongoDB Compass (GUI)
# Connect to: mongodb://localhost:27017

# Using mongo shell
mongosh
use fitness-ai
db.users.find()
```

**Reset database:**
```bash
mongosh
use fitness-ai
db.dropDatabase()
```

### Environment Switching

**Development:**
```bash
NODE_ENV=development npm run dev
```

**Production:**
```bash
NODE_ENV=production npm start
```

## Additional Resources

- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker-compose logs` or check terminal output
3. Open an issue on GitHub
4. Contact support: support@fitai.com
