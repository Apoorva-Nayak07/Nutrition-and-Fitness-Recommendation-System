const User = require('../models/User');
const MealLog = require('../models/MealLog');
const WorkoutLog = require('../models/WorkoutLog');
const Progress = require('../models/Progress');

// Simple AI responses based on keywords
const aiResponses = {
  greeting: [
    "Hello! I'm your AI fitness assistant. How can I help you today?",
    "Hi there! Ready to crush your fitness goals?",
    "Hey! I'm here to help with your nutrition and fitness journey!"
  ],
  diet: [
    "A balanced diet is key to reaching your goals. Make sure you're getting enough protein, healthy fats, and complex carbs.",
    "Focus on whole foods, stay hydrated, and eat mindfully. Your body will thank you!",
    "Remember: nutrition is 70% of the battle. Consistency is more important than perfection."
  ],
  workout: [
    "Great question! The best workout is the one you'll stick to consistently.",
    "Mix cardio and strength training for optimal results. Don't forget rest days!",
    "Progressive overload is key - gradually increase intensity over time."
  ],
  motivation: [
    "You've got this! Every small step counts towards your goal.",
    "Remember why you started. Your future self will thank you!",
    "Progress, not perfection. Keep showing up!"
  ],
  weightLoss: [
    "Weight loss comes down to a calorie deficit. Combine proper nutrition with regular exercise.",
    "Aim for 0.5-1kg per week for sustainable weight loss. Patience is key!",
    "Focus on building healthy habits rather than quick fixes."
  ],
  muscleGain: [
    "To build muscle, you need progressive resistance training and adequate protein (1.6-2.2g per kg).",
    "Don't forget to eat in a slight calorie surplus and get 7-9 hours of sleep!",
    "Compound exercises like squats, deadlifts, and bench press are your friends."
  ],
  disclaimer: "⚠️ Disclaimer: I provide general wellness and fitness guidance only. This is not medical advice. Please consult healthcare professionals for medical concerns."
};

