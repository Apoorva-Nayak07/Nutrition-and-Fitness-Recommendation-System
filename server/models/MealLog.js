const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foodItems: [{
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFats: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
mealLogSchema.pre('save', function(next) {
  this.totalCalories = this.foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);
  this.totalProtein = this.foodItems.reduce((sum, item) => sum + (item.protein || 0), 0);
  this.totalCarbs = this.foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0);
  this.totalFats = this.foodItems.reduce((sum, item) => sum + (item.fats || 0), 0);
  next();
});

module.exports = mongoose.model('MealLog', mealLogSchema);
