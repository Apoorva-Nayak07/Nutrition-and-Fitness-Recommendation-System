import numpy as np
from typing import Dict

class CaloriePredictor:
    """
    ML-based calorie prediction model using Mifflin-St Jeor equation
    and activity multipliers
    """
    
    def __init__(self):
        self.activity_multipliers = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9
        }
        
        self.goal_adjustments = {
            'weight_loss': -500,
            'weight_gain': 500,
            'muscle_gain': 300,
            'maintenance': 0,
            'general_fitness': 0
        }
    
    def calculate_bmr(self, age: int, gender: str, height: float, weight: float) -> float:
        """
        Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
        
        Args:
            age: Age in years
            gender: 'male' or 'female'
            height: Height in cm
            weight: Weight in kg
        
        Returns:
            BMR in calories
        """
        if gender.lower() == 'male':
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
        
        return bmr
    
    def calculate_tdee(self, bmr: float, activity_level: str) -> float:
        """
        Calculate Total Daily Energy Expenditure
        
        Args:
            bmr: Basal Metabolic Rate
            activity_level: Activity level string
        
        Returns:
            TDEE in calories
        """
        multiplier = self.activity_multipliers.get(activity_level, 1.2)
        return bmr * multiplier
    
    def calculate_target_calories(self, tdee: float, fitness_goal: str) -> float:
        """
        Calculate target calories based on fitness goal
        
        Args:
            tdee: Total Daily Energy Expenditure
            fitness_goal: Fitness goal string
        
        Returns:
            Target calories
        """
        adjustment = self.goal_adjustments.get(fitness_goal, 0)
        return tdee + adjustment
    
    def predict(self, age: int, gender: str, height: float, weight: float, 
                activity_level: str) -> Dict:
        """
        Complete calorie prediction
        
        Returns:
            Dictionary with BMR, TDEE, and recommendations
        """
        bmr = self.calculate_bmr(age, gender, height, weight)
        tdee = self.calculate_tdee(bmr, activity_level)
        
        # Calculate for different goals
        predictions = {
            'bmr': round(bmr),
            'tdee': round(tdee),
            'goals': {
                'weight_loss': round(tdee - 500),
                'maintenance': round(tdee),
                'weight_gain': round(tdee + 500),
                'muscle_gain': round(tdee + 300)
            },
            'macros': self._calculate_macros(tdee)
        }
        
        return predictions
    
    def _calculate_macros(self, calories: float) -> Dict:
        """
        Calculate macro distribution
        """
        return {
            'protein': {
                'grams': round((calories * 0.30) / 4),
                'calories': round(calories * 0.30),
                'percentage': 30
            },
            'carbs': {
                'grams': round((calories * 0.40) / 4),
                'calories': round(calories * 0.40),
                'percentage': 40
            },
            'fats': {
                'grams': round((calories * 0.30) / 9),
                'calories': round(calories * 0.30),
                'percentage': 30
            }
        }
