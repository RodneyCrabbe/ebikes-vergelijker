# 📚 API Documentation

This document provides comprehensive API documentation for the E-Bike Platform.

## 🌐 Base URL
```
Development: http://127.0.0.1:5173/api
Production: https://ebike-platform.com/api
```

## 🔐 Authentication

### Authentication Methods
- **Session-based**: Cookie-based authentication
- **Token-based**: JWT tokens for API access
- **CSRF Protection**: Required for state-changing operations

### Headers
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
Content-Type: application/json
```

## 📊 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 1000 requests | 15 minutes |
| Authentication | 5 requests | 15 minutes |
| Search | 30 requests | 1 minute |
| Reviews | 10 requests | 1 hour |
| File Upload | 20 requests | 1 hour |

## 🚲 E-Bikes API

### Get All E-Bikes
```http
GET /api/ebikes
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `brand` (string): Filter by brand
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search query

**Response:**
```json
{
  "data": [
    {
      "id": "ebike-123",
      "model_name": "City Pro",
      "brand": "Test Brand",
      "price": 2500,
      "category": "city",
      "image_url": "/images/city-pro.jpg",
      "description": "Perfect for city commuting",
      "specifications": {
        "motor_power": "250W",
        "battery_capacity": "500Wh",
        "range": "50km",
        "weight": "25kg"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get E-Bike by ID
```http
GET /api/ebikes/{id}
```

**Response:**
```json
{
  "data": {
    "id": "ebike-123",
    "model_name": "City Pro",
    "brand": "Test Brand",
    "price": 2500,
    "category": "city",
    "image_url": "/images/city-pro.jpg",
    "description": "Perfect for city commuting",
    "specifications": {
      "motor_power": "250W",
      "battery_capacity": "500Wh",
      "range": "50km",
      "weight": "25kg"
    },
    "reviews": {
      "average_rating": 4.5,
      "total_reviews": 25
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Search E-Bikes
```http
GET /api/ebikes/search
```

**Query Parameters:**
- `q` (string, required): Search query
- `category` (string): Filter by category
- `brand` (string): Filter by brand
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sort` (string): Sort by (price, rating, name)
- `order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": "ebike-123",
      "model_name": "City Pro",
      "brand": "Test Brand",
      "price": 2500,
      "category": "city",
      "image_url": "/images/city-pro.jpg",
      "relevance_score": 0.95
    }
  ],
  "query": "city bike",
  "total": 15,
  "filters": {
    "categories": ["city", "commute"],
    "brands": ["Test Brand", "Another Brand"],
    "price_range": {
      "min": 1000,
      "max": 5000
    }
  }
}
```

## 👤 User API

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "phone": "+31612345678"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "session": {
      "id": "session-123",
      "expires_at": "2024-01-02T00:00:00Z"
    }
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "session": {
      "id": "session-123",
      "expires_at": "2024-01-02T00:00:00Z"
    }
  }
}
```

