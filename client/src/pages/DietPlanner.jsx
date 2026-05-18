import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, RefreshCw, Droplet, Info } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { dietAPI } from '../services/api';
import toast from 'react-hot-toast';

const DietPlanner = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await dietAPI.generatePlan();
      setDietPlan(response.data.data);
      toast.success('Diet plan generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dietPlan) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Generating your personalized diet plan...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const meals = dietPlan?.meals || {};

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Diet Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your personalized nutrition plan
            </p>
          </div>
          <button
            onClick={generatePlan}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Regenerate Plan
          </button>
        </div>

        {/* Calorie Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm opacity-90">Daily Target</p>
              <p className="text-3xl font-bold mt-2">{dietPlan?.targetCalories || 0}</p>
              <p className="text-sm opacity-90">calories</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Protein</p>
              <p className="text-3xl font-bold mt-2">{dietPlan?.targetMacros?.protein || 0}g</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Carbs</p>
              <p className="text-3xl font-bold mt-2">{dietPlan?.targetMacros?.carbs || 0}g</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Fats</p>
              <p className="text-3xl font-bold mt-2">{dietPlan?.targetMacros?.fats || 0}g</p>
            </div>
          </div>
        </motion.div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(meals).map(([mealType, meal], index) => (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                  {mealType}
                </h3>
                <Utensils className="w-5 h-5 text-primary-600" />
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">
                    {meal.name}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Calories:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-2">
                        {meal.calories}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Protein:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-2">
                        {meal.protein}g
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Carbs:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-2">
                        {meal.carbs}g
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Fats:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-2">
                        {meal.fats}g
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Target: {meal.targetCalories} calories
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hydration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daily Hydration Goal
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {dietPlan?.hydration?.target || 0} liters
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Stay hydrated throughout the day for optimal performance
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Nutrition Tips
            </h3>
          </div>
          <ul className="space-y-2">
            {dietPlan?.tips?.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-400">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DietPlanner;
