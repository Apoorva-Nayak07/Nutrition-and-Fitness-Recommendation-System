import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Utensils, Dumbbell } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { progressAPI } from '../services/api';
import toast from 'react-hot-toast';

const Progress = () => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState('progress'); // progress, meal, workout
  const [formData, setFormData] = useState({
    weight: '',
    waterIntake: '',
    notes: '',
    mealType: 'breakfast',
    foodItems: [{ name: '', calories: '', protein: '', carbs: '', fats: '' }],
    workoutType: 'cardio',
    exercises: [{ name: '', duration: '', caloriesBurned: '' }],
  });

  const handleLogProgress = async () => {
    try {
      await progressAPI.logProgress({
        weight: parseFloat(formData.weight),
        waterIntake: parseFloat(formData.waterIntake),
        notes: formData.notes,
      });
      toast.success('Progress logged successfully!');
      setShowLogModal(false);
      setFormData({ ...formData, weight: '', waterIntake: '', notes: '' });
    } catch (error) {
      toast.error('Failed to log progress');
    }
  };

  const handleLogMeal = async () => {
    try {
      await progressAPI.logMeal({
        mealType: formData.mealType,
        foodItems: formData.foodItems.map(item => ({
          ...item,
          calories: parseFloat(item.calories),
          protein: parseFloat(item.protein),
          carbs: parseFloat(item.carbs),
          fats: parseFloat(item.fats),
        })),
      });
      toast.success('Meal logged successfully!');
      setShowLogModal(false);
    } catch (error) {
      toast.error('Failed to log meal');
    }
  };

  const handleLogWorkout = async () => {
    try {
      await progressAPI.logWorkout({
        workoutType: formData.workoutType,
        exercises: formData.exercises.map(ex => ({
          ...ex,
          duration: parseFloat(ex.duration),
          caloriesBurned: parseFloat(ex.caloriesBurned),
        })),
        completed: true,
      });
      toast.success('Workout logged successfully!');
      setShowLogModal(false);
    } catch (error) {
      toast.error('Failed to log workout');
    }
  };

  const openLogModal = (type) => {
    setLogType(type);
    setShowLogModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Progress Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Log and monitor your fitness journey
            </p>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => openLogModal('progress')}
            className="card hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Log Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Weight & measurements
                </p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => openLogModal('meal')}
            className="card hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                <Utensils className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Log Meal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your nutrition
                </p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => openLogModal('workout')}
            className="card hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                <Dumbbell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Log Workout
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Record your exercise
                </p>
              </div>
              <Plus className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </motion.button>
        </div>

        {/* Recent Activity Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Start logging your progress to see your activity here
            </p>
          </div>
        </motion.div>

        {/* Log Modal */}
        {showLogModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {logType === 'progress' && 'Log Progress'}
                {logType === 'meal' && 'Log Meal'}
                {logType === 'workout' && 'Log Workout'}
              </h3>

              {logType === 'progress' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="input"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="label">Water Intake (liters)</label>
                    <input
                      type="number"
                      value={formData.waterIntake}
                      onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                      className="input"
                      placeholder="2.5"
                    />
                  </div>
                  <div>
                    <label className="label">Notes (optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input"
                      rows="3"
                      placeholder="How are you feeling today?"
                    />
                  </div>
                </div>
              )}

              {logType === 'meal' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Meal Type</label>
                    <select
                      value={formData.mealType}
                      onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                      className="input"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Food Item</label>
                    <input
                      type="text"
                      value={formData.foodItems[0].name}
                      onChange={(e) => {
                        const items = [...formData.foodItems];
                        items[0].name = e.target.value;
                        setFormData({ ...formData, foodItems: items });
                      }}
                      className="input"
                      placeholder="Grilled chicken"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Calories</label>
                      <input
                        type="number"
                        value={formData.foodItems[0].calories}
                        onChange={(e) => {
                          const items = [...formData.foodItems];
                          items[0].calories = e.target.value;
                          setFormData({ ...formData, foodItems: items });
                        }}
                        className="input"
                        placeholder="300"
                      />
                    </div>
                    <div>
                      <label className="label">Protein (g)</label>
                      <input
                        type="number"
                        value={formData.foodItems[0].protein}
                        onChange={(e) => {
                          const items = [...formData.foodItems];
                          items[0].protein = e.target.value;
                          setFormData({ ...formData, foodItems: items });
                        }}
                        className="input"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {logType === 'workout' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Workout Type</label>
                    <select
                      value={formData.workoutType}
                      onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
                      className="input"
                    >
                      <option value="cardio">Cardio</option>
                      <option value="strength">Strength</option>
                      <option value="yoga">Yoga</option>
                      <option value="hiit">HIIT</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Exercise Name</label>
                    <input
                      type="text"
                      value={formData.exercises[0].name}
                      onChange={(e) => {
                        const exercises = [...formData.exercises];
                        exercises[0].name = e.target.value;
                        setFormData({ ...formData, exercises });
                      }}
                      className="input"
                      placeholder="Running"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Duration (min)</label>
                      <input
                        type="number"
                        value={formData.exercises[0].duration}
                        onChange={(e) => {
                          const exercises = [...formData.exercises];
                          exercises[0].duration = e.target.value;
                          setFormData({ ...formData, exercises });
                        }}
                        className="input"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="label">Calories Burned</label>
                      <input
                        type="number"
                        value={formData.exercises[0].caloriesBurned}
                        onChange={(e) => {
                          const exercises = [...formData.exercises];
                          exercises[0].caloriesBurned = e.target.value;
                          setFormData({ ...formData, exercises });
                        }}
                        className="input"
                        placeholder="300"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowLogModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (logType === 'progress') handleLogProgress();
                    else if (logType === 'meal') handleLogMeal();
                    else if (logType === 'workout') handleLogWorkout();
                  }}
                  className="btn-primary flex-1"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Progress;
