# whatsnext? (WN?) - Database Synchronization Architecture

## 📊 Complete Data Flow & Synchronization Map

### Current Status: **localStorage (Mock Mode)** → Transitioning to **Flask Backend + Database**

---

## 🗄️ DATABASE TABLES REQUIRED

### 1. **students** table
```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    branch VARCHAR(50) NOT NULL,
    year VARCHAR(10) NOT NULL,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    profile_picture TEXT,  -- Base64 or file path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**What Modifies This:**
- ✅ Admin adds student → INSERT
- ✅ Admin edits student → UPDATE
- ✅ Admin deletes student → DELETE
- ✅ Student updates profile (name, phone, picture) → UPDATE
- ✅ Student changes password → UPDATE

**Who Needs to See Changes:**
- Admin Portal: Student Management page
- Student Portal: Login, Profile, Account Settings

---

### 2. **events** table
```sql
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price_early_bird DECIMAL(10,2),
    price_regular DECIMAL(10,2),
    capacity INTEGER,
    cover_image TEXT,  -- Base64 or file path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**What Modifies This:**
- ✅ Admin creates event → INSERT
- ✅ Admin edits event → UPDATE
- ✅ Admin deletes event → DELETE

**Who Needs to See Changes:**
- Admin Portal: Events Management, Dashboard stats
- Student Portal: Home page (events list), Event Details page

---

### 3. **coordinators** table
```sql
CREATE TABLE coordinators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    photo TEXT,  -- Base64 or file path
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

**What Modifies This:**
- ✅ Admin adds coordinator when creating/editing event → INSERT/UPDATE
- ✅ Admin deletes event → CASCADE DELETE coordinators

**Who Needs to See Changes:**
- Admin Portal: Event form
- Student Portal: Event Details page (contact coordinators section)

---

### 4. **bookings** table
```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    ticket_type VARCHAR(50) NOT NULL,  -- 'Early Bird' or 'Regular'
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    qr_code TEXT,  -- Generated QR code data
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'cancelled', 'used'
    FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

**What Modifies This:**
- ✅ Student checks out from cart → INSERT (multiple rows)
- ✅ Student cancels ticket → UPDATE status = 'cancelled'
- ✅ Admin marks ticket as used (QR scan) → UPDATE status = 'used'

**Who Needs to See Changes:**
- Admin Portal: Dashboard (booking stats), Booking Management (if implemented)
- Student Portal: My Tickets page

---

