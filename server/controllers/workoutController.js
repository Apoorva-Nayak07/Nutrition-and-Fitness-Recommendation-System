const User = require('../models/User');

// Workout database
const workoutDatabase = {
  beginner: {
    cardio: [
      { name: 'Walking', duration: 30, caloriesPerMin: 4, difficulty: 'easy' },
      { name: 'Light Jogging', duration: 20, caloriesPerMin: 6, difficulty: 'easy' },
      { name: 'Cycling', duration: 25, caloriesPerMin: 5, difficulty: 'easy' },
      { name: 'Swimming', duration: 20, caloriesPerMin: 7, difficulty: 'moderate' }
    ],
    strength: [
      { name: 'Bodyweight Squats', sets: 3, reps: 12, rest: 60, caloriesPerSet: 15 },
      { name: 'Push-ups (Knee)', sets: 3, reps: 10, rest: 60, caloriesPerSet: 12 },
      { name: 'Lunges', sets: 3, reps: 10, rest: 60, caloriesPerSet: 14 },
      { name: 'Plank', sets: 3, duration: 30, rest: 45, caloriesPerSet: 10 },
      { name: 'Dumbbell Rows', sets: 3, reps: 12, rest: 60, caloriesPerSet: 13 }
    ],
    yoga: [
      { name: 'Sun Salutation', duration: 10, caloriesPerMin: 3 },
      { name: 'Basic Stretching', duration: 15, caloriesPerMin: 2 },
      { name: 'Beginner Flow', duration: 20, caloriesPerMin: 3 }
    ]
  },
  intermediate: {
    cardio: [
      { name: 'Running', duration: 30, caloriesPerMin: 10, difficulty: 'moderate' },
      { name: 'HIIT Cardio', duration: 20, caloriesPerMin: 12, difficulty: 'hard' },
      { name: 'Jump Rope', duration: 15, caloriesPerMin: 11, difficulty: 'moderate' },
      { name: 'Rowing', duration: 25, caloriesPerMin: 9, difficulty: 'moderate' }
    ],
    strength: [
      { name: 'Barbell Squats', sets: 4, reps: 10, rest: 90, caloriesPerSet: 20 },
      { name: 'Bench Press', sets: 4, reps: 10, rest: 90, caloriesPerSet: 18 },
      { name: 'Deadlifts', sets: 4, reps: 8, rest: 120, caloriesPerSet: 25 },
      { name: 'Pull-ups', sets: 3, reps: 8, rest: 90, caloriesPerSet: 16 },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: 12, rest: 60, caloriesPerSet: 15 }
    ],
    hiit: [
      { name: 'Burpees', sets: 4, reps: 15, rest: 30, caloriesPerSet: 20 },
      { name: 'Mountain Climbers', sets: 4, duration: 45, rest: 30, caloriesPerSet: 18 },
      { name: 'Jump Squats', sets: 4, reps: 15, rest: 30, caloriesPerSet: 19 },
      { name: 'High Knees', sets: 4, duration: 45, rest: 30, caloriesPerSet: 17 }
    ]
  },
  advanced: {
    cardio: [
      { name: 'Sprint Intervals', duration: 25, caloriesPerMin: 15, difficulty: 'very hard' },
      { name: 'Long Distance Running', duration: 45, caloriesPerMin: 11, difficulty: 'hard' },
      { name: 'Advanced HIIT', duration: 30, caloriesPerMin: 14, difficulty: 'very hard' }
    ],
    strength: [
      { name: 'Heavy Squats', sets: 5, reps: 5, rest: 180, caloriesPerSet: 30 },
      { name: 'Heavy Deadlifts', sets: 5, reps: 5, rest: 180, caloriesPerSet: 35 },
      { name: 'Weighted Pull-ups', sets: 4, reps: 8, rest: 120, caloriesPerSet: 22 },
      { name: 'Barbell Rows', sets: 4, reps: 8, rest: 90, caloriesPerSet: 20 },
      { name: 'Overhead Press', sets: 4, reps: 8, rest: 90, caloriesPerSet: 18 }
    ],
    hiit: [
      { name: 'Advanced Burpees', sets: 5, reps: 20, rest: 30, caloriesPerSet: 25 },
      { name: 'Box Jumps', sets: 5, reps: 15, rest: 45, caloriesPerSet: 23 },
      { name: 'Kettlebell Swings', sets: 5, reps: 20, rest: 45, caloriesPerSet: 24 },
      { name: 'Battle Ropes', sets: 5, duration: 60, rest: 45, caloriesPerSet: 26 }
    ]
  }
};

