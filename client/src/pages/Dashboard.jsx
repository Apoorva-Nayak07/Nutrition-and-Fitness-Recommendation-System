import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Flame,
  Utensils,
  Dumbbell,
  Target,
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import { progressAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await progressAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      label: 'Current Weight',
      value: `${analytics?.currentStats?.weight || user?.weight || 0} kg`,
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: analytics?.weeklyStats?.weightChange || 0,
    },
    {
      label: 'BMI',
      value: analytics?.currentStats?.bmi || user?.bmi || 0,
      icon: <Target className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Calories This Week',
      value: analytics?.weeklyStats?.caloriesConsumed || 0,
      icon: <Flame className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      label: 'Workouts Completed',
      value: analytics?.weeklyStats?.workoutsCompleted || 0,
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
  ];

  const macroData = [
    { name: 'Protein', value: 30, color: '#3b82f6' },
    { name: 'Carbs', value: 40, color: '#22c55e' },
    { name: 'Fats', value: 30, color: '#f59e0b' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's your fitness overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  {stat.change !== undefined && (
                    <div className="flex items-center mt-2">
                      {stat.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : stat.change < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      ) : null}
                      <span
                        className={`text-sm ${
                          stat.change > 0
                            ? 'text-green-500'
                            : stat.change < 0
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {Math.abs(stat.change).toFixed(1)} kg
                      </span>
                    </div>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weight Progress
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics?.progressData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Macro Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Macro Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {macroData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Goal Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Weight Goal
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analytics?.currentStats?.goalProgress || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics?.currentStats?.goalProgress || 0}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {analytics?.currentStats?.weight || user?.weight} kg
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Target</p>
                <p className="text-xl font-bold text-primary-600">
                  {analytics?.currentStats?.targetWeight || user?.targetWeight} kg
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.abs((analytics?.currentStats?.weight || user?.weight || 0) - (analytics?.currentStats?.targetWeight || user?.targetWeight || 0)).toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <a
            href="/diet"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <Utensils className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  View Diet Plan
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check your meal recommendations
                </p>
              </div>
            </div>
          </a>

          <a
            href="/workout"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                <Dumbbell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Workout Plan
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See today's exercises
                </p>
              </div>
            </div>
          </a>

          <a
            href="/ai-assistant"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  AI Assistant
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get personalized advice
                </p>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
