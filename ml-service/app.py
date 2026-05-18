from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from models.calorie_predictor import CaloriePredictor
from models.recommendation_engine import RecommendationEngine

app = FastAPI(title="FitAI ML Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
calorie_predictor = CaloriePredictor()
recommendation_engine = RecommendationEngine()

# Request models
class UserProfile(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    activity_level: str
    fitness_goal: str

class CaloriePredictionRequest(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    activity_level: str

class DietRecommendationRequest(BaseModel):
    target_calories: int
    diet_preference: str
    fitness_goal: str
    allergies: Optional[List[str]] = []

class WorkoutRecommendationRequest(BaseModel):
    fitness_goal: str
    experience_level: str
    available_time: int
    equipment: Optional[str] = "bodyweight"

@app.get("/")
def read_root():
    return {
        "message": "FitAI ML Service API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict/calories")
def predict_calories(request: CaloriePredictionRequest):
    """
    Predict daily calorie requirements using ML model
    """
    try:
        prediction = calorie_predictor.predict(
            age=request.age,
            gender=request.gender,
            height=request.height,
            weight=request.weight,
            activity_level=request.activity_level
        )
        
        return {
            "success": True,
            "data": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/diet")
def recommend_diet(request: DietRecommendationRequest):
    """
    Generate personalized diet recommendations
    """
    try:
        recommendations = recommendation_engine.recommend_diet(
            target_calories=request.target_calories,
            diet_preference=request.diet_preference,
            fitness_goal=request.fitness_goal,
            allergies=request.allergies
        )
        
        return {
            "success": True,
            "data": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/workout")
def recommend_workout(request: WorkoutRecommendationRequest):
    """
    Generate personalized workout recommendations
    """
    try:
        recommendations = recommendation_engine.recommend_workout(
            fitness_goal=request.fitness_goal,
            experience_level=request.experience_level,
            available_time=request.available_time,
            equipment=request.equipment
        )
        
        return {
            "success": True,
            "data": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/user")
def analyze_user(profile: UserProfile):
    """
    Comprehensive user analysis and recommendations
    """
    try:
        # Calculate BMR
        bmr = calorie_predictor.calculate_bmr(
            age=profile.age,
            gender=profile.gender,
            height=profile.height,
            weight=profile.weight
        )
        
        # Calculate TDEE
        tdee = calorie_predictor.calculate_tdee(bmr, profile.activity_level)
        
        # Calculate target calories
        target_calories = calorie_predictor.calculate_target_calories(
            tdee, profile.fitness_goal
        )
        
        # Calculate BMI
        bmi = profile.weight / ((profile.height / 100) ** 2)
        
        analysis = {
            "bmr": round(bmr),
            "tdee": round(tdee),
            "target_calories": round(target_calories),
            "bmi": round(bmi, 1),
            "recommendations": []
        }
        
        # Add recommendations based on BMI
        if bmi < 18.5:
            analysis["recommendations"].append("Consider increasing calorie intake")
        elif bmi >= 25:
            analysis["recommendations"].append("Consider a calorie deficit with exercise")
        else:
            analysis["recommendations"].append("Maintain your current healthy lifestyle")
        
        return {
            "success": True,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
