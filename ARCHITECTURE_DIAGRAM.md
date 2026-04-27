# System Architecture Diagram

## Current Architecture (Mock Mode)

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Figma Make)                   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Pages     │  │  Components  │  │   Services   │          │
│  │              │  │              │  │              │          │
│  │  - Login     │  │  - EventCard │  │  - authSvc   │          │
│  │  - Home      │  │  - ProtRt    │  │  - eventSvc  │          │
│  │  - Cart      │  │  - CoordCard │  │  - bookSvc   │          │
│  │  - Tickets   │  │              │  │  - notifSvc  │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                              │                   │
│                          USE_MOCK = true     │                   │
│                                              ▼                   │
│                                    ┌──────────────────┐          │
│                                    │  localStorage    │          │
│                                    │                  │          │
│                                    │  - cart          │          │
│                                    │  - bookedTickets │          │
│                                    │  - notifications │          │
│                                    │  - userEmail     │          │
│                                    │  - userName      │          │
│                                    └──────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Target Architecture (Flask Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Figma Make)                   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Pages     │  │  Components  │  │   Services   │          │
│  │              │  │              │  │              │          │
│  │  - Login     │  │  - EventCard │  │  - authSvc   │          │
│  │  - Home      │  │  - ProtRt    │  │  - eventSvc  │          │
│  │  - Cart      │  │  - CoordCard │  │  - bookSvc   │          │
│  │  - Tickets   │  │              │  │  - notifSvc  │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                              │                   │
│                          USE_MOCK = false    │                   │
│                                              │                   │
└──────────────────────────────────────────────┼───────────────────┘
                                               │
                                   REST API    │ HTTPS
                                   (JSON)      │
                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              FLASK BACKEND (Separate Deployment)                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Endpoints                            │ │
│  │                                                             │ │
│  │  POST   /api/auth/login          - User login             │ │
│  │  GET    /api/auth/validate       - Validate token         │ │
│  │  GET    /api/events              - List all events        │ │
│  │  GET    /api/events/:id          - Get event details      │ │
│  │  POST   /api/bookings            - Create booking         │ │
│  │  GET    /api/bookings            - Get user bookings      │ │
│  │  DELETE /api/bookings/:id        - Cancel booking         │ │
│  │  GET    /api/notifications       - Get notifications      │ │
│  │  PUT    /api/notifications/:id   - Mark as read           │ │
│  │  GET    /api/user/profile        - Get user profile       │ │
│  │  PUT    /api/user/profile        - Update profile         │ │
│  │  GET    /api/health              - Health check           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Business Logic                             │ │
│  │                                                             │ │
│  │  - Authentication & Authorization                          │ │
│  │  - Password Hashing (Werkzeug)                             │ │
│  │  - Token Management                                        │ │
│  │  - QR Code Generation                                      │ │
│  │  - Data Validation                                         │ │
│  │  - Error Handling                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                SQLAlchemy ORM Layer                         │ │
│  │                                                             │ │
│  │  Models: Student, Event, Coordinator, Booking, Notification│ │
│  └────────────────────────────────────────────────────────────┘ │
│                                │                                 │
└────────────────────────────────┼─────────────────────────────────┘
                                 │ SQL Queries
                                 ▼
                    ┌──────────────────────────┐
                    │   PostgreSQL Database    │
                    │                          │
                    │  Tables:                 │
                    │  - students              │
                    │  - events                │
                    │  - coordinators          │
                    │  - bookings              │
                    │  - notifications         │
                    └──────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  User    │                                    │  React   │
│          │                                    │  App     │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. Enter email & password                   │
     ├──────────────────────────────────────────────▶
     │                                               │
     │                                               │ 2. POST /api/auth/login
     │                                               │    { email, password }
     │                                               ├──────────────┐
     │                                               │              │
     │                                               │              ▼
     │                                          ┌────┴──────────────────┐
     │                                          │   Flask Backend        │
     │                                          │                        │
     │                                          │  3. Validate against   │
     │                                          │     student-list.txt   │
     │                                          │                        │
     │                                          │  4. Check password     │
     │                                          │     (hash compare)     │
     │                                          │                        │
     │                                          │  5. Generate token     │
     │                                          └────┬──────────────────┘
     │                                               │
     │                                               │ 6. Return user + token
     │                                               │    { user, token }
     │                                               ◀──────────────┘
     │                                               │
     │                                               │ 7. Store in localStorage
     │                                               │    - authToken
     │                                               │    - userName
     │  8. Redirect to Home                         │    - userEmail
     ◀──────────────────────────────────────────────┤
     │                                               │
     │  9. Browse events                            │
     ├──────────────────────────────────────────────▶
     │                                               │
     │                                               │ 10. GET /api/events
     │                                               │     Header: Authorization: Bearer <token>
     │                                               ├──────────────┐
     │                                               │              │
     │                                               │              ▼
     │                                          ┌────┴──────────────────┐
     │                                          │   Flask Backend        │
     │                                          │                        │
     │                                          │  11. Validate token    │
     │                                          │                        │
     │                                          │  12. Query database    │
     │                                          │      SELECT * FROM     │
     │                                          │      events            │
     │                                          └────┬──────────────────┘
     │                                               │
     │                                               │ 13. Return events array
     │  14. Display events                          ◀──────────────┘
     ◀──────────────────────────────────────────────┤
     │                                               │
