import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    targetWeight: '',
    activityLevel: '',
    fitnessGoal: '',
    dietPreference: '',
    workoutExperience: '',
    allergies: [],
    restrictions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.data);
      toast.success('Profile completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Help us personalize your fitness journey
          </p>
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full ${
                  s <= step ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input"
                    placeholder="25"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="input"
                    placeholder="170"
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
                    placeholder="70"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Target Weight (kg)</label>
                <input
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  className="input"
                  placeholder="65"
                  required
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Fitness Goals */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Fitness Goals
              </h2>

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
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                  <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                  <option value="very_active">Very Active (6-7 days/week)</option>
                  <option value="extra_active">Extra Active (Athlete)</option>
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
            </motion.div>
          )}

          {/* Step 3: Diet Preferences */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Diet Preferences
              </h2>

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
                <label className="label">Allergies (Optional)</label>
                <input
                  type="text"
                  name="allergies"
                  className="input"
                  placeholder="e.g., Peanuts, Dairy (comma separated)"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                />
              </div>

              <div>
                <label className="label">Dietary Restrictions (Optional)</label>
                <input
                  type="text"
                  name="restrictions"
                  className="input"
                  placeholder="e.g., Gluten-free, Lactose-free (comma separated)"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      restrictions: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                />
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 rounded-lg font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 rounded-lg font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
