import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, TrendingUp, Utensils, Dumbbell, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized diet and workout plans powered by advanced AI algorithms',
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Smart Nutrition Planning',
      description: 'Customized meal plans based on your goals, preferences, and dietary restrictions',
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: 'Workout Programs',
      description: 'Tailored exercise routines that match your fitness level and objectives',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Progress Tracking',
      description: 'Monitor your journey with detailed analytics and visual progress charts',
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Calorie Prediction',
      description: 'Accurate BMR and TDEE calculations to optimize your nutrition',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Health Insights',
      description: 'AI-driven insights and recommendations to improve your wellness',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your AI-Powered
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              {' '}Fitness Companion
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Transform your health journey with personalized nutrition plans, smart workout routines,
            and AI-driven insights tailored just for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 border-2 border-gray-200 dark:border-gray-700"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '50K+', label: 'Workouts Completed' },
            { value: '100K+', label: 'Meals Planned' },
            { value: '4.9/5', label: 'User Rating' },
          ].map((stat, index) => (
            <div key={index} className="p-6">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users achieving their fitness goals with FitAI
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 inline-block"
          >
            Start Your Journey Today
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