// @desc    Generate workout plan
// @route   POST /api/workout/generate
// @access  Private
exports.generateWorkoutPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profileCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your health profile first'
      });
    }

    const experience = user.workoutExperience;
    const goal = user.fitnessGoal;
    const workouts = workoutDatabase[experience];

    let weeklyPlan = [];

    // Generate workout plan based on goal
    if (goal === 'weight_loss') {
      // Focus on cardio and HIIT
      weeklyPlan = [
        { day: 'Monday', type: 'cardio', exercises: workouts.cardio.slice(0, 2) },
        { day: 'Tuesday', type: 'strength', exercises: workouts.strength.slice(0, 3) },
        { day: 'Wednesday', type: 'cardio', exercises: workouts.cardio.slice(1, 3) },
        { day: 'Thursday', type: 'rest', exercises: [] },
        { day: 'Friday', type: 'hiit', exercises: workouts.hiit ? workouts.hiit.slice(0, 4) : workouts.cardio.slice(0, 2) },
        { day: 'Saturday', type: 'strength', exercises: workouts.strength.slice(2, 5) },
        { day: 'Sunday', type: 'rest', exercises: [] }
      ];
    } else if (goal === 'muscle_gain') {
      // Focus on strength training
      weeklyPlan = [
        { day: 'Monday', type: 'strength', exercises: workouts.strength.slice(0, 3), focus: 'Upper Body' },
        { day: 'Tuesday', type: 'strength', exercises: workouts.strength.slice(2, 5), focus: 'Lower Body' },
        { day: 'Wednesday', type: 'cardio', exercises: workouts.cardio.slice(0, 1) },
        { day: 'Thursday', type: 'strength', exercises: workouts.strength.slice(0, 3), focus: 'Push' },
        { day: 'Friday', type: 'strength', exercises: workouts.strength.slice(2, 5), focus: 'Pull' },
        { day: 'Saturday', type: 'cardio', exercises: workouts.cardio.slice(0, 1) },
        { day: 'Sunday', type: 'rest', exercises: [] }
      ];
    } else {
      // Balanced approach
      weeklyPlan = [
        { day: 'Monday', type: 'strength', exercises: workouts.strength.slice(0, 3) },
        { day: 'Tuesday', type: 'cardio', exercises: workouts.cardio.slice(0, 2) },
        { day: 'Wednesday', type: 'strength', exercises: workouts.strength.slice(2, 5) },
        { day: 'Thursday', type: 'yoga', exercises: workouts.yoga ? workouts.yoga : [] },
        { day: 'Friday', type: 'cardio', exercises: workouts.cardio.slice(1, 3) },
        { day: 'Saturday', type: 'strength', exercises: workouts.strength.slice(0, 3) },
        { day: 'Sunday', type: 'rest', exercises: [] }
      ];
    }

    // Calculate estimated calories burned
    weeklyPlan = weeklyPlan.map(day => {
      let totalCalories = 0;
      day.exercises.forEach(ex => {
        if (ex.caloriesPerMin) {
          totalCalories += ex.caloriesPerMin * ex.duration;
        } else if (ex.caloriesPerSet) {
          totalCalories += ex.caloriesPerSet * ex.sets;
        }
      });
      return { ...day, estimatedCalories: totalCalories };
    });

    const workoutPlan = {
      experience,
      goal,
      weeklyPlan,
      tips: [
        'Always warm up before exercising',
        'Focus on proper form over weight',
        'Stay hydrated during workouts',
        'Get adequate rest between sessions',
        'Listen to your body and avoid overtraining'
      ],
      progressionTips: [
        'Gradually increase weight or intensity',
        'Track your workouts consistently',
        'Ensure proper nutrition and recovery',
        'Consider working with a trainer for advanced techniques'
      ]
    };

    res.json({
      success: true,
      data: workoutPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get exercise library
// @route   GET /api/workout/exercises
// @access  Private
exports.getExerciseLibrary = async (req, res) => {
  try {
    const { type, level } = req.query;
    
    let exercises = [];
    
    if (level && workoutDatabase[level]) {
      if (type && workoutDatabase[level][type]) {
        exercises = workoutDatabase[level][type];
      } else {
        // Return all exercises for the level
        Object.values(workoutDatabase[level]).forEach(typeExercises => {
          exercises = exercises.concat(typeExercises);
        });
      }
    } else {
      // Return all exercises
      Object.values(workoutDatabase).forEach(levelExercises => {
        Object.values(levelExercises).forEach(typeExercises => {
          exercises = exercises.concat(typeExercises);
        });
      });
    }

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get workout recommendations
// @route   GET /api/workout/recommendations
// @access  Private
exports.getWorkoutRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const recommendations = {
      weeklyGoal: {
        cardio: user.fitnessGoal === 'weight_loss' ? '150-200 minutes' : '100-150 minutes',
        strength: user.fitnessGoal === 'muscle_gain' ? '4-5 sessions' : '2-3 sessions',
        flexibility: '2-3 sessions',
        rest: '1-2 days'
      },
      intensityDistribution: {
        low: '40%',
        moderate: '40%',
        high: '20%'
      },
      tips: [
        'Vary your workouts to prevent plateaus',
        'Include both compound and isolation exercises',
        'Progressive overload is key for muscle growth',
        'Recovery is as important as training',
        'Stay consistent with your routine'
      ]
    };

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
