import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DietPlanner from './pages/DietPlanner';
import WorkoutPlanner from './pages/WorkoutPlanner';
import Progress from './pages/Progress';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Onboarding Route - only for users who haven't completed profile
const OnboardingRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.profileCompleted) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const { isDark, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme
    setTheme(isDark);
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? '#1f2937' : '#fff',
              color: isDark ? '#f3f4f6' : '#111827',
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/diet"
            element={
              <ProtectedRoute>
                <DietPlanner />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/workout"
            element={
              <ProtectedRoute>
                <WorkoutPlanner />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
