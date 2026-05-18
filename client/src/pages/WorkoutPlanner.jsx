import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, RefreshCw, Calendar, Flame, Info } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { workoutAPI } from '../services/api';
import toast from 'react-hot-toast';

const WorkoutPlanner = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await workoutAPI.generatePlan();
      setWorkoutPlan(response.data.data);
      toast.success('Workout plan generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !workoutPlan) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Creating your personalized workout plan...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const weeklyPlan = workoutPlan?.weeklyPlan || [];
  const currentDay = weeklyPlan[selectedDay];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Workout Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your personalized training program
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

        {/* Week Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Schedule
            </h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeklyPlan.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  selectedDay === index
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="text-xs font-medium">{day.day.slice(0, 3)}</div>
                <div className="text-xs mt-1 capitalize">{day.type}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Current Day Workout */}
        {currentDay && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Day Header */}
            <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{currentDay.day}</h2>
                  <p className="text-lg capitalize opacity-90 mt-1">
                    {currentDay.type} {currentDay.focus && `- ${currentDay.focus}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <Flame className="w-5 h-5 mr-2" />
                    <span className="text-2xl font-bold">
                      {currentDay.estimatedCalories || 0}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">calories burned</p>
                </div>
              </div>
            </div>

            {/* Exercises */}
            {currentDay.type === 'rest' ? (
              <div className="card text-center py-12">
                <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Rest Day
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Take this day to recover and let your muscles rebuild stronger
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {currentDay.exercises?.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {exercise.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {exercise.sets && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Sets:</span>
                              <span className="font-semibold text-gray-900 dark:text-white ml-2">
                                {exercise.sets}
                              </span>
                            </div>
                          )}
                          {exercise.reps && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Reps:</span>
                              <span className="font-semibold text-gray-900 dark:text-white ml-2">
                                {exercise.reps}
                              </span>
                            </div>
                          )}
                          {exercise.duration && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                              <span className="font-semibold text-gray-900 dark:text-white ml-2">
                                {exercise.duration} min
                              </span>
                            </div>
                          )}
                          {exercise.rest && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Rest:</span>
                              <span className="font-semibold text-gray-900 dark:text-white ml-2">
                                {exercise.rest}s
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="bg-orange-100 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                            {exercise.caloriesPerSet || exercise.caloriesPerMin || 0} cal
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Workout Tips
            </h3>
          </div>
          <ul className="space-y-2">
            {workoutPlan?.tips?.map((tip, index) => (
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

export default WorkoutPlanner;
