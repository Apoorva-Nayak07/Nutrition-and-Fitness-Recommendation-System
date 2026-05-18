# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Endpoints

### Authentication

#### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profileCompleted": false
    },
    "token": "jwt_token"
  }
}
```

#### Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profileCompleted": true
    },
    "token": "jwt_token"
  }
}
```

#### Get Current User

Get the authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "targetWeight": 65,
    "bmi": 22.9,
    "bmr": 1650,
    "tdee": 2280,
    "targetCalories": 1780,
    "activityLevel": "moderately_active",
    "fitnessGoal": "weight_loss",
    "dietPreference": "balanced",
    "workoutExperience": "intermediate"
  }
}
```

#### Update Profile

Update user's health profile.

**Endpoint:** `PUT /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "targetWeight": 65,
  "activityLevel": "moderately_active",
  "fitnessGoal": "weight_loss",
  "dietPreference": "balanced",
  "workoutExperience": "intermediate",
  "allergies": ["peanuts"],
  "restrictions": ["gluten-free"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Diet Planning

#### Generate Diet Plan

Generate a personalized diet plan based on user profile.

**Endpoint:** `POST /diet/generate`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "targetCalories": 1780,
    "targetMacros": {
      "protein": 133,
      "carbs": 178,
      "fats": 59
    },
    "meals": {
      "breakfast": {
        "name": "Oatmeal with fruits",
        "calories": 300,
        "protein": 10,
        "carbs": 50,
        "fats": 8,
        "targetCalories": 445
      },
      "lunch": { ... },
      "dinner": { ... },
      "snacks": { ... }
    },
    "hydration": {
      "target": 2.3,
      "unit": "liters"
    },
    "tips": [ ... ]
  }
}
```

#### Get Calorie Prediction

Get detailed calorie predictions and recommendations.

**Endpoint:** `GET /diet/calories`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "bmr": 1650,
    "tdee": 2280,
    "targetCalories": 1780,
    "bmi": 22.9,
    "breakdown": {
      "weightLoss": 1780,
      "maintenance": 2280,
      "weightGain": 2780,
      "muscleGain": 2580
    },
    "recommendations": [ ... ]
  }
}
```

#### Get Nutrition Recommendations

Get personalized nutrition recommendations.

**Endpoint:** `GET /diet/recommendations`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "dailyIntake": {
      "calories": 1780,
      "protein": 112,
      "carbs": 178,
      "fats": 59,
      "fiber": 25,
      "water": 2.3
    },
    "mealTiming": {
      "breakfast": "7:00 AM - 9:00 AM",
      "snack1": "10:30 AM - 11:00 AM",
      "lunch": "12:30 PM - 2:00 PM",
      "snack2": "4:00 PM - 5:00 PM",
      "dinner": "7:00 PM - 8:30 PM"
    },
    "supplements": [ ... ],
    "tips": [ ... ]
  }
}
```

### Workout Planning

#### Generate Workout Plan

Generate a personalized weekly workout plan.

**Endpoint:** `POST /workout/generate`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "experience": "intermediate",
    "goal": "weight_loss",
    "weeklyPlan": [
      {
        "day": "Monday",
        "type": "cardio",
        "exercises": [
          {
            "name": "Running",
            "duration": 30,
            "caloriesPerMin": 10,
            "difficulty": "moderate"
          }
        ],
        "estimatedCalories": 300
      },
      { ... }
    ],
    "tips": [ ... ],
    "progressionTips": [ ... ]
  }
}
```

#### Get Exercise Library

Get filtered exercise library.

**Endpoint:** `GET /workout/exercises?type=cardio&level=intermediate`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type` (optional): cardio, strength, yoga, hiit
- `level` (optional): beginner, intermediate, advanced

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "name": "Running",
      "duration": 30,
      "caloriesPerMin": 10,
      "difficulty": "moderate"
    },
    { ... }
  ]
}
```

#### Get Workout Recommendations

Get workout recommendations and guidelines.

