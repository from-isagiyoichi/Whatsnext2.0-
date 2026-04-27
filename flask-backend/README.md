# WhatNext? Flask Backend

This is the Python Flask backend for the WhatNext events booking application.

## 🚀 Quick Start

### Local Development

1. **Install Python 3.9+**

2. **Install Dependencies**
   ```bash
   cd flask-backend
   pip install -r requirements.txt
   ```

3. **Copy Student List**
   Copy the `student-list.txt` file to the `flask-backend` directory:
   ```bash
   cp ../src/imports/student-list.txt ./student-list.txt
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```

   The API will be available at `http://localhost:5000`

### Environment Variables

Create a `.env` file in the `flask-backend` directory:

```env
DATABASE_URL=sqlite:///whatsnext.db
SECRET_KEY=your-super-secret-key-change-this
PORT=5000
FLASK_ENV=development
```

For production with PostgreSQL:
```env
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-production-secret-key
PORT=5000
FLASK_ENV=production
```

## 📦 Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

1. Create account on [Render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `pip install -r flask-backend/requirements.txt`
   - **Start Command**: `cd flask-backend && gunicorn app:app`
   - **Environment**: Python 3
5. Add environment variables in Render dashboard
6. Deploy!

### Option 2: Railway (Easy Deployment)

1. Create account on [Railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Add PostgreSQL database (automatically configured)
5. Set environment variables
6. Deploy!

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create whatsnext-api`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
5. Deploy:
   ```bash
   cd flask-backend
   git init
   heroku git:remote -a whatsnext-api
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

### Option 4: PythonAnywhere (Free Option)

1. Create account on [PythonAnywhere.com](https://www.pythonanywhere.com)
2. Upload your files
3. Create new web app (Flask)
4. Configure WSGI file
5. Install requirements in virtual environment
6. Reload web app

### Option 5: DigitalOcean App Platform

1. Create account on DigitalOcean
2. Create new App
3. Connect GitHub repository
4. Select Python environment
5. Configure build and run commands
6. Add PostgreSQL database
7. Deploy!

## 🗄️ Database

The app uses SQLAlchemy ORM and supports:
- **SQLite** (for local development)
- **PostgreSQL** (recommended for production)

The database is automatically initialized with:
- Student accounts from `student-list.txt`
- Sample event data

## 🔐 Authentication

The API uses a simple token-based authentication:
- Login returns the user's email as a token
- Token must be sent in `Authorization` header

**For production**, implement JWT tokens using `PyJWT`:
```bash
pip install PyJWT
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validate token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/<id>` - Get single event

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `DELETE /api/bookings/<id>` - Cancel booking

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/<id>/read` - Mark as read
- `GET /api/notifications/unread-count` - Unread count

### User Profile
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

### Health Check
- `GET /api/health` - Health check

## 🔧 Connecting React Frontend

After deploying the Flask backend:

1. Get your API URL (e.g., `https://your-app.render.com`)
2. Update the React frontend services:
   - In `authService.ts`, set `BASE_URL` to your API URL
   - In `eventService.ts`, set `BASE_URL` to your API URL
   - Set `USE_MOCK = false` to enable API calls

Example:
```typescript
private static BASE_URL = "https://your-app.render.com/api";
private static USE_MOCK = false;
```

## 🛠️ Development Tips

### Run with auto-reload
```bash
export FLASK_ENV=development
flask run
```

### Database migrations (if using Flask-Migrate)
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### Test the API
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ajgayathrinair.b25ee1101@mbcet.ac.in","password":"AjGa01_EE"}'
```

## 📝 File Structure

```
flask-backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── student-list.txt    # Authorized students list
├── .env               # Environment variables (create this)
└── README.md          # This file
```

## 🔒 Security Notes

1. **Change SECRET_KEY** in production
2. **Use HTTPS** for all API calls
3. **Implement JWT tokens** instead of simple email tokens
4. **Rate limiting** - Add Flask-Limiter for API protection
5. **Input validation** - Add request validation
6. **CORS** - Configure CORS properly for your domain

## 📞 Support

For issues or questions, refer to:
- Flask Documentation: https://flask.palletsprojects.com/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
