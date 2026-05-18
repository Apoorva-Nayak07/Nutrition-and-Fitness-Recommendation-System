const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
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
  workoutType: {
    type: String,
    enum: ['cardio', 'strength', 'yoga', 'hiit', 'sports', 'other'],
    required: true
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    duration: Number, // in minutes
    caloriesBurned: Number,
    notes: String
  }],
  totalDuration: {
    type: Number,
    default: 0
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
workoutLogSchema.pre('save', function(next) {
  this.totalDuration = this.exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
  this.totalCaloriesBurned = this.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
  next();
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
