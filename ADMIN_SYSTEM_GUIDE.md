# Admin System Guide

## Admin Credentials

**Username (Email):** `Adminmbcet@mbcet.ac.in`  
**Password:** `T9#kL2!vQ7@pZ4$h`

> **Important:** These credentials are displayed on the admin login page for convenience during development. Remember to remove or secure this in production!

---

## Admin Portal Access

### Login URL
```
/admin/login
```

### Admin Routes
All admin routes are protected and require authentication:

- `/admin/login` - Admin login page (public)
- `/admin/dashboard` - Main admin dashboard (protected)
- `/admin/events` - Events management (protected)
- `/admin/events/new` - Create new event (protected)
- `/admin/events/edit/:eventId` - Edit existing event (protected)
- `/admin/students` - Students management (protected)

---

## Features

### 1. **Events Management** (`/admin/events`)
- View all events in the system
- Create new events with full details (title, description, date, price, images, coordinators, etc.)
- Edit existing events
- Delete events
- Search and filter events

### 2. **Students Management** (`/admin/students`)
- View all registered students
- Add new students to the system
- Edit student information (name, branch, year, admission number)
- Delete students
- Search students by name, email, or admission number

### 3. **Dashboard** (`/admin/dashboard`)
- Overview of system statistics
- Quick access to management sections
- System information display

---

## Authentication Flow

1. **Login Process:**
   - Admin navigates to `/admin/login`
   - Enters email: `Adminmbcet@mbcet.ac.in`
   - Enters password: `T9#kL2!vQ7@pZ4$h`
   - On success, redirected to `/admin/dashboard`
   - Admin token stored in localStorage

2. **Route Protection:**
   - All admin routes use `AdminProtectedRoute` component
   - Checks for valid admin session via `AuthService.isAdminLoggedIn()`
   - Redirects to `/admin/login` if not authenticated

3. **Logout Process:**
   - Click logout button in dashboard
   - Clears admin session from localStorage
   - Redirects to `/admin/login`

---

## Technical Implementation

### Files Modified/Created

#### Authentication
- `/src/app/services/authService.ts` - Added admin authentication methods:
  - `adminLogin(email, password)` - Authenticates admin
  - `adminLogout()` - Clears admin session
  - `isAdminLoggedIn()` - Checks admin authentication status

#### Components
- `/src/app/components/AdminProtectedRoute.tsx` - Route protection component

#### Pages
- `/src/app/pages/admin/AdminLogin.tsx` - Admin login page
- `/src/app/pages/admin/AdminDashboard.tsx` - Main admin dashboard
- `/src/app/pages/admin/EventsManagement.tsx` - Events CRUD interface
- `/src/app/pages/admin/EventForm.tsx` - Event creation/editing form
- `/src/app/pages/admin/StudentsManagement.tsx` - Students CRUD interface

#### Services
- `/src/app/services/adminService.ts` - Admin operations service:
  - Events CRUD operations
  - Students CRUD operations

#### Routes
- `/src/app/routes.tsx` - Added admin routes

---

## localStorage Keys Used

- `adminToken` - JWT token for admin authentication
- `adminEmail` - Admin's email address
- `isAdmin` - Boolean flag indicating admin status
- `eventsData` - Events database (mock mode)
- `studentsData` - Students database (mock mode)

---

## Current Mode: Mock (localStorage)

The admin system is currently running in **MOCK MODE** using localStorage:

- All data is stored locally in the browser
- No Flask backend required for testing
- Perfect for development and demonstration

### To Switch to Flask Backend:

1. In `/src/app/services/adminService.ts`, set:
   ```typescript
   private static USE_MOCK = false;
   ```

2. Update the `BASE_URL` to your Flask API endpoint:
   ```typescript
   private static BASE_URL = "https://your-flask-api.com/api";
   ```

3. Ensure your Flask backend has these endpoints:
   - `POST /api/auth/admin-login` - Admin authentication
   - `GET /api/admin/events` - Get all events
   - `POST /api/admin/events` - Create event
   - `PUT /api/admin/events/:id` - Update event
   - `DELETE /api/admin/events/:id` - Delete event
   - `GET /api/admin/students` - Get all students
   - `POST /api/admin/students` - Add student
   - `PUT /api/admin/students/:email` - Update student
   - `DELETE /api/admin/students/:email` - Delete student

---

## Security Considerations for Production

### Current Implementation (Development)
- ✅ Admin credentials hardcoded in AuthService
- ✅ Credentials displayed on login page
- ✅ Mock authentication with localStorage
- ⚠️ **NOT SECURE FOR PRODUCTION**

### For Production Deployment:

1. **Remove Hardcoded Credentials**
   - Store admin credentials in environment variables
   - Use secure password hashing (bcrypt)
   - Implement proper database authentication

2. **Remove Credential Display**
   - Remove the info banner showing credentials from AdminLogin.tsx
   - Implement password reset flow

3. **Implement Proper Security**
   - Use JWT tokens with expiration
   - Implement refresh tokens
   - Add HTTPS enforcement
   - Add rate limiting on login attempts
   - Implement CSRF protection
   - Add session timeout

4. **Flask Backend Security**
   - Implement proper JWT validation
   - Use bcrypt for password hashing
   - Add role-based access control (RBAC)
   - Implement audit logging for admin actions
   - Add input validation and sanitization

---

## Testing the Admin System

### 1. Login
1. Navigate to `/admin/login`
2. Use the credentials displayed on the page
3. Click "Sign In to Admin Panel"
4. Should redirect to dashboard

### 2. Events Management
1. From dashboard, click "Events Management"
2. Click "Add Event" to create a new event
3. Fill in all required fields
4. Click "Save Event"
5. Event should appear in the list
6. Test edit and delete functions

### 3. Students Management
1. From dashboard, click "Students Management"
2. Click "Add Student" to add a new student
3. Fill in all required fields
4. Click "Add Student"
5. Student should appear in the list
6. Test edit and delete functions

### 4. Logout
1. Click the logout icon in the dashboard header
2. Should redirect to `/admin/login`
3. Try accessing protected routes - should redirect to login

---

## Default Data

When first accessing the admin panel, the system starts with empty datasets for both events and students. You'll need to add:

1. **Events:** Use the Events Management page to add college events
2. **Students:** Use the Students Management page to add student accounts

---

## Troubleshooting

### "Invalid admin credentials" error
- Ensure you're using the exact credentials (case-sensitive)
- Email: `Adminmbcet@mbcet.ac.in`
- Password: `T9#kL2!vQ7@pZ4$h`

### Redirected to login when accessing admin routes
- Check if admin token exists in localStorage
- Try logging in again
- Clear browser cache and localStorage if issues persist

### Changes not persisting
- In mock mode, data is stored in localStorage
- Clearing browser data will reset everything
- Consider exporting important data before clearing cache

---

## Next Steps

1. ✅ Admin authentication implemented
2. ✅ Admin routes protected
3. ✅ Events management complete
4. ✅ Students management complete
5. ⏳ Connect to Flask backend (when ready)
6. ⏳ Implement proper security measures for production
7. ⏳ Add analytics and reporting features
8. ⏳ Implement bulk operations (import/export CSV)
9. ⏳ Add role-based permissions (super admin, event manager, etc.)
10. ⏳ Implement audit logging
