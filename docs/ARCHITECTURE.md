# Architecture Overview

## System Architecture

FitAI follows a modern microservices architecture with three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (React + Tailwind CSS)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway/NGINX                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌──────────────────────────┐
│    Backend API Server     │   │    ML Service (Python)   │
│   (Node.js + Express)     │   │       (FastAPI)          │
└───────────────────────────┘   └──────────────────────────┘
                │
                ▼
┌───────────────────────────┐
│   Database (MongoDB)      │
└───────────────────────────┘
```

## Component Details

### 1. Frontend (Client)

**Technology Stack:**
- React 18
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand
- Axios
- React Router

**Key Features:**
- Single Page Application (SPA)
- Component-based architecture
- State management with Zustand
- Responsive design
- Dark mode support
- Real-time data visualization

**Directory Structure:**
```
client/src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── layouts/        # Layout wrappers
├── services/       # API service layer
├── store/          # State management
├── utils/          # Helper functions
└── hooks/          # Custom React hooks
```

### 2. Backend API Server

**Technology Stack:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

**Architecture Pattern:** MVC (Model-View-Controller)

**Key Features:**
- RESTful API design
- JWT authentication
- Input validation
- Error handling middleware
- Logging
- CORS support

**Directory Structure:**
```
server/
├── config/         # Configuration files
├── controllers/    # Business logic
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Service layer
└── utils/          # Utility functions
```

**API Layers:**

1. **Routes Layer**
   - Defines API endpoints
   - Maps URLs to controllers
   - Applies middleware

2. **Controller Layer**
   - Handles HTTP requests/responses
   - Validates input
   - Calls service layer
   - Returns formatted responses

3. **Service Layer**
   - Business logic
   - Data processing
   - External API calls

4. **Model Layer**
   - Database schema
   - Data validation
   - Query methods

### 3. ML Service

**Technology Stack:**
- Python 3.11
- FastAPI
- NumPy
- Pandas
- Scikit-learn

**Key Features:**
- Calorie prediction
- Diet recommendations
- Workout recommendations
- User analysis

**ML Models:**

1. **Calorie Predictor**
   - Mifflin-St Jeor equation
   - Activity multipliers
   - Goal-based adjustments

2. **Recommendation Engine**
   - Content-based filtering
   - User profile matching
   - Preference-based suggestions

**Directory Structure:**
```
ml-service/
├── models/         # ML models
├── routes/         # API routes
├── utils/          # Helper functions
└── preprocessing/  # Data preprocessing
```

### 4. Database (MongoDB)

**Collections:**

1. **users**
   - User authentication
   - Health profile
   - Calculated metrics

2. **meallogs**
   - Meal entries
   - Nutritional data
   - Timestamps

3. **workoutlogs**
   - Workout entries
   - Exercise details
   - Calories burned

4. **progress**
   - Weight tracking
   - Body measurements
   - Progress photos

**Indexes:**
- User email (unique)
- User ID + date (compound)
- Timestamps

## Data Flow

### Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token
   ↓
4. Token sent to client
   ↓
5. Client stores token
   ↓
6. Token included in subsequent requests
   ↓
7. Backend validates token
   ↓
8. Request processed
```

### Diet Plan Generation Flow

```
1. User requests diet plan
   ↓
2. Backend fetches user profile
   ↓
3. Backend calculates target calories
   ↓
4. Backend calls ML service (optional)
   ↓
5. ML service generates recommendations
   ↓
6. Backend formats response
   ↓
7. Client displays diet plan
```

### Progress Tracking Flow

```
1. User logs data (weight/meal/workout)
   ↓
2. Backend validates data
   ↓
3. Backend saves to database
   ↓
4. Backend updates user metrics
   ↓
5. Backend returns confirmation
   ↓
6. Client updates UI
```

## Security Architecture

### Authentication & Authorization

- **JWT Tokens:** Stateless authentication
- **Password Hashing:** bcrypt with salt rounds
- **Token Expiration:** 7 days default
- **Protected Routes:** Middleware validation

