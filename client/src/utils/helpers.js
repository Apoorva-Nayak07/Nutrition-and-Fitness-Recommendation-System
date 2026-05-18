// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format number with commas
export const formatNumber = (num) => {
  return num?.toLocaleString() || '0';
};

// Calculate BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
  return { label: 'Obese', color: 'text-red-600' };
};

// Get goal label
export const getGoalLabel = (goal) => {
  const labels = {
    weight_loss: 'Weight Loss',
    weight_gain: 'Weight Gain',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance',
    general_fitness: 'General Fitness',
  };
  return labels[goal] || goal;
};

// Get activity level label
export const getActivityLabel = (level) => {
  const labels = {
    sedentary: 'Sedentary',
    lightly_active: 'Lightly Active',
    moderately_active: 'Moderately Active',
    very_active: 'Very Active',
    extra_active: 'Extra Active',
  };
  return labels[level] || level;
};

// Get diet preference label
export const getDietLabel = (diet) => {
  const labels = {
    vegetarian: 'Vegetarian',
    non_vegetarian: 'Non-Vegetarian',
    vegan: 'Vegan',
    high_protein: 'High Protein',
    low_carb: 'Low Carb',
    balanced: 'Balanced',
  };
  return labels[diet] || diet;
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};