// @desc    AI Chat Assistant
// @route   POST /api/ai/chat
// @access  Private
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user.id);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';
    let category = 'general';

    // Simple keyword matching
    if (lowerMessage.match(/hello|hi|hey|greetings/)) {
      response = aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
      category = 'greeting';
    } else if (lowerMessage.match(/diet|nutrition|food|meal|eat/)) {
      response = aiResponses.diet[Math.floor(Math.random() * aiResponses.diet.length)];
      category = 'diet';
      
      // Add personalized info
      if (user.targetCalories) {
        response += `\n\nBased on your profile, your target is ${user.targetCalories} calories per day.`;
      }
    } else if (lowerMessage.match(/workout|exercise|training|gym|fitness/)) {
      response = aiResponses.workout[Math.floor(Math.random() * aiResponses.workout.length)];
      category = 'workout';
      
      if (user.workoutExperience) {
        response += `\n\nAs a ${user.workoutExperience} level athlete, focus on consistency and proper form.`;
      }
    } else if (lowerMessage.match(/motivat|inspire|encourage|help|support/)) {
      response = aiResponses.motivation[Math.floor(Math.random() * aiResponses.motivation.length)];
      category = 'motivation';
    } else if (lowerMessage.match(/lose weight|weight loss|fat loss|slim/)) {
      response = aiResponses.weightLoss[Math.floor(Math.random() * aiResponses.weightLoss.length)];
      category = 'weightLoss';
    } else if (lowerMessage.match(/muscle|gain|bulk|strength/)) {
      response = aiResponses.muscleGain[Math.floor(Math.random() * aiResponses.muscleGain.length)];
      category = 'muscleGain';
    } else if (lowerMessage.match(/calorie|bmr|tdee/)) {
      response = `Your BMR is ${user.bmr} calories and your TDEE is ${user.tdee} calories. `;
      response += `To ${user.fitnessGoal.replace('_', ' ')}, aim for ${user.targetCalories} calories per day.`;
      category = 'calories';
    } else if (lowerMessage.match(/bmi|weight|height/)) {
      response = `Your current BMI is ${user.bmi}. `;
      if (user.bmi < 18.5) {
        response += 'This is in the underweight range. Consider increasing your calorie intake.';
      } else if (user.bmi < 25) {
        response += 'This is in the healthy range. Great job!';
      } else if (user.bmi < 30) {
        response += 'This is in the overweight range. A calorie deficit with exercise can help.';
      } else {
        response += 'Consider consulting with a healthcare professional for personalized guidance.';
      }
      category = 'bmi';
    } else {
      response = "I can help you with diet plans, workout routines, calorie tracking, and fitness motivation. What would you like to know?";
      category = 'general';
    }

    // Add disclaimer for health-related queries
    if (['diet', 'workout', 'weightLoss', 'muscleGain', 'calories', 'bmi'].includes(category)) {
      response += `\n\n${aiResponses.disclaimer}`;
    }

    res.json({
      success: true,
      data: {
        message: response,
        category,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get AI insights
// @route   GET /api/ai/insights
// @access  Private
exports.getInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get recent data
    const recentMeals = await MealLog.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    });

    const recentWorkouts = await WorkoutLog.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    });

    const recentProgress = await Progress.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    }).sort({ date: 1 });

    const insights = [];

    // Calorie insights
    const avgCalories = recentMeals.length > 0 
      ? recentMeals.reduce((sum, m) => sum + m.totalCalories, 0) / recentMeals.length 
      : 0;

    if (avgCalories > user.targetCalories + 200) {
      insights.push({
        type: 'warning',
        category: 'nutrition',
        message: `You're consuming ${Math.round(avgCalories - user.targetCalories)} calories above your target. Consider reducing portion sizes.`
      });
    } else if (avgCalories < user.targetCalories - 200) {
      insights.push({
        type: 'warning',
        category: 'nutrition',
        message: `You're consuming ${Math.round(user.targetCalories - avgCalories)} calories below your target. Make sure you're eating enough!`
      });
    } else {
      insights.push({
        type: 'success',
        category: 'nutrition',
        message: 'Great job! Your calorie intake is on track with your goals.'
      });
    }

    // Workout insights
    const workoutCount = recentWorkouts.filter(w => w.completed).length;
    if (workoutCount < 3) {
      insights.push({
        type: 'warning',
        category: 'fitness',
        message: `You've completed ${workoutCount} workouts this week. Try to aim for at least 3-4 sessions!`
      });
    } else {
      insights.push({
        type: 'success',
        category: 'fitness',
        message: `Excellent! You've completed ${workoutCount} workouts this week. Keep it up!`
      });
    }

    // Progress insights
    if (recentProgress.length >= 2) {
      const weightChange = recentProgress[recentProgress.length - 1].weight - recentProgress[0].weight;
      
      if (user.fitnessGoal === 'weight_loss' && weightChange < 0) {
        insights.push({
          type: 'success',
          category: 'progress',
          message: `You've lost ${Math.abs(weightChange).toFixed(1)}kg this week! Great progress!`
        });
      } else if (user.fitnessGoal === 'weight_gain' && weightChange > 0) {
        insights.push({
          type: 'success',
          category: 'progress',
          message: `You've gained ${weightChange.toFixed(1)}kg this week! Keep it up!`
        });
      }
    }

    // General tips
    insights.push({
      type: 'tip',
      category: 'general',
      message: 'Remember to stay hydrated! Aim for at least 2-3 liters of water daily.'
    });

    res.json({
      success: true,
      data: {
        insights,
        disclaimer: aiResponses.disclaimer
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get weekly summary
// @route   GET /api/ai/summary
// @access  Private
exports.getWeeklySummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const weekMeals = await MealLog.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    });

    const weekWorkouts = await WorkoutLog.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    });

    const totalCalories = weekMeals.reduce((sum, m) => sum + m.totalCalories, 0);
    const totalProtein = weekMeals.reduce((sum, m) => sum + m.totalProtein, 0);
    const workoutsCompleted = weekWorkouts.filter(w => w.completed).length;
    const totalCaloriesBurned = weekWorkouts.reduce((sum, w) => sum + w.totalCaloriesBurned, 0);

    const summary = {
      period: 'Last 7 days',
      nutrition: {
        totalCalories,
        avgDailyCalories: Math.round(totalCalories / 7),
        totalProtein: Math.round(totalProtein),
        mealsLogged: weekMeals.length
      },
      fitness: {
        workoutsCompleted,
        totalCaloriesBurned,
        avgCaloriesPerWorkout: workoutsCompleted > 0 ? Math.round(totalCaloriesBurned / workoutsCompleted) : 0
      },
      recommendations: [
        workoutsCompleted >= 4 ? 'Excellent workout consistency!' : 'Try to increase workout frequency',
        totalProtein / 7 >= user.weight * 1.2 ? 'Great protein intake!' : 'Consider increasing protein intake',
        'Keep tracking your meals and workouts for best results'
      ],
      disclaimer: aiResponses.disclaimer
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