```

## Booking Flow

```
┌──────────┐         ┌──────────┐         ┌──────────────┐         ┌──────────────┐
│  User    │         │  React   │         │    Flask     │         │  PostgreSQL  │
│          │         │  Cart    │         │   Backend    │         │   Database   │
└────┬─────┘         └────┬─────┘         └──────┬───────┘         └──────┬───────┘
     │                    │                       │                        │
     │ Add to cart        │                       │                        │
     ├───────────────────▶│                       │                        │
     │                    │ Store in localStorage │                        │
     │                    │                       │                        │
     │ Checkout           │                       │                        │
     ├───────────────────▶│                       │                        │
     │                    │ POST /api/bookings    │                        │
     │                    │ { items: [...] }      │                        │
     │                    ├──────────────────────▶│                        │
     │                    │                       │ BEGIN TRANSACTION      │
     │                    │                       ├───────────────────────▶│
     │                    │                       │                        │
     │                    │                       │ For each cart item:    │
     │                    │                       │ 1. Generate booking ID │
     │                    │                       │ 2. Generate QR code    │
     │                    │                       │ 3. Calculate price     │
     │                    │                       │ 4. INSERT INTO bookings│
     │                    │                       ├───────────────────────▶│
     │                    │                       │                        │
     │                    │                       │ Create notification    │
     │                    │                       │ INSERT INTO            │
     │                    │                       │ notifications          │
     │                    │                       ├───────────────────────▶│
     │                    │                       │                        │
     │                    │                       │ COMMIT                 │
     │                    │                       ├───────────────────────▶│
     │                    │                       │                        │
     │                    │ { success: true }     │                        │
     │                    ◀──────────────────────┤                        │
     │                    │ Clear cart            │                        │
     │                    │ Navigate to tickets   │                        │
     │ Show tickets       │                       │                        │
     ◀───────────────────┤                       │                        │
     │                    │                       │                        │
```

## Deployment Architecture

```
                              USERS
                                │
                                │ HTTPS
                                ▼
                    ┌───────────────────────┐
                    │   Load Balancer       │
                    └───────────┬───────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
        ┌─────────────────────┐ ┌─────────────────────┐
        │  Figma Make App     │ │  Flask Backend      │
        │  (Static Frontend)  │ │  (Python Server)    │
        │                     │ │                     │
        │  - Vercel/Netlify   │ │  - Render           │
        │  - React SPA        │ │  - Railway          │
        │  - Auto-deployed    │ │  - Heroku           │
        └─────────────────────┘ │  - DigitalOcean     │
                                │  - Gunicorn/WSGI    │
                                └──────────┬──────────┘
                                           │
                                           │ SQL
                                           ▼
                              ┌────────────────────────┐
                              │  PostgreSQL Database   │
                              │                        │
                              │  - Managed DB Service  │
                              │  - Automatic backups   │
                              │  - SSL connection      │
                              └────────────────────────┘
```

## File Structure

```
project-root/
│
├── flask-backend/                    ← Deploy this separately
│   ├── app.py                        ← Main Flask application
│   ├── requirements.txt              ← Python dependencies
│   ├── student-list.txt              ← Copy from src/imports/
│   ├── verify_students.py            ← Verification tool
│   ├── .env                          ← Create from .env.example
│   ├── .env.example                  ← Environment template
│   ├── Procfile                      ← For Heroku
│   └── README.md                     ← Backend documentation
│
├── src/
│   ├── app/
│   │   ├── services/                 ← Service layer
│   │   │   ├── authService.ts        ← Authentication
│   │   │   ├── eventService.ts       ← Events
│   │   │   ├── bookingService.ts     ← Bookings
│   │   │   └── notificationService.ts← Notifications
│   │   ├── pages/                    ← React pages
│   │   ├── components/               ← React components
│   │   └── data/                     ← Mock data
│   └── imports/
│       └── student-list.txt          ← Original student list
│
├── FLASK_SETUP_GUIDE.md              ← Detailed setup guide
├── FLASK_BACKEND_SUMMARY.md          ← This summary
├── QUICK_CONFIG.md                   ← Quick reference
└── ARCHITECTURE_DIAGRAM.md           ← Architecture diagrams
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router
- **State**: React Hooks + localStorage
- **Icons**: Lucide React
- **Hosting**: Figma Make / Vercel / Netlify

### Backend
- **Framework**: Flask 3.0
- **Language**: Python 3.9+
- **ORM**: SQLAlchemy
- **Auth**: Werkzeug (password hashing)
- **CORS**: Flask-CORS
- **QR Codes**: qrcode + Pillow
- **Server**: Gunicorn (production)
- **Hosting**: Render / Railway / Heroku

### Database
- **Development**: SQLite
- **Production**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Flask-Migrate (optional)

## API Request/Response Examples

### Login Request
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "ajgayathrinair.b25ee1101@mbcet.ac.in",
  "password": "AjGa01_EE"
}
```

### Login Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

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

### Get Events Request
```http
GET /api/events HTTP/1.1
Authorization: Bearer ajgayathrinair.b25ee1101@mbcet.ac.in
```

### Get Events Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "1",
    "title": "CROSSROADS",
    "subtitle": "TECHNO-CULTURAL FEST OF MBCET",
    "date": "March 15, 2026",
    "time": "10:00 AM - 8:00 PM",
    "venue": "MBCET Main Auditorium, Trivandrum",
    "description": "...",
    "category": "live",
    "price": {
      "earlyBird": 199,
      "regular": 299
    },
    "earlyBirdDeadline": "March 12, 2026",
    "image": "https://...",
    "coordinators": [...]
  }
]
```

### Create Booking Request
```http
POST /api/bookings HTTP/1.1
Authorization: Bearer ajgayathrinair.b25ee1101@mbcet.ac.in
Content-Type: application/json

{
  "items": [
    {
      "eventId": "1",
      "ticketType": "earlyBird",
      "quantity": 2
    }
  ]
}
```

### Create Booking Response
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Bookings created successfully",
  "count": 1
}
```

---

**This diagram illustrates the complete system architecture of the WhatNext? events booking platform.**
