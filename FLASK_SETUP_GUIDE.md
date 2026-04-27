# Flask Backend Integration Guide for WhatNext? App

## 📋 Overview

This guide explains how to set up and deploy the Python Flask backend for your WhatNext? events booking application.

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   React Frontend    │ ◄─────► │   Flask Backend      │
│  (Figma Make App)   │  REST   │   (Python/Flask)     │
└─────────────────────┘   API   └──────────────────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │   PostgreSQL     │
                                 │    Database      │
                                 └──────────────────┘
```

## 📁 Files Created

The following Flask backend files have been created in `/flask-backend/`:

1. **`app.py`** - Main Flask application with all API endpoints
2. **`requirements.txt`** - Python dependencies
3. **`README.md`** - Backend documentation
4. **`.env.example`** - Environment variable template
5. **`Procfile`** - For Heroku deployment

React Frontend Services (Updated):
1. **`/src/app/services/authService.ts`** - Authentication service
2. **`/src/app/services/eventService.ts`** - Events service
3. **`/src/app/services/bookingService.ts`** - Bookings service (NEW)
4. **`/src/app/services/notificationService.ts`** - Notifications service (NEW)

## 🚀 Step-by-Step Deployment

### Step 1: Copy Student List to Backend

The Flask backend needs the student list for authentication:

```bash
# If you have file system access to the Flask backend
cp /src/imports/student-list.txt /flask-backend/student-list.txt
```

**Note:** When deploying to a hosting service, you'll need to upload this file along with your backend code.

### Step 2: Choose a Deployment Platform

#### Option A: Render.com (Recommended - Free Tier)

1. **Sign up** at [render.com](https://render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or upload files)

3. **Configure Service**
   - **Name:** `whatsnext-api`
   - **Environment:** Python 3
   - **Build Command:** `cd flask-backend && pip install -r requirements.txt`
   - **Start Command:** `cd flask-backend && gunicorn app:app`
   - **Instance Type:** Free

4. **Add Environment Variables**
   - `DATABASE_URL` - (Render will provide PostgreSQL URL)
   - `SECRET_KEY` - Generate a random string
   - `FLASK_ENV` - `production`

5. **Add PostgreSQL Database**
   - In your service dashboard, click "New +" → "PostgreSQL"
   - Connect it to your web service
   - Render will automatically set `DATABASE_URL`

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Get your API URL (e.g., `https://whatsnext-api.onrender.com`)

#### Option B: Railway.app (Easy & Fast)