### 5. **notifications** table
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_email VARCHAR(255),  -- NULL for broadcast notifications
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'booking', 'event', 'system'
    icon VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE
);
```

**What Modifies This:**
- ✅ System creates notification on booking → INSERT
- ✅ Admin sends announcement → INSERT (broadcast to all)
- ✅ Student marks notification as read → UPDATE

**Who Needs to See Changes:**
- Student Portal: Notifications page, bell icon count

---

## 🔄 SYNCHRONIZATION REQUIREMENTS

### **localStorage Keys (Current Mock System)**

| Key | Data Type | Modified By | Read By |
|-----|-----------|-------------|---------|
| `studentsData` | Student[] | Admin Portal | Admin Portal, Student Login |
| `eventsData` | Event[] | Admin Portal | Admin Portal, Student Home/Details |
| `bookedTickets` | Booking[] | Student Portal | Student Portal (My Tickets) |
| `cart` | CartItem[] | Student Portal | Student Portal (Cart) |
| `notifications` | Notification[] | System | Student Portal |
| `userName` | string | Login | All Student Pages |
| `userEmail` | string | Login | All Student Pages |
| `userPhone` | string | Account Settings | Profile Pages |
| `userProfilePicture` | string (base64) | Account Settings | Profile Pages |
| `adminToken` | string | Admin Login | Admin API calls |
| `adminEmail` | string | Admin Settings | Admin Login |
| `adminPassword` | string | Admin Settings | Admin Login |
| `adminContactInfo` | ContactInfo | Admin Settings | Contact Admin Modals |

---

## 🔀 DATA FLOW DIAGRAMS

### **Scenario 1: Admin Adds New Student**
```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN PORTAL - Students Management                          │
│                                                              │
│ 1. Admin fills form:                                        │
│    - Name: "John Doe"                                       │
│    - Email: "john.cs21@mbcet.ac.in"                        │
│    - Password: "john123"                                    │
│    - Branch: "CS"                                           │
│    - Year: "2"                                              │
│                                                              │
│ 2. Click "Add Student"                                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ AdminService.addStudent()                                   │
│                                                              │
│ CURRENT (Mock):                                             │
│   localStorage.setItem("studentsData", [...])               │
│                                                              │
│ FUTURE (Flask):                                             │
│   POST /api/admin/students                                  │
│   → Database INSERT into students table                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ IMMEDIATE EFFECTS:                                          │
│                                                              │
│ ✅ Admin Dashboard: Student count updates                   │
│ ✅ Students Management: New student appears in list         │
│ ✅ Student Login Page: Can login with new credentials       │
│ ✅ Database: New row in students table                      │
└─────────────────────────────────────────────────────────────┘
```

### **Scenario 2: Student Updates Profile**
```
┌─────────────────────────────────────────────────────────────┐
│ STUDENT PORTAL - Account Settings                           │
│                                                              │
│ 1. Student edits:                                           │
│    - Name: "John Doe Jr."                                   │
│    - Phone: "+91 9876543210"                                │
│    - Profile Picture: [uploads new photo]                   │
│                                                              │
│ 2. Click "Save Changes"                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ StudentService.updateProfile() [NEEDS TO BE CREATED]        │
│                                                              │
│ CURRENT (Mock):                                             │
│   localStorage.setItem("userName", ...)                     │
│   localStorage.setItem("userPhone", ...)                    │
│   localStorage.setItem("userProfilePicture", ...)           │
│   ALSO UPDATE studentsData array! ← MISSING                 │
│                                                              │
│ FUTURE (Flask):                                             │
│   PUT /api/students/{email}                                 │
│   → Database UPDATE students table                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ REQUIRED EFFECTS:                                           │
│                                                              │
│ ✅ Student Profile: Shows updated info                      │
│ ✅ Admin Portal: Student Management shows new info          │
│ ✅ Database: Updated row in students table                  │
│ ❌ Currently NOT syncing to Admin Portal                    │
└─────────────────────────────────────────────────────────────┘
```

### **Scenario 3: Admin Creates/Edits Event**
```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN PORTAL - Events Management                            │
│                                                              │
│ 1. Admin creates event:                                     │
│    - Title: "TechFest 2026"                                 │
│    - Date, Venue, Price, etc.                               │
│    - Coordinators: [adds 2 coordinators with photos]        │
│                                                              │
│ 2. Click "Create Event"                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ AdminService.createEvent()                                  │
│                                                              │
│ CURRENT (Mock):                                             │
│   localStorage.setItem("eventsData", [...])                 │
│                                                              │
│ FUTURE (Flask):                                             │
│   POST /api/admin/events                                    │
│   → Database INSERT into events table                       │
│   → Database INSERT into coordinators table (foreach)       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ IMMEDIATE EFFECTS:                                          │
│                                                              │
│ ✅ Admin Dashboard: Event count updates                     │
│ ✅ Events Management: New event appears                     │
│ ✅ Student Home Page: Event appears in listings             │
│ ✅ Student Event Details: Can view full details + coords    │
│ ✅ Database: New rows in events + coordinators tables       │
└─────────────────────────────────────────────────────────────┘
```

### **Scenario 4: Student Books Event**
```
┌─────────────────────────────────────────────────────────────┐
│ STUDENT PORTAL - Cart Page                                  │
│                                                              │
│ 1. Student has items in cart                                │
│ 2. Click "Proceed to Checkout"                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ handleCheckout() [IN CART PAGE]                             │
│                                                              │
│ CURRENT (Mock):                                             │
│   localStorage.setItem("bookedTickets", [...])              │
│   localStorage.setItem("notifications", [...])              │
│                                                              │
│ FUTURE (Flask):                                             │
│   POST /api/bookings                                        │
│   → Database INSERT into bookings table (foreach item)      │
│   → Database INSERT notification                            │
│   → Generate QR codes                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ IMMEDIATE EFFECTS:                                          │
│                                                              │
│ ✅ Student My Tickets: Tickets appear with QR codes         │
│ ✅ Student Notifications: Booking confirmation appears      │
│ ✅ Admin Dashboard: Booking stats update                    │
│ ✅ Database: New rows in bookings + notifications tables    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 CRITICAL MISSING SYNC

### **Student Profile Changes NOT Syncing to Admin**

**Problem:**
When student updates profile in Account Settings:
- ✅ Updates localStorage: `userName`, `userPhone`, `userProfilePicture`
- ❌ Does NOT update localStorage: `studentsData` array
- ❌ Admin sees old student information

**Solution Required:**
```typescript
// In AccountSettings.tsx handleSubmit()
const handleUpdateProfile = async () => {
  // Update student's own session data
  localStorage.setItem("userName", formData.name);
  localStorage.setItem("userPhone", formData.phone);
  
  // ALSO UPDATE studentsData for Admin Portal visibility
  const studentsData = localStorage.getItem("studentsData");
  if (studentsData) {
    const students = JSON.parse(studentsData);
    const index = students.findIndex(s => s.email === currentEmail);
    if (index !== -1) {
      students[index] = {
        ...students[index],
        name: formData.name,
        phone: formData.phone,
        // Note: password change requires separate secure flow
      };
      localStorage.setItem("studentsData", JSON.stringify(students));
    }
  }
  
  // When Flask backend is ready:
  // await StudentService.updateProfile(currentEmail, updates);
};
```