### Get User Profile
```http
GET /api/user/profile
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+31612345678",
    "preferences": {
      "riding_style": "city",
      "experience_level": "intermediate",
      "price_range_min": 1000,
      "price_range_max": 3000,
      "preferred_brands": ["Test Brand", "Another Brand"]
    },
    "stats": {
      "total_reviews": 5,
      "total_favorites": 12,
      "total_comparisons": 8
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile
```http
PUT /api/user/profile
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "full_name": "John Smith",
  "phone": "+31612345679",
  "preferences": {
    "riding_style": "mountain",
    "experience_level": "advanced",
    "price_range_min": 2000,
    "price_range_max": 5000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "full_name": "John Smith",
    "phone": "+31612345679",
    "preferences": {
      "riding_style": "mountain",
      "experience_level": "advanced",
      "price_range_min": 2000,
      "price_range_max": 5000
    },
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

## ⭐ Reviews API

### Get E-Bike Reviews
```http
GET /api/ebikes/{id}/reviews
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `rating` (number): Filter by rating (1-5)
- `sort` (string): Sort by (newest, oldest, helpful)

**Response:**
```json
{
  "data": [
    {
      "id": "review-123",
      "user": {
        "id": "user-123",
        "name": "John Doe",
        "avatar": "/images/avatars/user-123.jpg"
      },
      "rating": 5,
      "comment": "Great e-bike for city commuting!",
      "pros": "Smooth ride, good battery life",
      "cons": "A bit heavy",
      "helpful_count": 8,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "summary": {
    "average_rating": 4.5,
    "total_reviews": 25,
    "rating_distribution": {
      "5": 10,
      "4": 8,
      "3": 4,
      "2": 2,
      "1": 1
    }
  }
}
```

### Create Review
```http
POST /api/ebikes/{id}/reviews
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great e-bike for city commuting!",
  "pros": "Smooth ride, good battery life",
  "cons": "A bit heavy"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "review-123",
    "user": {
      "id": "user-123",
      "name": "John Doe"
    },
    "rating": 5,
    "comment": "Great e-bike for city commuting!",
    "pros": "Smooth ride, good battery life",
    "cons": "A bit heavy",
    "helpful_count": 0,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Vote on Review
```http
POST /api/reviews/{id}/vote
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "helpful": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "review_id": "review-123",
    "helpful_count": 9,
    "user_voted": true
  }
}
```

## ❤️ Favorites API

### Get User Favorites
```http
GET /api/user/favorites
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "favorite-123",
      "ebike": {
        "id": "ebike-123",
        "model_name": "City Pro",
        "brand": "Test Brand",
        "price": 2500,
        "image_url": "/images/city-pro.jpg"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 12
}
```

### Add to Favorites
```http
POST /api/user/favorites
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "ebike_id": "ebike-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "favorite-123",
    "ebike_id": "ebike-123",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Remove from Favorites
```http
DELETE /api/user/favorites/{id}
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

## 🔄 Comparison API

### Get Comparison
```http
GET /api/comparison
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "ebike-123",
      "model_name": "City Pro",
      "brand": "Test Brand",
      "price": 2500,
      "category": "city",
      "image_url": "/images/city-pro.jpg",
      "specifications": {
        "motor_power": "250W",
        "battery_capacity": "500Wh",
        "range": "50km",
        "weight": "25kg"
      }
    }
  ],
  "total": 2
}
```

### Add to Comparison
```http
POST /api/comparison
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "ebike_id": "ebike-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ebike_id": "ebike-123",
    "added_at": "2024-01-01T00:00:00Z"
  }
}
```

### Remove from Comparison
```http
DELETE /api/comparison/{ebike_id}
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from comparison"
}
```

## 📅 Appointments API

### Get User Appointments
```http
GET /api/user/appointments
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "appointment-123",
      "ebike": {
        "id": "ebike-123",
        "model_name": "City Pro",
        "brand": "Test Brand",
        "image_url": "/images/city-pro.jpg"
      },
      "date": "2024-01-15",
      "time": "14:00",
      "duration": 60,
      "location": "Test Store Amsterdam",
      "status": "confirmed",
      "notes": "Test ride appointment",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 3
}
```

### Create Appointment
```http
POST /api/appointments
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "ebike_id": "ebike-123",
  "date": "2024-01-15",
  "time": "14:00",
  "duration": 60,
  "location": "Test Store Amsterdam",
  "notes": "Test ride appointment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "appointment-123",
    "ebike_id": "ebike-123",
    "date": "2024-01-15",
    "time": "14:00",
    "duration": 60,
    "location": "Test Store Amsterdam",
    "status": "pending",
    "notes": "Test ride appointment",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 🔔 Notifications API

### Get User Notifications
```http
GET /api/user/notifications
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `unread_only` (boolean): Show only unread notifications

**Response:**
```json
{
  "data": [
    {
      "id": "notification-123",
      "type": "price_alert",
      "title": "Price Drop Alert",
      "message": "City Pro is now €2,300 (was €2,500)",
      "read": false,
      "data": {
        "ebike_id": "ebike-123",
        "old_price": 2500,
        "new_price": 2300
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  },
  "unread_count": 5
}
```

### Mark Notification as Read
```http
PUT /api/notifications/{id}/read
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notification-123",
    "read": true,
    "read_at": "2024-01-01T12:00:00Z"
  }
}
```

## 📊 Analytics API

### Get Analytics Data
```http
GET /api/analytics
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `start_date` (string): Start date (ISO format)
- `end_date` (string): End date (ISO format)
- `metric` (string): Metric type (page_views, conversions, etc.)

**Response:**
```json
{
  "data": {
    "page_views": {
      "total": 15000,
      "unique": 8500,
      "by_page": {
        "/": 5000,
        "/ebikes": 3000,
        "/reviews": 2000
      }
    },
    "conversions": {
      "total": 150,
      "rate": 0.01,
      "by_source": {
        "search": 80,
        "direct": 40,
        "social": 30
      }
    },
    "users": {
      "total": 8500,
      "new": 1200,
      "returning": 7300
    }
  },
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  }
}
```

## 🤖 AI API

### Chat with AI
```http
POST /api/ai/chat
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "message": "What's the best e-bike for city commuting?",
  "context": {
    "user_preferences": {
      "riding_style": "city",
      "price_range": [1000, 3000]
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Based on your preferences for city commuting and budget of €1,000-3,000, I recommend the City Pro. It has a 250W motor, 50km range, and is perfect for daily commuting.",
    "suggestions": [
      {
        "ebike_id": "ebike-123",
        "model_name": "City Pro",
        "reason": "Perfect for city commuting within your budget"
      }
    ],
    "session_id": "chat-session-123"
  }
}
```

## 📁 File Upload API

### Upload File
```http
POST /api/upload
```

**Headers:**
```http
Authorization: Bearer <token>
X-CSRF-Token: <csrf-token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with file field
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file_id": "file-123",
    "filename": "image.jpg",
    "url": "/uploads/image-123.jpg",
    "size": 1024000,
    "type": "image/jpeg",
    "uploaded_at": "2024-01-01T00:00:00Z"
  }
}
```

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "email": ["Email is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retry_after": 900
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## 🔧 SDK Examples

### JavaScript/TypeScript
```typescript
import { EBikeAPI } from '@ebike-platform/sdk'

const api = new EBikeAPI({
  baseURL: 'https://ebike-platform.com/api',
  apiKey: 'your-api-key'
})

// Get e-bikes
const ebikes = await api.ebikes.getAll({
  category: 'city',
  minPrice: 1000,
  maxPrice: 3000
})

// Create review
const review = await api.reviews.create('ebike-123', {
  rating: 5,
  comment: 'Great e-bike!'
})
```

### Python
```python
from ebike_platform import EBikeAPI

api = EBikeAPI(
    base_url='https://ebike-platform.com/api',
    api_key='your-api-key'
)

# Get e-bikes
ebikes = api.ebikes.get_all(
    category='city',
    min_price=1000,
    max_price=3000
)

# Create review
review = api.reviews.create('ebike-123', {
    'rating': 5,
    'comment': 'Great e-bike!'
})
```

## 📝 Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- E-bikes, users, reviews, favorites, comparison endpoints
- Authentication and authorization
- Rate limiting and security features

### v1.1.0 (2024-01-15)
- Added appointments API
- Added notifications API
- Added analytics API
- Added AI chat API

### v1.2.0 (2024-02-01)
- Added file upload API
- Enhanced search functionality
- Added bulk operations
- Improved error handling
