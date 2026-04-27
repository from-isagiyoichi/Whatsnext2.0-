# Quick Configuration Guide

## 🎯 Switching Between Mock (localStorage) and Real API (Flask)

### Current Configuration: **MOCK MODE** ✅

All services are currently set to use mock data (localStorage). This allows the app to work without a backend.

## 🔄 To Enable Flask Backend

When your Flask backend is deployed and ready:

### 1. Update Auth Service
**File:** `/src/app/services/authService.ts`

```typescript
// Line 4-5: Change these two lines
private static BASE_URL = "https://your-flask-api-url.com/api";
private static USE_MOCK = false;
```

### 2. Update Event Service
**File:** `/src/app/services/eventService.ts`

```typescript
// Line 248-249: Change these two lines
private static BASE_URL = "https://your-flask-api-url.com/api";
private static USE_MOCK = false;
```

### 3. Update Booking Service
**File:** `/src/app/services/bookingService.ts`

```typescript
// Line 27-28: Change these two lines
private static BASE_URL = "https://your-flask-api-url.com/api";
private static USE_MOCK = false;
```

### 4. Update Notification Service
**File:** `/src/app/services/notificationService.ts`

```typescript
// Line 11-12: Change these two lines
private static BASE_URL = "https://your-flask-api-url.com/api";
private static USE_MOCK = false;
```

## 🌐 Example Flask API URLs

### Local Development
```typescript
private static BASE_URL = "http://localhost:5000/api";
```

### Render.com
```typescript
private static BASE_URL = "https://whatsnext-api.onrender.com/api";
```

### Railway
```typescript
private static BASE_URL = "https://whatsnext-api.up.railway.app/api";
```

### Heroku
```typescript
private static BASE_URL = "https://whatsnext-api.herokuapp.com/api";
```

## ✅ Verification Checklist

After switching to Flask backend, verify:

- [ ] Flask backend is deployed and running
- [ ] `/api/health` endpoint returns 200 OK
- [ ] All BASE_URL values are updated
- [ ] All USE_MOCK values are set to `false`
- [ ] Login works with student credentials
- [ ] Events load from database
- [ ] Bookings can be created
- [ ] Notifications appear

## 🔙 To Switch Back to Mock Mode

If you need to go back to localStorage:

Set `USE_MOCK = true` in all four service files:
- authService.ts
- eventService.ts
- bookingService.ts
- notificationService.ts

## 📝 Important Notes

1. **Student List**: Make sure `student-list.txt` is uploaded to Flask backend
2. **CORS**: Flask backend has CORS enabled for all origins
3. **Authentication**: Token is stored in localStorage as "authToken"
4. **Database**: Flask automatically initializes database on first run
5. **Environment**: Use environment variables for production secrets

## 🐛 Quick Debug

Test if Flask backend is accessible:

```bash
# Health check
curl https://your-api-url.com/api/health

# Should return:
# {"status":"ok","message":"WhatNext API is running"}
```

Test login:
```bash
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ajgayathrinair.b25ee1101@mbcet.ac.in","password":"AjGa01_EE"}'
```

## 📚 Documentation

- Full Setup Guide: `/FLASK_SETUP_GUIDE.md`
- Backend Code: `/flask-backend/app.py`
- Backend README: `/flask-backend/README.md`
