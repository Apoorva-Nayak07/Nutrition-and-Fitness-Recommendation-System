const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  // Health Profile
  age: {
    type: Number,
    min: 10,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number, // in cm
    min: 50,
    max: 300
  },
  weight: {
    type: Number, // in kg
    min: 20,
    max: 500
  },
  targetWeight: {
    type: Number,
    min: 20,
    max: 500
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
    default: 'sedentary'
  },
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'general_fitness'],
    default: 'maintenance'
  },
  dietPreference: {
    type: String,
    enum: ['vegetarian', 'non_vegetarian', 'vegan', 'high_protein', 'low_carb', 'balanced'],
    default: 'balanced'
  },
  allergies: [{
    type: String
  }],
  restrictions: [{
    type: String
  }],
  workoutExperience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  // Calculated Metrics
  bmr: Number, // Basal Metabolic Rate
  tdee: Number, // Total Daily Energy Expenditure
  targetCalories: Number,
  bmi: Number,
  // Profile Status
  profileCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate BMR using Mifflin-St Jeor Equation
userSchema.methods.calculateBMR = function() {
  if (!this.weight || !this.height || !this.age || !this.gender) {
    return null;
  }
  
  let bmr;
  if (this.gender === 'male') {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5;
  } else {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161;
  }
  
  return Math.round(bmr);
};

// Calculate TDEE (Total Daily Energy Expenditure)
userSchema.methods.calculateTDEE = function() {
  const bmr = this.calculateBMR();
  if (!bmr) return null;
  
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  
  const multiplier = activityMultipliers[this.activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

// Calculate target calories based on fitness goal
userSchema.methods.calculateTargetCalories = function() {
  const tdee = this.calculateTDEE();
  if (!tdee) return null;
  
  const goalAdjustments = {
    weight_loss: -500,
    weight_gain: 500,
    muscle_gain: 300,
    maintenance: 0,
    general_fitness: 0
  };
  
  const adjustment = goalAdjustments[this.fitnessGoal] || 0;
  return Math.round(tdee + adjustment);
};

// Calculate BMI
userSchema.methods.calculateBMI = function() {
  if (!this.weight || !this.height) return null;
  
  const heightInMeters = this.height / 100;
  const bmi = this.weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

// Update all calculated metrics
userSchema.methods.updateMetrics = function() {
  this.bmr = this.calculateBMR();
  this.tdee = this.calculateTDEE();
  this.targetCalories = this.calculateTargetCalories();
  this.bmi = this.calculateBMI();
};

module.exports = mongoose.model('User', userSchema);