### Data Security

- **Input Validation:** Express-validator
- **SQL Injection Prevention:** Mongoose ODM
- **XSS Protection:** Sanitized inputs
- **CORS:** Configured origins
- **Rate Limiting:** Prevent abuse

### Environment Security

- **Environment Variables:** Sensitive data
- **Secrets Management:** Not in version control
- **HTTPS:** Encrypted communication
- **Database Access:** Restricted IPs

## Scalability Considerations

### Horizontal Scaling

- **Stateless Backend:** Easy to replicate
- **Load Balancing:** NGINX or cloud LB
- **Database Replication:** MongoDB replica sets
- **Caching:** Redis for sessions

### Vertical Scaling

- **Resource Optimization:** Efficient queries
- **Connection Pooling:** Database connections
- **Lazy Loading:** Frontend optimization
- **Code Splitting:** Reduced bundle size

### Performance Optimization

**Frontend:**
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

**Backend:**
- Database indexing
- Query optimization
- Response compression
- Caching layer

**Database:**
- Proper indexing
- Query optimization
- Connection pooling
- Sharding (if needed)

## Monitoring & Logging

### Application Monitoring

- **Health Checks:** /health endpoints
- **Error Tracking:** Centralized logging
- **Performance Metrics:** Response times
- **Resource Usage:** CPU, memory, disk

### Logging Strategy

**Levels:**
- ERROR: Critical issues
- WARN: Potential problems
- INFO: General information
- DEBUG: Detailed debugging

**Log Storage:**
- Local files (development)
- Cloud logging (production)
- Log aggregation services

## Deployment Architecture

### Development

```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:5000)
├── ML Service (localhost:8000)
└── MongoDB (localhost:27017)
```

### Production

```
Cloud Infrastructure
├── Frontend (CDN + Static Hosting)
├── Backend (Container/VM)
├── ML Service (Container/VM)
├── Database (Managed MongoDB)
└── Load Balancer
```

## API Design Principles

1. **RESTful:** Standard HTTP methods
2. **Versioning:** /api/v1/...
3. **Consistent:** Uniform response format
4. **Documented:** OpenAPI/Swagger
5. **Secure:** Authentication required
6. **Validated:** Input validation
7. **Error Handling:** Meaningful messages

## Technology Choices

### Why React?

- Component reusability
- Large ecosystem
- Virtual DOM performance
- Strong community support

### Why Node.js?

- JavaScript everywhere
- Non-blocking I/O
- NPM ecosystem
- Easy scaling

### Why MongoDB?

- Flexible schema
- JSON-like documents
- Horizontal scaling
- Rich query language

### Why FastAPI?

- High performance
- Automatic documentation
- Type hints
- Async support

## Future Architecture Enhancements

1. **Microservices:** Split into smaller services
2. **Message Queue:** RabbitMQ/Kafka for async tasks
3. **Caching Layer:** Redis for performance
4. **CDN:** Static asset delivery
5. **GraphQL:** Alternative to REST
6. **WebSockets:** Real-time features
7. **Serverless:** AWS Lambda functions
8. **Container Orchestration:** Kubernetes

## Disaster Recovery

### Backup Strategy

- **Database:** Daily automated backups
- **Code:** Git version control
- **Configuration:** Documented and versioned
- **Media:** Cloud storage with redundancy

### Recovery Plan

1. Identify issue
2. Assess impact
3. Restore from backup
4. Verify functionality
5. Post-mortem analysis

## Compliance & Standards

- **GDPR:** Data privacy compliance
- **HIPAA:** Health data considerations
- **WCAG:** Accessibility standards
- **Security:** OWASP best practices

## Conclusion

This architecture provides:
- **Scalability:** Easy to scale horizontally
- **Maintainability:** Clear separation of concerns
- **Security:** Multiple layers of protection
- **Performance:** Optimized at each layer
- **Flexibility:** Easy to extend and modify
