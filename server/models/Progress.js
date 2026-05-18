const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
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
  weight: {
    type: Number,
    required: true
  },
  bmi: Number,
  bodyFat: Number,
  muscleMass: Number,
  waterIntake: {
    type: Number,
    default: 0 // in liters
  },
  notes: String,
  photos: [{
    url: String,
    type: String // front, side, back
  }]
}, {
  timestamps: true
});

// Index for efficient queries
progressSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