---

## 🔐 PASSWORD CHANGE FLOW

### **Student Changes Password**

**Requirements:**
1. Verify current password
2. Update password in database
3. Update studentsData for login validation
4. Send email notification (optional)

```typescript
// New endpoint needed:
PUT /api/students/{email}/password
Body: { currentPassword, newPassword }

// Workflow:
1. Verify currentPassword matches database
2. Hash newPassword
3. UPDATE students SET password = hashedPassword WHERE email = ?
4. Return success
5. Frontend updates localStorage studentsData
```

---

## 📡 FLASK API ENDPOINTS NEEDED

### **Student Endpoints**
```
GET    /api/students/{email}          - Get student profile
PUT    /api/students/{email}          - Update student profile
PUT    /api/students/{email}/password - Change password
POST   /api/students/login            - Student authentication
```

### **Admin Endpoints (Already planned)**
```
GET    /api/admin/students            - List all students
POST   /api/admin/students            - Add new student
PUT    /api/admin/students/{email}    - Update student
DELETE /api/admin/students/{email}    - Delete student

GET    /api/admin/events              - List all events
POST   /api/admin/events              - Create event (+ coordinators)
PUT    /api/admin/events/{id}         - Update event (+ coordinators)
DELETE /api/admin/events/{id}         - Delete event
POST   /api/admin/login               - Admin authentication
```

### **Booking Endpoints**
```
GET    /api/bookings?email={email}    - Get student's bookings
POST   /api/bookings                  - Create booking(s)
PUT    /api/bookings/{id}/cancel      - Cancel booking
GET    /api/admin/bookings            - Get all bookings (admin)
PUT    /api/admin/bookings/{id}/use   - Mark ticket as used (QR scan)
```

### **Notification Endpoints**
```
GET    /api/notifications?email={email} - Get student notifications
PUT    /api/notifications/read-all       - Mark all as read
POST   /api/admin/notifications          - Send broadcast notification
```

---

## 🎯 IMPLEMENTATION PRIORITY

### **Phase 1: Fix Current localStorage Sync Issues**
1. ✅ Admin → Student sync (DONE)
2. ❌ Student → Admin sync (NEEDS FIX)
   - Update studentsData when student updates profile
   - Add phone field to Student interface
   - Sync profile picture to admin view

### **Phase 2: Prepare for Flask Backend**
1. Create StudentService (similar to AdminService)
2. Add API endpoints to AdminService (mode switching)
3. Test with USE_MOCK = false when Flask is ready

### **Phase 3: Database Migration**
1. Create database schema (SQL above)
2. Import initial student data from student-list.txt
3. Migrate events from defaultEvents
4. Switch USE_MOCK = false

### **Phase 4: Real-time Features**
1. WebSocket for live event updates
2. Real-time booking counts
3. Live notification push

---

## 📝 SUMMARY OF WHAT MUST SYNC

| Change | Modified In | Must Reflect In |
|--------|-------------|-----------------|
| **Admin adds student** | Admin Portal | → Student Login, Admin Dashboard |
| **Admin edits student** | Admin Portal | → Student Login (if email/pwd changed), Admin views |
| **Admin deletes student** | Admin Portal | → Student cannot login, Admin Dashboard count |
| **Admin creates event** | Admin Portal | → Student Home/Details, Admin Dashboard |
| **Admin edits event** | Admin Portal | → Student Event Details, Admin Events |
| **Admin deletes event** | Admin Portal | → Student Home (removed), Admin Dashboard |
| **Student updates profile** | Student Portal | → Admin Student Management, Student Profile |
| **Student changes password** | Student Portal | → Student Login, Admin sees updated pwd |
| **Student books event** | Student Portal | → My Tickets, Admin Bookings, Dashboard stats |
| **Student cancels booking** | Student Portal | → My Tickets, Admin Bookings, Dashboard stats |

---

## 🔧 FILES THAT NEED MODIFICATION

1. **`/src/app/services/studentService.ts`** - CREATE NEW
   - updateProfile()
   - changePassword()
   - getProfile()

2. **`/src/app/pages/AccountSettings.tsx`** - MODIFY
   - Fix handleSubmit to update studentsData
   - Add phone field to Student interface

3. **`/src/app/services/adminService.ts`** - MODIFY
   - Add phone field to Student interface
   - Ensure all updates propagate correctly

4. **`/src/app/pages/admin/StudentsManagement.tsx`** - MODIFY
   - Display phone number in student cards
   - Show profile picture if available

---

**Last Updated:** March 11, 2026  
**Status:** localStorage sync working for Admin→Student, needs Student→Admin fix