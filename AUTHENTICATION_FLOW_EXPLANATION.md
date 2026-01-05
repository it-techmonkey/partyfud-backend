# Authentication Flow for Create Package API

## Overview
The `POST /api/user/packages` endpoint requires **USER authentication** (not CATERER). This endpoint allows regular users to create custom packages by selecting dishes.

## Authentication Flow

### 1. **Token Type Required: USER Token**
   - ✅ **USER token** - Required (this is what you need)
   - ❌ **CATERER token** - NOT accepted for this endpoint
   - ❌ **ADMIN token** - NOT accepted for this endpoint

### 2. **Token Structure**
   The JWT token contains:
   ```json
   {
     "userId": "user-uuid-here",
     "email": "user@example.com",
     "type": "USER"
   }
   ```

### 3. **API Request Flow**

```
Frontend (React)
    ↓
1. User clicks "Create Package" button
    ↓
2. Frontend checks if user is authenticated (useAuth hook)
    ↓
3. Frontend calls: userApi.createCustomPackage()
    ↓
4. API Request sent with:
   - URL: POST /api/user/packages
   - Headers: {
       "Authorization": "Bearer <USER_TOKEN>",
       "Content-Type": "application/json"
     }
   - Body: {
       "dish_ids": ["dish-1", "dish-2"],
       "people_count": 50
     }
    ↓
Backend (Express)
    ↓
5. Route: packages.routes.ts
   - Route: POST "/" with authenticate middleware
   - Middleware: authenticate (verifies JWT token)
    ↓
6. Authentication Middleware (auth.middleware.ts)
   - Extracts token from: req.headers.authorization
   - Expected format: "Bearer <token>"
   - Verifies token using JWT_SECRET
   - If valid: Attaches user info to req.user
   - If invalid/expired: Returns 401 error
    ↓
7. Controller (packages.controller.ts)
   - Checks: req.user exists and has req.user.id
   - Extracts: dish_ids, people_count from req.body
   - Calls: packagesService.createCustomPackage(user.id, data)
    ↓
8. Service (packages.services.ts)
   - Validates user exists in database
   - Validates dishes exist and are active
   - Ensures all dishes are from same approved caterer
   - Creates package with:
     - caterer_id: from dishes
     - created_by: "USER"
     - user_id: from authenticated user (userId)
    ↓
9. Response: Returns created package
```

## Token Requirements

### ✅ Correct Token (USER)
```javascript
// When user logs in as USER type
{
  userId: "user-123",
  email: "user@example.com",
  type: "USER"  // ← This is what you need
}
```

### ❌ Wrong Token (CATERER)
```javascript
// If user logs in as CATERER type
{
  userId: "caterer-456",
  email: "caterer@example.com",
  type: "CATERER"  // ← This won't work for user endpoints
}
```

## Common Issues & Solutions

### Issue 1: "Your session has expired"
**Cause:** Token is expired or invalid

**Solution:**
1. Check if token exists in localStorage:
   ```javascript
   localStorage.getItem('auth_token')
   ```
2. If null or expired, user needs to log in again
3. Token expiration: Default is 7 days (set in JWT_EXPIRES_IN)

### Issue 2: 401 Unauthorized
**Causes:**
- No token in Authorization header
- Token format is wrong (should be "Bearer <token>")
- Token is expired
- Token secret mismatch

**Solution:**
1. Verify token is being sent:
   - Open browser DevTools → Network tab
   - Check request headers for "Authorization: Bearer ..."
2. Verify token is valid:
   - Token should be stored in localStorage as 'auth_token'
   - Token should not be expired

### Issue 3: Wrong User Type
**Cause:** User logged in as CATERER but trying to use USER endpoint

**Solution:**
- User must log in with USER account (type: "USER")
- Cannot use CATERER account for this endpoint

## Debugging Steps

### Step 1: Check if user is logged in
```javascript
// In browser console
localStorage.getItem('auth_token')  // Should return a token string
localStorage.getItem('user_data')   // Should return user object
```

### Step 2: Verify token format
```javascript
// Token should look like:
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI..."
```

### Step 3: Check user type
```javascript
// In browser console
const userData = JSON.parse(localStorage.getItem('user_data'));
console.log(userData.type);  // Should be "USER"
```

### Step 4: Test API call manually
```bash
# Get token from localStorage first
curl -X POST http://localhost:3000/api/user/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "dish_ids": ["dish-id-1"],
    "people_count": 50
  }'
```

## Frontend Code Flow

```typescript
// 1. User clicks button
handleAddToCart() {
  // 2. Check authentication
  if (!user) {
    alert('You must be logged in');
    router.push('/login');
    return;
  }
  
  // 3. Call API
  userApi.createCustomPackage({
    dish_ids: [...],
    people_count: 50
  });
}

// 4. API call (user.api.ts)
createCustomPackage(data) {
  // Uses apiRequest which automatically adds:
  // Authorization: Bearer <token from localStorage>
  return apiRequest('/api/user/packages', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

## Backend Code Flow

```typescript
// 1. Route (packages.routes.ts)
router.post("/", authenticate, createCustomPackage);

// 2. Middleware (auth.middleware.ts)
authenticate(req, res, next) {
  const token = req.headers.authorization?.substring(7); // Remove "Bearer "
  const decoded = verifyToken(token); // Verifies JWT
  req.user = decoded; // { userId, email, type }
  next();
}

// 3. Controller (packages.controller.ts)
createCustomPackage(req, res) {
  const user = req.user; // From middleware
  const userId = user.id; // or user.userId
  // Creates package with this userId
}

// 4. Service (packages.services.ts)
createCustomPackage(userId, data) {
  // userId is the authenticated user's ID
  // Package is created with created_by: "USER"
}
```

## Summary

- **Token Type:** USER token (not CATERER)
- **Endpoint:** POST /api/user/packages
- **Authentication:** Required (via authenticate middleware)
- **User Type:** Must be "USER" (not "CATERER" or "ADMIN")
- **Token Location:** localStorage.getItem('auth_token')
- **Token Format:** "Bearer <token>" in Authorization header

