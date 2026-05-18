# 🪟 Windows Setup Guide (Without Docker)

## ✅ Step-by-Step Setup for Windows

Since Docker Compose is not installed, we'll use the manual setup method which works perfectly!

---

## 📋 Prerequisites

Make sure you have these installed:

### 1. Check Node.js
```powershell
node --version
# Should show v18.x or higher
```
**If not installed:** Download from https://nodejs.org/

### 2. Check Python
```powershell
python --version
# Should show 3.11 or higher
```
**If not installed:** Download from https://python.org/

### 3. Check MongoDB
We'll install MongoDB using one of these methods:

---

## 🚀 COMPLETE SETUP (Follow These Steps)

### **Step 1: Install MongoDB**

Choose ONE of these options:

#### **Option A: MongoDB Community Edition (Recommended)**

1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically as a Windows service

#### **Option B: MongoDB Portable (No Installation)**

1. Download MongoDB ZIP from: https://www.mongodb.com/try/download/community
2. Extract to `C:\mongodb`
3. Create data folder: `C:\mongodb\data`
4. Start MongoDB manually (see Step 3)

#### **Option C: Use MongoDB Atlas (Cloud - Free)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `server/.env` with your connection string

---

### **Step 2: Install Project Dependencies**

Open PowerShell in your project folder and run:

```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Install frontend dependencies
cd client
npm install
cd ..

# Install Python dependencies
cd ml-service
pip install -r requirements.txt
cd ..
```

---

### **Step 3: Start MongoDB**

Choose based on your installation:

#### **If you installed MongoDB Community Edition:**
```powershell
# MongoDB should already be running as a service
# Check if it's running:
Get-Service MongoDB

# If not running, start it:
Start-Service MongoDB
```

#### **If you're using MongoDB Portable:**
```powershell
# Open a NEW PowerShell window and run:
cd C:\mongodb\bin
.\mongod.exe --dbpath C:\mongodb\data
# Keep this window open
```

#### **If you're using MongoDB Atlas:**
```powershell
# Update server/.env with your connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-ai
# Then skip to Step 4
```

---

### **Step 4: Start the Application**

You need **3 separate PowerShell windows**:

#### **Window 1 - Backend Server:**
```powershell
cd server
npm run dev
```
**Wait for:** "✅ MongoDB Connected" and "🚀 Server running on port 5000"

#### **Window 2 - Frontend:**
```powershell
cd client
npm run dev
```
**Wait for:** "Local: http://localhost:3000"

#### **Window 3 - ML Service:**
```powershell
cd ml-service
python app.py
```
**Wait for:** "Application startup complete"

---

### **Step 5: Access the Application**

Open your browser and go to:
```
http://localhost:3000
```

You should see the FitAI landing page! 🎉

---

## ✅ Verify Everything is Working

### Test Backend:
```powershell
curl http://localhost:5000/api/health
```
**Expected:** `{"success":true,"message":"FitAI API is running"}`

### Test ML Service:
```powershell
curl http://localhost:8000/health
```
**Expected:** `{"status":"healthy"}`

### Test Frontend:
Open http://localhost:3000 in your browser

---

## 🎮 Using the Application

1. **Register:** Click "Get Started Free"
2. **Create Account:** Fill in your details
3. **Complete Profile:** Enter your health information
4. **Explore Features:**
   - Dashboard - View your stats
   - Diet Planner - Get meal plans
   - Workout Planner - Get exercise routines
   - Progress - Log meals and workouts
   - AI Assistant - Chat for advice

---

## 🔧 Troubleshooting

### Problem: "Port 3000 is already in use"

**Solution:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

### Problem: "Port 5000 is already in use"

**Solution:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Problem: "Cannot connect to MongoDB"

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it
Start-Service MongoDB

# Or use MongoDB Atlas (cloud) instead
```

### Problem: "Module not found"

**Solution:**
```powershell
# Clear and reinstall
Remove-Item -Recurse -Force node_modules, client/node_modules, server/node_modules
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Problem: Python package errors

**Solution:**
```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
cd ml-service
pip install -r requirements.txt
```

---

## 📝 Quick Reference

### Start All Services:

**Terminal 1 - MongoDB (if portable):**
```powershell
cd C:\mongodb\bin
.\mongod.exe --dbpath C:\mongodb\data
```

**Terminal 2 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 3 - Frontend:**
```powershell
cd client
npm run dev
```

**Terminal 4 - ML Service:**
```powershell
cd ml-service
python app.py
```

### Stop All Services:
Press `Ctrl + C` in each terminal window

---

## 🎯 Alternative: Use MongoDB Atlas (No Local MongoDB)

If you don't want to install MongoDB locally:

1. **Create MongoDB Atlas Account:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a free cluster (M0)

2. **Get Connection String:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment:**
   - Open `server/.env`
   - Replace `MONGODB_URI` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-ai?retryWrites=true&w=majority
   ```
   - Replace `username` and `password` with your credentials

4. **Start Application:**
   - No need to run MongoDB locally!
   - Just start backend, frontend, and ML service

---

## 🎊 Success Checklist

- [ ] Node.js installed and working
- [ ] Python installed and working
- [ ] MongoDB running (local or Atlas)
- [ ] All dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] ML service running on port 8000
- [ ] Can access http://localhost:3000
- [ ] Can register and login

---

## 📞 Need Help?

- Read: **START_HERE.md**
- Read: **FINAL_OUTPUT.md**
- Check: **docs/QUICK_START.md**

---

## 🎉 You're All Set!

Your FitAI platform is now running on Windows!

**Access it at:** http://localhost:3000

**Happy Coding! 🏋️‍♂️💪**
