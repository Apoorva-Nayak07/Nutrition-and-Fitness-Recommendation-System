import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Activity } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { getGoalLabel, getActivityLabel, getDietLabel, getBMICategory } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
    targetWeight: user?.targetWeight || '',
    activityLevel: user?.activityLevel || '',
    fitnessGoal: user?.fitnessGoal || '',
    dietPreference: user?.dietPreference || '',
    workoutExperience: user?.workoutExperience || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const bmiCategory = user?.bmi ? getBMICategory(user.bmi) : null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your personal information and fitness preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card lg:col-span-1"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user?.email}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">BMI</span>
                <span className={`font-semibold ${bmiCategory?.color || 'text-gray-900 dark:text-white'}`}>
                  {user?.bmi || 'N/A'} {bmiCategory && `(${bmiCategory.label})`}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">BMR</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user?.bmr || 'N/A'} cal
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">TDEE</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user?.tdee || 'N/A'} cal
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 dark:text-gray-400">Target Calories</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {user?.targetCalories || 'N/A'} cal
                </span>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card lg:col-span-2"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Current Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Target Weight (kg)</label>
                  <input
                    type="number"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Activity Level</label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly_active">Lightly Active</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="very_active">Very Active</option>
                    <option value="extra_active">Extra Active</option>
                  </select>
                </div>

                <div>
                  <label className="label">Fitness Goal</label>
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="weight_gain">Weight Gain</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="label">Diet Preference</label>
                  <select
                    name="dietPreference"
                    value={formData.dietPreference}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="high_protein">High Protein</option>
                    <option value="low_carb">Low Carb</option>
                    <option value="balanced">Balanced</option>
                  </select>
                </div>

                <div>
                  <label className="label">Workout Experience</label>
                  <select
                    name="workoutExperience"
                    value={formData.workoutExperience}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
