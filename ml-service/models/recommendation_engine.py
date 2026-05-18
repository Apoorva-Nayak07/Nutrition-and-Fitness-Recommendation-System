import random
from typing import Dict, List

class RecommendationEngine:
    """
    Recommendation engine for diet and workout plans
    """
    
    def __init__(self):
        self.diet_database = self._load_diet_database()
        self.workout_database = self._load_workout_database()
    
    def _load_diet_database(self) -> Dict:
        """Load diet recommendations database"""
        return {
            'vegetarian': {
                'high_protein': ['Paneer', 'Tofu', 'Lentils', 'Greek Yogurt', 'Quinoa'],
                'balanced': ['Brown Rice', 'Vegetables', 'Fruits', 'Nuts', 'Seeds'],
                'low_carb': ['Cauliflower Rice', 'Zucchini Noodles', 'Leafy Greens']
            },
            'non_vegetarian': {
                'high_protein': ['Chicken Breast', 'Fish', 'Eggs', 'Turkey', 'Lean Beef'],
                'balanced': ['Grilled Chicken', 'Brown Rice', 'Vegetables', 'Fruits'],
                'low_carb': ['Grilled Fish', 'Chicken Salad', 'Egg White Omelet']
            }
        }
    
    def _load_workout_database(self) -> Dict:
        """Load workout recommendations database"""
        return {
            'beginner': {
                'weight_loss': ['Walking', 'Light Jogging', 'Bodyweight Exercises'],
                'muscle_gain': ['Bodyweight Squats', 'Push-ups', 'Lunges'],
                'general_fitness': ['Yoga', 'Stretching', 'Light Cardio']
            },
            'intermediate': {
                'weight_loss': ['Running', 'HIIT', 'Cycling'],
                'muscle_gain': ['Weight Training', 'Compound Exercises', 'Progressive Overload'],
                'general_fitness': ['Mixed Cardio', 'Strength Training', 'Flexibility Work']
            },
            'advanced': {
                'weight_loss': ['Sprint Intervals', 'Advanced HIIT', 'Endurance Training'],
                'muscle_gain': ['Heavy Lifting', 'Advanced Splits', 'Periodization'],
                'general_fitness': ['CrossFit', 'Athletic Training', 'Sport-Specific']
            }
        }
    
    def recommend_diet(self, target_calories: int, diet_preference: str, 
                      fitness_goal: str, allergies: List[str] = []) -> Dict:
        """
        Generate personalized diet recommendations
        """
        # Determine diet type based on goal
        if fitness_goal in ['muscle_gain', 'weight_gain']:
            diet_type = 'high_protein'
        elif fitness_goal == 'weight_loss':
            diet_type = 'balanced'
        else:
            diet_type = 'balanced'
        
        # Get food recommendations
        pref = 'vegetarian' if diet_preference in ['vegetarian', 'vegan'] else 'non_vegetarian'
        foods = self.diet_database.get(pref, {}).get(diet_type, [])
        
        # Filter out allergies
        if allergies:
            foods = [f for f in foods if not any(a.lower() in f.lower() for a in allergies)]
        
        # Calculate meal distribution
        meal_distribution = {
            'breakfast': 0.25,
            'lunch': 0.35,
            'dinner': 0.30,
            'snacks': 0.10
        }
        
        recommendations = {
            'target_calories': target_calories,
            'meal_plan': {},
            'foods_to_include': random.sample(foods, min(5, len(foods))),
            'tips': [
                'Eat protein with every meal',
                'Stay hydrated throughout the day',
                'Include colorful vegetables',
                'Avoid processed foods',
                'Plan your meals in advance'
            ]
        }
        
        for meal, percentage in meal_distribution.items():
            recommendations['meal_plan'][meal] = {
                'calories': round(target_calories * percentage),
                'timing': self._get_meal_timing(meal)
            }
        
        return recommendations
    
    def recommend_workout(self, fitness_goal: str, experience_level: str,
                         available_time: int, equipment: str = 'bodyweight') -> Dict:
        """
        Generate personalized workout recommendations
        """
        # Get workout recommendations
        workouts = self.workout_database.get(experience_level, {}).get(
            fitness_goal, ['General Exercise']
        )
        
        # Calculate workout split
        if available_time >= 60:
            sessions_per_week = 5
        elif available_time >= 45:
            sessions_per_week = 4
        else:
            sessions_per_week = 3
        
        recommendations = {
            'experience_level': experience_level,
            'fitness_goal': fitness_goal,
            'sessions_per_week': sessions_per_week,
            'session_duration': available_time,
            'recommended_exercises': workouts,
            'weekly_structure': self._generate_weekly_structure(
                sessions_per_week, fitness_goal
            ),
            'tips': [
                'Always warm up before exercising',
                'Focus on proper form',
                'Progressive overload is key',
                'Get adequate rest between sessions',
                'Stay consistent with your routine'
            ]
        }
        
        return recommendations
    
    def _get_meal_timing(self, meal: str) -> str:
        """Get recommended meal timing"""
        timings = {
            'breakfast': '7:00 AM - 9:00 AM',
            'lunch': '12:00 PM - 2:00 PM',
            'dinner': '7:00 PM - 9:00 PM',
            'snacks': '3:00 PM - 5:00 PM'
        }
        return timings.get(meal, 'Flexible')
    
    def _generate_weekly_structure(self, sessions: int, goal: str) -> List[Dict]:
        """Generate weekly workout structure"""
        if goal == 'weight_loss':
            focus = ['Cardio', 'HIIT', 'Full Body', 'Cardio', 'Active Recovery']
        elif goal == 'muscle_gain':
            focus = ['Upper Body', 'Lower Body', 'Rest', 'Push', 'Pull', 'Legs', 'Rest']
        else:
            focus = ['Full Body', 'Cardio', 'Strength', 'Flexibility', 'Active Recovery']
        
        return [{'day': i+1, 'focus': focus[i % len(focus)]} for i in range(sessions)]
