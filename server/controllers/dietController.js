const axios = require('axios');
const User = require('../models/User');

// Sample food database
const foodDatabase = {
  vegetarian: {
    breakfast: [
      { name: 'Oatmeal with fruits', calories: 300, protein: 10, carbs: 50, fats: 8 },
      { name: 'Greek yogurt with berries', calories: 250, protein: 15, carbs: 30, fats: 8 },
      { name: 'Whole wheat toast with avocado', calories: 280, protein: 8, carbs: 35, fats: 12 },
      { name: 'Smoothie bowl', calories: 320, protein: 12, carbs: 45, fats: 10 },
      { name: 'Paneer sandwich', calories: 350, protein: 18, carbs: 40, fats: 12 }
    ],
    lunch: [
      { name: 'Quinoa salad with chickpeas', calories: 450, protein: 18, carbs: 60, fats: 15 },
      { name: 'Vegetable curry with brown rice', calories: 500, protein: 15, carbs: 70, fats: 18 },
      { name: 'Lentil soup with whole grain bread', calories: 420, protein: 20, carbs: 55, fats: 12 },
      { name: 'Paneer tikka with roti', calories: 480, protein: 22, carbs: 50, fats: 20 },
      { name: 'Mixed vegetable pasta', calories: 460, protein: 16, carbs: 65, fats: 14 }
    ],
    dinner: [
      { name: 'Grilled vegetables with quinoa', calories: 400, protein: 14, carbs: 55, fats: 12 },
      { name: 'Tofu stir-fry with brown rice', calories: 420, protein: 20, carbs: 50, fats: 15 },
      { name: 'Vegetable biryani', calories: 450, protein: 12, carbs: 65, fats: 16 },
      { name: 'Dal with roti and salad', calories: 380, protein: 18, carbs: 52, fats: 10 },
      { name: 'Mushroom risotto', calories: 440, protein: 15, carbs: 58, fats: 18 }
    ],
    snacks: [
      { name: 'Mixed nuts', calories: 180, protein: 6, carbs: 8, fats: 15 },
      { name: 'Fruit salad', calories: 120, protein: 2, carbs: 28, fats: 1 },
      { name: 'Hummus with veggies', calories: 150, protein: 6, carbs: 18, fats: 7 },
      { name: 'Protein bar', calories: 200, protein: 15, carbs: 20, fats: 8 },
      { name: 'Roasted chickpeas', calories: 140, protein: 8, carbs: 20, fats: 4 }
    ]
  },
  non_vegetarian: {
    breakfast: [
      { name: 'Scrambled eggs with toast', calories: 320, protein: 20, carbs: 30, fats: 14 },
      { name: 'Chicken sausage with oatmeal', calories: 380, protein: 25, carbs: 40, fats: 12 },
      { name: 'Egg white omelet with vegetables', calories: 250, protein: 22, carbs: 20, fats: 8 },
      { name: 'Protein pancakes', calories: 340, protein: 28, carbs: 35, fats: 10 },
      { name: 'Boiled eggs with whole wheat bread', calories: 300, protein: 24, carbs: 32, fats: 10 }
    ],
    lunch: [
      { name: 'Grilled chicken with quinoa', calories: 520, protein: 45, carbs: 50, fats: 15 },
      { name: 'Fish curry with brown rice', calories: 480, protein: 40, carbs: 55, fats: 12 },
      { name: 'Chicken salad bowl', calories: 450, protein: 42, carbs: 35, fats: 18 },
      { name: 'Turkey wrap with vegetables', calories: 460, protein: 38, carbs: 45, fats: 14 },
      { name: 'Grilled salmon with sweet potato', calories: 500, protein: 44, carbs: 48, fats: 16 }
    ],
    dinner: [
      { name: 'Baked chicken with vegetables', calories: 480, protein: 46, carbs: 40, fats: 14 },
      { name: 'Grilled fish with quinoa', calories: 450, protein: 42, carbs: 45, fats: 12 },
      { name: 'Chicken stir-fry with brown rice', calories: 490, protein: 44, carbs: 50, fats: 15 },
      { name: 'Lean beef with roasted vegetables', calories: 520, protein: 48, carbs: 38, fats: 18 },
      { name: 'Shrimp pasta with vegetables', calories: 470, protein: 40, carbs: 52, fats: 14 }
    ],
    snacks: [
      { name: 'Boiled eggs', calories: 140, protein: 12, carbs: 2, fats: 10 },
      { name: 'Chicken breast strips', calories: 180, protein: 30, carbs: 0, fats: 6 },
      { name: 'Tuna salad', calories: 160, protein: 25, carbs: 5, fats: 5 },
      { name: 'Protein shake', calories: 200, protein: 25, carbs: 15, fats: 4 },
      { name: 'Greek yogurt with nuts', calories: 220, protein: 18, carbs: 15, fats: 10 }
    ]
  }
};

