const express = require('express');
const router = express.Router();
const {
  chat,
  getInsights,
  getWeeklySummary
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chat);
router.get('/insights', protect, getInsights);
router.get('/summary', protect, getWeeklySummary);

module.exports = router;
