import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Diet APIs
export const dietAPI = {
  generatePlan: () => api.post('/diet/generate'),
  getCalories: () => api.get('/diet/calories'),
  getRecommendations: () => api.get('/diet/recommendations'),
};

// Workout APIs
export const workoutAPI = {
  generatePlan: () => api.post('/workout/generate'),
  getExercises: (params) => api.get('/workout/exercises', { params }),
  getRecommendations: () => api.get('/workout/recommendations'),
};

// Progress APIs
export const progressAPI = {
  logProgress: (data) => api.post('/progress', data),
  getProgress: (params) => api.get('/progress', { params }),
  getAnalytics: () => api.get('/progress/analytics'),
  logMeal: (data) => api.post('/progress/meal', data),
  logWorkout: (data) => api.post('/progress/workout', data),
  getMeals: (params) => api.get('/progress/meals', { params }),
  getWorkouts: (params) => api.get('/progress/workouts', { params }),
};

// AI APIs
export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
  getInsights: () => api.get('/ai/insights'),
  getSummary: () => api.get('/ai/summary'),
};

export default api;
