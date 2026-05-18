const Progress = require('../models/Progress');
const MealLog = require('../models/MealLog');
const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');

// @desc    Log progress
// @route   POST /api/progress
// @access  Private
exports.logProgress = async (req, res) => {
  try {
    const { weight, bodyFat, muscleMass, waterIntake, notes } = req.body;
    const user = await User.findById(req.user.id);

    // Calculate BMI
    const bmi = user.height ? weight / Math.pow(user.height / 100, 2) : null;

    const progress = await Progress.create({
      user: req.user.id,
      weight,
      bmi,
      bodyFat,
      muscleMass,
      waterIntake,
      notes
    });

    // Update user's current weight
    user.weight = weight;
    user.updateMetrics();
    await user.save();

    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get progress history
// @route   GET /api/progress
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    let query = { user: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const progress = await Progress.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/progress/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get progress data
    const recentProgress = await Progress.find({
      user: req.user.id,
      date: { $gte: monthAgo }
    }).sort({ date: 1 });

    // Get meal logs
    const weekMeals = await MealLog.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    });

    // Get workout logs
    const weekWorkouts = await WorkoutLog.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    });

    // Calculate statistics
    const totalCaloriesConsumed = weekMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const totalCaloriesBurned = weekWorkouts.reduce((sum, workout) => sum + workout.totalCaloriesBurned, 0);
    const avgDailyCalories = weekMeals.length > 0 ? Math.round(totalCaloriesConsumed / 7) : 0;
    const workoutsCompleted = weekWorkouts.filter(w => w.completed).length;

    // Weight progress
    let weightChange = 0;
    if (recentProgress.length >= 2) {
      const firstWeight = recentProgress[0].weight;
      const lastWeight = recentProgress[recentProgress.length - 1].weight;
      weightChange = lastWeight - firstWeight;
    }

    // Calculate goal progress
    let goalProgress = 0;
    if (user.targetWeight && user.weight) {
      const totalChange = Math.abs(user.targetWeight - user.weight);
      const initialWeight = recentProgress.length > 0 ? recentProgress[0].weight : user.weight;
      const currentChange = Math.abs(initialWeight - user.weight);
      goalProgress = totalChange > 0 ? Math.round((currentChange / totalChange) * 100) : 0;
    }

    const analytics = {
      currentStats: {
        weight: user.weight,
        bmi: user.bmi,
        targetWeight: user.targetWeight,
        goalProgress
      },
      weeklyStats: {
        caloriesConsumed: totalCaloriesConsumed,
        caloriesBurned: totalCaloriesBurned,
        netCalories: totalCaloriesConsumed - totalCaloriesBurned,
        avgDailyCalories,
        workoutsCompleted,
        weightChange: Math.round(weightChange * 10) / 10
      },
      progressData: recentProgress.map(p => ({
        date: p.date,
        weight: p.weight,
        bmi: p.bmi
      })),
      mealData: weekMeals.map(m => ({
        date: m.date,
        mealType: m.mealType,
        calories: m.totalCalories,
        protein: m.totalProtein
      })),
      workoutData: weekWorkouts.map(w => ({
        date: w.date,
        type: w.workoutType,
        duration: w.totalDuration,
        calories: w.totalCaloriesBurned
      }))
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Log meal
// @route   POST /api/progress/meal
// @access  Private
exports.logMeal = async (req, res) => {
  try {
    const { mealType, foodItems, notes } = req.body;

    const mealLog = await MealLog.create({
      user: req.user.id,
      mealType,
      foodItems,
      notes
    });

    res.status(201).json({
      success: true,
      data: mealLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Log workout
// @route   POST /api/progress/workout
// @access  Private
exports.logWorkout = async (req, res) => {
  try {
    const { workoutType, exercises, notes, completed } = req.body;

    const workoutLog = await WorkoutLog.create({
      user: req.user.id,
      workoutType,
      exercises,
      notes,
      completed
    });

    res.status(201).json({
      success: true,
      data: workoutLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get meal logs
// @route   GET /api/progress/meals
// @access  Private
exports.getMealLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { user: req.user.id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const meals = await MealLog.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get workout logs
// @route   GET /api/progress/workouts
// @access  Private
exports.getWorkoutLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { user: req.user.id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const workouts = await WorkoutLog.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
