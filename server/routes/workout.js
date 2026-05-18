const express = require('express');
const router = express.Router();
const {
  generateWorkoutPlan,
  getExerciseLibrary,
  getWorkoutRecommendations
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateWorkoutPlan);
router.get('/exercises', protect, getExerciseLibrary);
router.get('/recommendations', protect, getWorkoutRecommendations);

module.exports = router;