1. **Sign up** at [railway.app](https://railway.app)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Empty Project"

3. **Add PostgreSQL**
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway automatically provides connection URL

4. **Configure Service**
   - Add your backend files
   - Railway auto-detects Python
   - Set environment variables in Variables tab

5. **Deploy**
   - Railway automatically deploys
   - Get your API URL from the service dashboard

#### Option C: Local Development

For testing locally before deploying:

1. **Install Python 3.9+**
   ```bash
   python --version  # Should be 3.9 or higher
   ```

2. **Install Dependencies**
   ```bash
   cd flask-backend
   pip install -r requirements.txt
   ```

3. **Copy Student List**
   ```bash
   # Copy from your main project
   cp ../src/imports/student-list.txt ./student-list.txt
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

5. **Run Backend**
   ```bash
   python app.py
   ```

   Backend will run at `http://localhost:5000`

### Step 3: Update React Frontend Configuration

Once your Flask backend is deployed, update the React frontend:

1. **Get your API URL** from your hosting provider
   - Render: `https://your-app-name.onrender.com`
   - Railway: `https://your-app-name.up.railway.app`
   - Local: `http://localhost:5000`

2. **Update Service Files**

   Open these files and change the configuration:

   **`/src/app/services/authService.ts`:**
   ```typescript
   private static BASE_URL = "https://your-api-url.com/api";
   private static USE_MOCK = false; // Enable real API
   ```

   **`/src/app/services/eventService.ts`:**
   ```typescript
   private static BASE_URL = "https://your-api-url.com/api";
   private static USE_MOCK = false; // Enable real API
   ```

   **`/src/app/services/bookingService.ts`:**
   ```typescript
   private static BASE_URL = "https://your-api-url.com/api";
   private static USE_MOCK = false; // Enable real API
   ```

   **`/src/app/services/notificationService.ts`:**
   ```typescript
   private static BASE_URL = "https://your-api-url.com/api";
   private static USE_MOCK = false; // Enable real API
   ```

3. **Test the Connection**
   - Login with a valid student email and password
   - Check browser console for API calls
   - Verify data is being fetched from the backend

## 🧪 Testing the Backend

### Test Health Endpoint
```bash
curl https://your-api-url.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "WhatNext API is running"
}
```

### Test Login
```bash
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ajgayathrinair.b25ee1101@mbcet.ac.in",
    "password": "AjGa01_EE"
  }'
```

Expected response:
```json
{
  "user": {
    "id": 1,
    "name": "Ajgayathrinair",
    "email": "ajgayathrinair.b25ee1101@mbcet.ac.in",
    "department": "EEE"
  },
  "token": "ajgayathrinair.b25ee1101@mbcet.ac.in"
}
```

### Test Events (requires authentication)
```bash
curl https://your-api-url.com/api/events \
  -H "Authorization: Bearer ajgayathrinair.b25ee1101@mbcet.ac.in"
```

## 🔧 Troubleshooting

### Issue: "CORS Error" in Browser Console

**Solution:** The Flask backend has CORS enabled. Make sure:
1. Your Flask app includes `Flask-CORS`
2. The CORS configuration allows your React app domain

In `app.py`:
```python
from flask_cors import CORS
CORS(app)  # This should be present
```

### Issue: "Connection refused" or "Failed to fetch"

**Solutions:**
1. Verify Flask backend is running
2. Check the API URL is correct
3. Ensure backend is deployed and accessible
4. Check browser console for exact error

### Issue: "Database connection error"

**Solutions:**
1. Verify `DATABASE_URL` environment variable is set
2. Check database credentials
3. Ensure database is accessible from your hosting service
4. Run `init_database()` to create tables

### Issue: "Invalid credentials" even with correct password

**Solutions:**
1. Verify `student-list.txt` is uploaded to Flask backend
2. Check file format (email on one line, password on next)
3. Ensure no extra spaces or special characters
4. Run database initialization to load students

### Issue: "500 Internal Server Error"

**Solutions:**
1. Check Flask application logs in your hosting dashboard
2. Verify all environment variables are set
3. Check database connection
4. Look for Python errors in logs

## 📊 Database Schema

The Flask backend creates these tables automatically:

- **students** - User accounts from student-list.txt
- **events** - Event information
- **coordinators** - Event coordinators
- **bookings** - User ticket bookings
- **notifications** - User notifications

## 🔐 Security Considerations

### For Production:

1. **Change SECRET_KEY**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
   Use this as your SECRET_KEY

2. **Use JWT Tokens** (Recommended)
   Instead of simple email tokens, implement JWT:
   ```bash
   pip install PyJWT
   ```

3. **Enable HTTPS**
   - Most hosting platforms provide HTTPS automatically
   - Never use HTTP in production

4. **Rate Limiting**
   Add Flask-Limiter to prevent abuse:
   ```bash
   pip install Flask-Limiter
   ```

5. **Input Validation**
   - The backend has basic validation
   - Consider adding more robust validation

## 📝 API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/validate` | Validate token |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/<id>` | Get single event |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get user bookings |
| DELETE | `/api/bookings/<id>` | Cancel booking |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/<id>/read` | Mark as read |
| GET | `/api/notifications/unread-count` | Unread count |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |

## 🎯 Next Steps

1. ✅ Deploy Flask backend to hosting service
2. ✅ Update React frontend with API URL
3. ✅ Test all functionality
4. ✅ Monitor application logs
5. ✅ Set up proper error handling
6. ✅ Implement rate limiting (optional)
7. ✅ Add more features as needed

## 💡 Tips

- Start with local development to test everything
- Use environment variables for configuration
- Monitor your application logs regularly
- Keep your dependencies updated
- Backup your database regularly

## 📞 Need Help?

- Flask Documentation: https://flask.palletsprojects.com/
- SQLAlchemy Docs: https://docs.sqlalchemy.org/
- Render Support: https://render.com/docs
- Railway Support: https://docs.railway.app/

---

**Happy Coding! 🚀**
