# 🔐 Firebase Authentication - COMPLETE!

## What's Been Implemented

### 1. **Firebase Admin SDK Integration** ✅
- Installed `firebase-admin` package
- Initialized Firebase Admin with service account
- Connected to Firebase project: `the-productive-house`

### 2. **Authentication Middleware** ✅
Created three middleware functions:

#### `verifyToken`
- Verifies Firebase ID tokens
- Extracts user info from token
- Attaches user to request object
- **Usage**: Protect routes that require authentication

#### `optionalAuth`
- Attempts to verify token if present
- Doesn't fail if no token provided
- **Usage**: Routes that work for both authenticated and non-authenticated users

#### `requireAdmin`
- Checks if user has admin custom claim
- Must be used after `verifyToken`
- **Usage**: Protect admin-only routes

### 3. **Protected Routes** ✅

#### **Admin Routes** (All Protected)
```
GET  /admin/stats          - Dashboard statistics
GET  /admin/customers      - Customer list
GET  /admin/orders         - All orders
PATCH /admin/orders/:id/status - Update order status
```
**Protection**: `verifyToken` + `requireAdmin`

#### **Product Routes** (Selective Protection)
```
GET  /products             - Public ✅
GET  /products/:id         - Public ✅
POST /products             - Protected (Admin only) 🔒
PUT  /products/:id         - Protected (Admin only) 🔒
DELETE /products/:id       - Protected (Admin only) 🔒
```

#### **Order Routes** (Protected)
```
POST /orders               - Protected (Authenticated users) 🔒
GET  /orders/my-orders     - Protected (Authenticated users) 🔒
GET  /orders/:id           - Public (for now)
```

### 4. **Admin Claim Script** ✅
Created utility script to set admin claims for users.

## How to Use

### Setting Up Admin Users

1. **Make a user admin:**
   ```bash
   cd backend
   npx ts-node src/setAdminClaim.ts user@example.com
   ```

2. **User must sign out and sign in again** for changes to take effect

### Frontend Integration

#### 1. Get Firebase ID Token
```typescript
import { auth } from '@/lib/firebase';

const user = auth.currentUser;
if (user) {
    const token = await user.getIdToken();
    // Use this token in API calls
}
```

#### 2. Send Token with API Requests
```typescript
const token = await auth.currentUser?.getIdToken();

const response = await fetch('http://localhost:3001/admin/stats', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

#### 3. Update API Library
Modify `app/lib/api.ts` to include auth token:

```typescript
const getAuthToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
};

export async function getAdminStats() {
    const token = await getAuthToken();
    const res = await fetch(`${API_URL}/admin/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    // ... rest of code
}
```

## Request/Response Flow

### Successful Request:
```
1. Frontend gets Firebase ID token
2. Sends request with Authorization header
3. Backend verifies token with Firebase Admin
4. Extracts user info
5. Checks admin claim (if required)
6. Processes request
7. Returns response
```

### Failed Authentication:
```
401 Unauthorized - No token or invalid token
403 Forbidden - Valid token but not admin
```

## Error Responses

### No Token:
```json
{
    "error": "Unauthorized - No token provided"
}
```

### Invalid Token:
```json
{
    "error": "Unauthorized - Invalid token"
}
```

### Not Admin:
```json
{
    "error": "Forbidden - Admin access required"
}
```

## Testing Authentication

### 1. Test Without Token (Should Fail):
```bash
curl http://localhost:3001/admin/stats
# Response: 401 Unauthorized
```

### 2. Test With Valid Token:
```bash
# Get token from Firebase (in browser console):
# const token = await firebase.auth().currentUser.getIdToken();

curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:3001/admin/stats
```

### 3. Test Admin Claim:
```bash
# First, set admin claim:
npx ts-node src/setAdminClaim.ts admin@example.com

# Then test with that user's token
```

## Security Features

✅ **Token Verification** - All tokens verified with Firebase Admin  
✅ **Role-Based Access** - Admin routes require admin claim  
✅ **User Context** - User info available in `req.user`  
✅ **Selective Protection** - Public routes remain public  
✅ **Secure by Default** - Admin routes protected by default  

## Next Steps

### Frontend Integration:
1. Update `app/lib/api.ts` to include auth tokens
2. Add token refresh logic
3. Handle 401/403 errors (redirect to login)
4. Show/hide admin features based on user role

### Additional Security:
1. Add rate limiting
2. Add request logging
3. Add IP whitelisting for admin routes
4. Implement refresh token rotation

## File Structure

```
backend/
├── src/
│   ├── lib/
│   │   └── firebase-admin.ts      # Firebase Admin initialization
│   ├── middleware/
│   │   └── auth.ts                # Authentication middleware
│   ├── routes/
│   │   ├── admin.ts               # Protected with admin middleware
│   │   ├── products.ts            # Selective protection
│   │   └── orders.ts              # Protected routes
│   └── setAdminClaim.ts           # Utility script
└── serviceAccountKey.json         # Firebase credentials
```

## Environment Variables

No additional environment variables needed! The service account key is loaded directly from the JSON file.

---

## 🎉 **Authentication Complete!**

Your backend is now secured with Firebase authentication:
- ✅ Admin routes protected
- ✅ User authentication working
- ✅ Role-based access control
- ✅ Token verification
- ✅ Ready for frontend integration

**Next**: Update frontend to send auth tokens with requests!
