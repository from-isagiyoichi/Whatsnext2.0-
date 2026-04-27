# 🚀 Flask Backend Deployment Checklist

## Pre-Deployment

### ✅ Verify Backend Files
- [ ] `/flask-backend/app.py` exists
- [ ] `/flask-backend/requirements.txt` exists
- [ ] `/flask-backend/README.md` exists
- [ ] `/flask-backend/.env.example` exists
- [ ] `/flask-backend/Procfile` exists

### ✅ Copy Student List
- [ ] Copy `/src/imports/student-list.txt` to `/flask-backend/student-list.txt`
- [ ] Run `python verify_students.py` to verify format
- [ ] Confirmed approximately 60 students in the list

### ✅ Choose Deployment Platform
Select one:
- [ ] Render.com (Recommended - free tier)
- [ ] Railway.app (Easy setup)
- [ ] Heroku (Popular choice)
- [ ] DigitalOcean App Platform
- [ ] Local testing first (http://localhost:5000)

## Local Testing (Optional but Recommended)

### ✅ Setup Local Environment
- [ ] Python 3.9+ installed
- [ ] Navigate to `flask-backend` directory
- [ ] Run `pip install -r requirements.txt`
- [ ] Create `.env` file from `.env.example`
- [ ] Verify student-list.txt is in the directory

### ✅ Test Backend Locally
- [ ] Run `python app.py`
- [ ] Backend starts without errors
- [ ] Visit http://localhost:5000/api/health
- [ ] Health check returns `{"status":"ok"}`
- [ ] Database tables created automatically
- [ ] Students loaded from text file

### ✅ Test API Endpoints
```bash
# Test health check
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ajgayathrinair.b25ee1101@mbcet.ac.in","password":"AjGa01_EE"}'

# Test events (replace <token> with email from login)
curl http://localhost:5000/api/events \
  -H "Authorization: Bearer ajgayathrinair.b25ee1101@mbcet.ac.in"
```

- [ ] Health endpoint works
- [ ] Login returns user + token
- [ ] Events endpoint returns array
- [ ] No CORS errors

## Cloud Deployment

### ✅ Render.com Deployment

#### Step 1: Account Setup
- [ ] Created account at render.com
- [ ] Email verified

#### Step 2: Create Web Service
- [ ] Clicked "New +" → "Web Service"
- [ ] Connected GitHub repository OR uploaded files
- [ ] Repository/files are accessible

#### Step 3: Configure Service
- [ ] **Name**: `whatsnext-api` (or your choice)
- [ ] **Environment**: Python 3
- [ ] **Build Command**: `cd flask-backend && pip install -r requirements.txt`
- [ ] **Start Command**: `cd flask-backend && gunicorn app:app`
- [ ] **Instance Type**: Free (or paid)

#### Step 4: Add Database
- [ ] Clicked "New +" → "PostgreSQL"
- [ ] Database created
- [ ] Linked to web service
- [ ] `DATABASE_URL` automatically set

#### Step 5: Environment Variables
In Render dashboard, add these variables:
- [ ] `DATABASE_URL` (auto-set by Render)
- [ ] `SECRET_KEY` = (generate random string)
- [ ] `FLASK_ENV` = `production`
- [ ] `PORT` = `5000`

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

#### Step 6: Upload Student List
- [ ] Uploaded `student-list.txt` to repository
- [ ] Or manually added via Render Shell

#### Step 7: Deploy
- [ ] Clicked "Create Web Service"
- [ ] Deployment started
- [ ] Waited for completion (5-10 minutes)
- [ ] Deployment successful ✓
- [ ] Noted the API URL (e.g., `https://whatsnext-api.onrender.com`)

#### Step 8: Verify Deployment
- [ ] Visited `https://your-app.onrender.com/api/health`
- [ ] Returns: `{"status":"ok","message":"WhatNext API is running"}`
- [ ] No errors in logs

### ✅ Railway.app Deployment

#### Steps
- [ ] Created account at railway.app
- [ ] Created new project
- [ ] Added PostgreSQL database
- [ ] Deployed from GitHub
- [ ] Set environment variables
- [ ] Got API URL
- [ ] Tested health endpoint

### ✅ Heroku Deployment

#### Steps
- [ ] Installed Heroku CLI
- [ ] Logged in: `heroku login`
- [ ] Created app: `heroku create whatsnext-api`
- [ ] Added PostgreSQL: `heroku addons:create heroku-postgresql:mini`
- [ ] Set environment variables with `heroku config:set`
- [ ] Deployed with git push
- [ ] Tested endpoints

## Frontend Configuration

### ✅ Update React Services

#### File: `/src/app/services/authService.ts`
- [ ] Line 4: Changed `BASE_URL` to your API URL
- [ ] Line 5: Changed `USE_MOCK` to `false`
- [ ] Saved file

#### File: `/src/app/services/eventService.ts`
- [ ] Line 248: Changed `BASE_URL` to your API URL
- [ ] Line 249: Changed `USE_MOCK` to `false`
- [ ] Saved file

#### File: `/src/app/services/bookingService.ts`
- [ ] Line 27: Changed `BASE_URL` to your API URL
- [ ] Line 28: Changed `USE_MOCK` to `false`
- [ ] Saved file

#### File: `/src/app/services/notificationService.ts`
- [ ] Line 11: Changed `BASE_URL` to your API URL
- [ ] Line 12: Changed `USE_MOCK` to `false`
- [ ] Saved file

Example:
```typescript
private static BASE_URL = "https://whatsnext-api.onrender.com/api";
private static USE_MOCK = false;
```

## Testing Full Integration

### ✅ Test Complete User Flow

#### 1. Login
- [ ] Opened the React app
- [ ] Navigated to login page
- [ ] Entered valid student email
- [ ] Entered valid password
- [ ] Clicked login
- [ ] Successfully logged in
- [ ] Redirected to home page
- [ ] No errors in console

#### 2. Browse Events
- [ ] Home page loads events
- [ ] Events displayed correctly
- [ ] Images load properly
- [ ] Event details accessible
- [ ] No "failed to fetch" errors

#### 3. Add to Cart
- [ ] Selected an event
- [ ] Chose ticket type
- [ ] Added to cart
- [ ] Cart shows item
- [ ] Price calculated correctly

#### 4. Create Booking
- [ ] Proceeded to checkout
- [ ] Booking created successfully
- [ ] Confirmation message shown
- [ ] Redirected to tickets page

#### 5. View Tickets
- [ ] Tickets page loads
- [ ] Booked tickets displayed
- [ ] QR codes visible
- [ ] Booking details correct

#### 6. Check Notifications
- [ ] Notifications icon shows count
- [ ] Opened notifications
- [ ] Booking confirmation notification present
- [ ] Can mark as read

### ✅ Check Browser Console
- [ ] No CORS errors
- [ ] No authentication errors
- [ ] No API connection errors
- [ ] All API calls return 200 OK

### ✅ Check Backend Logs
- [ ] Login requests logged
- [ ] Events requests logged
- [ ] Booking requests logged
- [ ] No Python errors
- [ ] Database queries successful

## Post-Deployment

### ✅ Documentation
- [ ] Saved API URL for future reference
- [ ] Documented environment variables
- [ ] Noted database connection details
- [ ] Created backup of configuration

### ✅ Monitoring
- [ ] Set up log monitoring
- [ ] Checked resource usage
- [ ] Verified database connections
- [ ] Monitored API response times

### ✅ Security
- [ ] SECRET_KEY is secure (not default)
- [ ] DATABASE_URL is not exposed
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Passwords are hashed

### ✅ Backup
- [ ] Database backup configured
- [ ] Code backed up in GitHub
- [ ] Environment variables documented
- [ ] Student list backed up

## Troubleshooting

If something doesn't work:

### Backend Issues
- [ ] Checked deployment logs
- [ ] Verified environment variables are set
- [ ] Confirmed database is connected
- [ ] Tested health endpoint
- [ ] Verified student-list.txt exists

### Frontend Issues
- [ ] Confirmed USE_MOCK = false
- [ ] Verified BASE_URL is correct
- [ ] Checked browser console for errors
- [ ] Tested API endpoint directly with curl
- [ ] Cleared browser cache

### Database Issues
- [ ] Checked DATABASE_URL is set
- [ ] Verified database is accessible
- [ ] Confirmed tables are created
- [ ] Checked students are loaded
- [ ] Reviewed database logs

### CORS Issues
- [ ] Verified Flask-CORS is installed
- [ ] Confirmed CORS(app) is called in app.py
- [ ] Checked origin in request headers
- [ ] Tested with different browsers

## Success Criteria

✅ All checkboxes above are marked
✅ App loads without errors
✅ Users can log in
✅ Events are fetched from database
✅ Bookings can be created
✅ Tickets display with QR codes
✅ Notifications work
✅ No console errors
✅ Backend logs show successful requests
✅ Database contains data

## Quick Reference

### Your API URL
```
Write your deployed API URL here:
_________________________________________________
```

### Test Credentials
```
Email: ajgayathrinair.b25ee1101@mbcet.ac.in
Password: AjGa01_EE
```

### Important Commands
```bash
# Test backend health
curl https://your-api-url.com/api/health

# View backend logs (Render)
# Go to Dashboard → Your Service → Logs

# Run backend locally
cd flask-backend
python app.py

# Verify students
cd flask-backend
python verify_students.py
```

### Configuration Files to Update
1. `/src/app/services/authService.ts`
2. `/src/app/services/eventService.ts`
3. `/src/app/services/bookingService.ts`
4. `/src/app/services/notificationService.ts`

In each file:
```typescript
private static BASE_URL = "YOUR_API_URL/api";
private static USE_MOCK = false;
```

---

## 🎉 When All Checks Are Complete

Congratulations! Your WhatNext? app is now fully deployed with Flask backend!

### What You Have Achieved:
✅ Deployed production-ready Flask API
✅ Connected React frontend to backend
✅ Real database persistence
✅ Secure authentication system
✅ QR code generation for tickets
✅ Professional architecture

### Next Steps:
- Monitor application performance
- Add more features
- Collect user feedback
- Scale as needed

---

**Need Help?** Check:
- `/FLASK_SETUP_GUIDE.md` - Detailed guide
- `/FLASK_BACKEND_SUMMARY.md` - Complete summary
- `/ARCHITECTURE_DIAGRAM.md` - System architecture
- `/flask-backend/README.md` - Backend documentation
