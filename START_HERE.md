# 🎯 START HERE - FitAI Quick Launch Guide

## 🚀 FASTEST WAY TO GET STARTED (5 Minutes)

### Prerequisites Check ✅

Make sure you have installed:
- ✅ Node.js 18+ → [Download](https://nodejs.org/)
- ✅ Python 3.11+ → [Download](https://python.org/)
- ✅ Docker (optional) → [Download](https://docker.com/)

---

## 🏃 QUICK START (Choose One Method)

### **METHOD 1: Automated Setup (Easiest)**

#### Windows:
```bash
# Double-click setup.bat
# OR run in terminal:
setup.bat
```

#### Mac/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

Then:
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Start all services
npm run dev
```

**✅ Done! Open http://localhost:3000**

---

### **METHOD 2: Docker (Recommended)**

```bash
# One command to rule them all:
docker-compose up --build
```

**✅ Done! Open http://localhost:3000**

---

### **METHOD 3: Manual (For Developers)**

```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
cd ml-service && pip install -r requirements.txt && cd ..

# 2. Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# 3. Start all services (from root)
npm run dev
```

**✅ Done! Open http://localhost:3000**

---

## 🎮 USING THE APPLICATION

### Step 1: Register
1. Go to http://localhost:3000
2. Click "Get Started Free"
3. Create your account

### Step 2: Complete Profile
Fill in your health information:
- Age, gender, height, weight
- Fitness goals
- Diet preferences

### Step 3: Explore Features
- 📊 **Dashboard** - View your stats
- 🍽️ **Diet Planner** - Get meal plans
- 💪 **Workout Planner** - Get exercise routines
- 📈 **Progress** - Log meals & workouts
- 🤖 **AI Assistant** - Chat for advice
- 👤 **Profile** - Update settings

---

## 🔍 VERIFY EVERYTHING IS WORKING

### Check Services:

```bash
# Backend Health
curl http://localhost:5000/api/health

# ML Service Health
curl http://localhost:8000/health

# Frontend
# Open http://localhost:3000 in browser
```

### Expected Ports:
- ✅ Frontend: 3000
- ✅ Backend: 5000
- ✅ ML Service: 8000
- ✅ MongoDB: 27017

---

## 📚 IMPORTANT FILES

| File | What It Does |
|------|--------------|
| **FINAL_OUTPUT.md** | Complete project overview |
| **README.md** | Main documentation |
| **docs/QUICK_START.md** | Detailed quick start |
| **docs/API.md** | API documentation |
| **PROJECT_SUMMARY.md** | Project summary |

---

## 🆘 TROUBLESHOOTING

### Problem: Port already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Problem: MongoDB connection error

**Solution:**
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Check if running
docker ps
```

### Problem: Module not found

**Solution:**
```bash
# Reinstall everything
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

---

## ✅ SUCCESS CHECKLIST

Before using the app, verify:

- [ ] Node.js installed (check: `node --version`)
- [ ] Python installed (check: `python --version`)
- [ ] Dependencies installed (ran setup script)
- [ ] MongoDB running (Docker or local)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] ML service running on port 8000
- [ ] Can access http://localhost:3000
- [ ] Can register and login

---

## 🎯 WHAT'S INCLUDED

### ✅ Complete Features:
- User authentication & profiles
- Personalized diet plans
- Workout recommendations
- Calorie predictions (BMR/TDEE)
- Progress tracking
- AI health assistant
- Analytics dashboard
- Light/Dark mode
- Responsive design

### ✅ Technologies:
- React 18 + Tailwind CSS
- Node.js + Express + MongoDB
- Python + FastAPI
- Docker + Docker Compose
- JWT Authentication
- ML Algorithms

### ✅ Documentation:
- Installation guide
- API documentation
- Deployment guide
- Architecture overview
- Contributing guidelines

---

## 🚀 NEXT STEPS

1. **Test the app** - Create account and explore
2. **Read docs** - Check FINAL_OUTPUT.md
3. **Customize** - Update branding and features
4. **Deploy** - Follow docs/DEPLOYMENT.md
5. **Contribute** - See CONTRIBUTING.md

---

## 📞 NEED HELP?

- 📖 Read: **FINAL_OUTPUT.md** (complete guide)
- 📖 Read: **docs/QUICK_START.md** (detailed setup)
- 📖 Read: **README.md** (main docs)
- 🐛 Issues: GitHub Issues
- 📧 Email: support@fitai.com

---

## 🎉 YOU'RE READY!

Your AI-powered fitness platform is ready to use!

```bash
# Start the app:
npm run dev

# Open in browser:
http://localhost:3000
```

**Happy Coding! 🏋️‍♂️💪**

---

*Made with ❤️ for the fitness community*
