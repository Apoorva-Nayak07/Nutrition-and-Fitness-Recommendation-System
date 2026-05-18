const express = require('express');
const router = express.Router();
const {
  logProgress,
  getProgress,
  getAnalytics,
  logMeal,
  logWorkout,
  getMealLogs,
  getWorkoutLogs
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/', protect, logProgress);
router.get('/', protect, getProgress);
router.get('/analytics', protect, getAnalytics);
router.post('/meal', protect, logMeal);
router.post('/workout', protect, logWorkout);
router.get('/meals', protect, getMealLogs);
router.get('/workouts', protect, getWorkoutLogs);

module.exports = router;