// @desc    Generate personalized diet plan
// @route   POST /api/diet/generate
// @access  Private
exports.generateDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profileCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your health profile first'
      });
    }

    // Get target calories
    const targetCalories = user.targetCalories;
    const dietType = user.dietPreference === 'vegan' ? 'vegetarian' : 
                     (user.dietPreference === 'non_vegetarian' ? 'non_vegetarian' : 'vegetarian');

    // Calculate macro distribution based on goal
    let proteinPercent, carbsPercent, fatsPercent;
    
    switch (user.fitnessGoal) {
      case 'weight_loss':
        proteinPercent = 0.35;
        carbsPercent = 0.35;
        fatsPercent = 0.30;
        break;
      case 'muscle_gain':
        proteinPercent = 0.40;
        carbsPercent = 0.40;
        fatsPercent = 0.20;
        break;
      case 'weight_gain':
        proteinPercent = 0.30;
        carbsPercent = 0.45;
        fatsPercent = 0.25;
        break;
      default:
        proteinPercent = 0.30;
        carbsPercent = 0.40;
        fatsPercent = 0.30;
    }

    const targetProtein = Math.round((targetCalories * proteinPercent) / 4);
    const targetCarbs = Math.round((targetCalories * carbsPercent) / 4);
    const targetFats = Math.round((targetCalories * fatsPercent) / 9);

    // Distribute calories across meals
    const breakfastCal = Math.round(targetCalories * 0.25);
    const lunchCal = Math.round(targetCalories * 0.35);
    const dinnerCal = Math.round(targetCalories * 0.30);
    const snackCal = Math.round(targetCalories * 0.10);

    // Select meals from database
    const foods = foodDatabase[dietType];
    
    const breakfast = foods.breakfast[Math.floor(Math.random() * foods.breakfast.length)];
    const lunch = foods.lunch[Math.floor(Math.random() * foods.lunch.length)];
    const dinner = foods.dinner[Math.floor(Math.random() * foods.dinner.length)];
    const snack = foods.snacks[Math.floor(Math.random() * foods.snacks.length)];

    const dietPlan = {
      targetCalories,
      targetMacros: {
        protein: targetProtein,
        carbs: targetCarbs,
        fats: targetFats
      },
      meals: {
        breakfast: {
          ...breakfast,
          targetCalories: breakfastCal
        },
        lunch: {
          ...lunch,
          targetCalories: lunchCal
        },
        dinner: {
          ...dinner,
          targetCalories: dinnerCal
        },
        snacks: {
          ...snack,
          targetCalories: snackCal
        }
      },
      hydration: {
        target: Math.round(user.weight * 0.033), // 33ml per kg
        unit: 'liters'
      },
      tips: [
        'Eat slowly and mindfully',
        'Stay hydrated throughout the day',
        'Include variety in your meals',
        'Prepare meals in advance when possible',
        'Listen to your body\'s hunger cues'
      ]
    };

    res.json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get calorie prediction
// @route   GET /api/diet/calories
// @access  Private
exports.getCaloriePrediction = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profileCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your health profile first'
      });
    }

    const prediction = {
      bmr: user.bmr,
      tdee: user.tdee,
      targetCalories: user.targetCalories,
      bmi: user.bmi,
      breakdown: {
        weightLoss: user.tdee - 500,
        maintenance: user.tdee,
        weightGain: user.tdee + 500,
        muscleGain: user.tdee + 300
      },
      recommendations: []
    };

    // Add recommendations based on BMI
    if (user.bmi < 18.5) {
      prediction.recommendations.push('Your BMI indicates underweight. Consider a calorie surplus.');
    } else if (user.bmi >= 18.5 && user.bmi < 25) {
      prediction.recommendations.push('Your BMI is in the healthy range. Maintain your current lifestyle.');
    } else if (user.bmi >= 25 && user.bmi < 30) {
      prediction.recommendations.push('Your BMI indicates overweight. Consider a calorie deficit.');
    } else {
      prediction.recommendations.push('Consult with a healthcare professional for personalized advice.');
    }

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get nutrition recommendations
// @route   GET /api/diet/recommendations
// @access  Private
exports.getNutritionRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const recommendations = {
      dailyIntake: {
        calories: user.targetCalories,
        protein: Math.round(user.weight * 1.6), // 1.6g per kg for active individuals
        carbs: Math.round((user.targetCalories * 0.4) / 4),
        fats: Math.round((user.targetCalories * 0.3) / 9),
        fiber: 25, // grams
        water: Math.round(user.weight * 0.033) // liters
      },
      mealTiming: {
        breakfast: '7:00 AM - 9:00 AM',
        snack1: '10:30 AM - 11:00 AM',
        lunch: '12:30 PM - 2:00 PM',
        snack2: '4:00 PM - 5:00 PM',
        dinner: '7:00 PM - 8:30 PM'
      },
      supplements: [],
      tips: [
        'Eat protein with every meal',
        'Include colorful vegetables',
        'Choose whole grains over refined',
        'Limit processed foods',
        'Plan your meals ahead'
      ]
    };

    // Add supplement recommendations based on goal
    if (user.fitnessGoal === 'muscle_gain') {
      recommendations.supplements.push('Whey Protein', 'Creatine', 'BCAAs');
    } else if (user.fitnessGoal === 'weight_loss') {
      recommendations.supplements.push('Multivitamin', 'Omega-3', 'Green Tea Extract');
    }

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
