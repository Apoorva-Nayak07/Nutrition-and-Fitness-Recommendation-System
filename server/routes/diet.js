const express = require('express');
const router = express.Router();
const {
  generateDietPlan,
  getCaloriePrediction,
  getNutritionRecommendations
} = require('../controllers/dietController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateDietPlan);
router.get('/calories', protect, getCaloriePrediction);
router.get('/recommendations', protect, getNutritionRecommendations);

module.exports = router;