**Endpoint:** `GET /workout/recommendations`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "weeklyGoal": {
      "cardio": "150-200 minutes",
      "strength": "2-3 sessions",
      "flexibility": "2-3 sessions",
      "rest": "1-2 days"
    },
    "intensityDistribution": {
      "low": "40%",
      "moderate": "40%",
      "high": "20%"
    },
    "tips": [ ... ]
  }
}
```

### Progress Tracking

#### Log Progress

Log weight and body measurements.

**Endpoint:** `POST /progress`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "weight": 70,
  "bodyFat": 15,
  "muscleMass": 55,
  "waterIntake": 2.5,
  "notes": "Feeling great today!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "progress_id",
    "user": "user_id",
    "date": "2024-01-01T00:00:00.000Z",
    "weight": 70,
    "bmi": 22.9,
    "waterIntake": 2.5,
    "notes": "Feeling great today!"
  }
}
```

#### Get Progress History

Get historical progress data.

**Endpoint:** `GET /progress?startDate=2024-01-01&endDate=2024-01-31&limit=30`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `limit` (optional): Number of records (default: 30)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

#### Get Analytics

Get comprehensive analytics dashboard data.

**Endpoint:** `GET /progress/analytics`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStats": {
      "weight": 70,
      "bmi": 22.9,
      "targetWeight": 65,
      "goalProgress": 50
    },
    "weeklyStats": {
      "caloriesConsumed": 12460,
      "caloriesBurned": 2100,
      "netCalories": 10360,
      "avgDailyCalories": 1780,
      "workoutsCompleted": 4,
      "weightChange": -0.5
    },
    "progressData": [ ... ],
    "mealData": [ ... ],
    "workoutData": [ ... ]
  }
}
```

#### Log Meal

Log a meal with nutritional information.

**Endpoint:** `POST /progress/meal`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "mealType": "breakfast",
  "foodItems": [
    {
      "name": "Oatmeal",
      "quantity": 1,
      "unit": "cup",
      "calories": 300,
      "protein": 10,
      "carbs": 50,
      "fats": 8
    }
  ],
  "notes": "Delicious breakfast"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

#### Log Workout

Log a completed workout.

**Endpoint:** `POST /progress/workout`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "workoutType": "cardio",
  "exercises": [
    {
      "name": "Running",
      "duration": 30,
      "caloriesBurned": 300,
      "notes": "Great run!"
    }
  ],
  "completed": true,
  "notes": "Felt strong today"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### AI Assistant

#### Chat with AI

Send a message to the AI assistant.

**Endpoint:** `POST /ai/chat`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "What should I eat for breakfast?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "For breakfast, I recommend...",
    "category": "diet",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get AI Insights

Get personalized AI-generated insights.

**Endpoint:** `GET /ai/insights`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "success",
        "category": "nutrition",
        "message": "Great job! Your calorie intake is on track."
      },
      { ... }
    ],
    "disclaimer": "..."
  }
}
```

#### Get Weekly Summary

Get AI-generated weekly summary.

**Endpoint:** `GET /ai/summary`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "Last 7 days",
    "nutrition": {
      "totalCalories": 12460,
      "avgDailyCalories": 1780,
      "totalProtein": 784,
      "mealsLogged": 21
    },
    "fitness": {
      "workoutsCompleted": 4,
      "totalCaloriesBurned": 2100,
      "avgCaloriesPerWorkout": 525
    },
    "recommendations": [ ... ],
    "disclaimer": "..."
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

API requests are limited to:
- **Authenticated users:** 100 requests per minute
- **Unauthenticated users:** 20 requests per minute

## Pagination

For endpoints that return lists, use these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

## Filtering

Many endpoints support filtering:
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `type`: Filter by type
- `level`: Filter by level

## Best Practices

1. **Always include error handling** in your client code
2. **Store JWT tokens securely** (httpOnly cookies recommended)
3. **Refresh tokens** before they expire
4. **Use HTTPS** in production
5. **Validate input** on the client side
6. **Handle rate limits** gracefully

## Examples

See the `examples/` directory for complete code examples in various languages.
