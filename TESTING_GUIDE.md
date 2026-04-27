# Testing Guide - Admin & Student Portal Synchronization

## How to Verify the Synchronization is Working

### Test 1: Student Count Synchronization

#### Steps:
1. **Login as Admin**
   - Go to student login page
   - Enter: `Adminmbcet@mbcet.ac.in` / `therealadmin@mbcet`
   - You'll be automatically redirected to Admin Dashboard

2. **Note the Initial Student Count**
   - Look at the "Total Students" card in the Overview section
   - Also check the count on the "Students Management" card
   - Both should show the same number

3. **Add a New Student**
   - Click on "Students Management"
   - Note the count in the subtitle (e.g., "25 students registered")
   - Click "Add Student"
   - Fill in the form:
     - Name: Test Student
     - Email: test.student@mbcet.ac.in
     - Password: testpass123
     - Branch: CSE
     - Year: 1
     - Admission Number: MBCET2026001
   - Click "Add Student"

4. **Verify Count Updated**
   - ✅ Subtitle should now show "26 students registered" (or +1 from before)
   - Click back to Dashboard
   - ✅ "Total Students" should now show the new count
   - ✅ "Students Management" card should show the new count

5. **Test Student Login**
   - Logout from admin (click logout button)
   - On the login page, use the new student credentials:
     - Email: test.student@mbcet.ac.in
     - Password: testpass123
   - ✅ Should successfully login and see the student home page

**Expected Result:** ✅ Student count updates everywhere, and new student can login immediately.

---

### Test 2: Student Deletion Synchronization

#### Steps:
1. **Login as Admin**
2. **Go to Students Management**
3. **Delete the Test Student**
   - Find "Test Student" in the list
   - Click the trash icon
   - Confirm deletion
   - ✅ Student should be removed from the list
   - ✅ Count should decrease by 1

4. **Verify Dashboard Count**
   - Go back to Dashboard
   - ✅ "Total Students" should reflect the decrease

5. **Test Student Cannot Login**
   - Logout from admin
   - Try to login with: test.student@mbcet.ac.in / testpass123
   - ✅ Should show error: "Invalid email or password"

**Expected Result:** ✅ Student count decreases, deleted student cannot login.

---

### Test 3: Event Count Synchronization

#### Steps:
1. **Login as Admin**
2. **Note Initial Event Count**
   - Look at "Active Events" in Overview
   - Note the count on "Events Management" card

3. **Add a New Event**
   - Click "Events Management"
   - Note the count in subtitle (e.g., "12 events listed")
   - Click "Add Event"
   - Fill in a basic event (title, date, venue, etc.)
   - Save the event

4. **Verify Counts Updated**
   - ✅ Subtitle should show increased count
   - Go back to Dashboard
   - ✅ "Active Events" should show the new count
   - ✅ "Events Management" card should show the new count

5. **Check Student Portal**
   - Login as a student
   - ✅ The new event should appear on the home page

**Expected Result:** ✅ Event count updates everywhere, new event appears for students.

---

### Test 4: Event Deletion Synchronization

#### Steps:
1. **Login as Admin**
2. **Go to Events Management**
3. **Delete an Event**
   - Click delete on any event
   - Confirm deletion
   - ✅ Event disappears from list
   - ✅ Count decreases

4. **Verify Dashboard**
   - Go back to Dashboard
   - ✅ "Active Events" count should decrease

5. **Check Student Portal**
   - Login as a student
   - Go to home page
   - ✅ Deleted event should not be visible

**Expected Result:** ✅ Event count decreases, event removed from student view.

---

### Test 5: Student Edit Synchronization

#### Steps:
1. **Login as Admin**
2. **Go to Students Management**
3. **Edit a Student's Password**
   - Click edit (pencil icon) on any student
   - Change the password to something new
   - Save the changes

4. **Test Login with New Password**
   - Logout from admin
   - Login as that student with the NEW password
   - ✅ Should login successfully
   - Try with the OLD password
   - ✅ Should fail with error

**Expected Result:** ✅ Password updates immediately, only new password works.

---

### Test 6: Event Edit Synchronization

#### Steps:
1. **Login as Admin**
2. **Go to Events Management**
3. **Edit an Event**
   - Click edit on any event
   - Change the title, venue, or price
   - Save changes

4. **Verify in Student Portal**
   - Login as a student
   - Find that event on home page
   - Click to view details
   - ✅ Should show the updated information

**Expected Result:** ✅ Event changes appear immediately in student portal.

---

### Test 7: Cross-Browser/Tab Synchronization

#### Steps:
1. **Open Two Browser Windows**
   - Window A: Login as Admin, go to Dashboard
   - Window B: Login as Student, view home page

2. **In Window A (Admin)**
   - Add a new event
   - Note the count update in Dashboard

3. **In Window B (Student)**
   - Refresh the page (or navigate away and back)
   - ✅ New event should appear

4. **In Window A (Admin)**
   - Delete an event

5. **In Window B (Student)**
   - Refresh the page
   - ✅ Deleted event should disappear

**Expected Result:** ✅ Changes persist across browser windows/tabs because localStorage is shared.

---

### Test 8: Dashboard Refresh Mechanisms

#### Steps:
1. **Login as Admin, go to Dashboard**
2. **Note the student count**
3. **Open Students Management in a NEW TAB**
4. **In the new tab, add a student**
5. **Switch back to Dashboard tab**
   - Click anywhere in the window to give it focus
   - ✅ Count should refresh and show the new count

**Expected Result:** ✅ Dashboard auto-refreshes when window gains focus.

---

## Browser Console Verification

You can also verify the synchronization directly in the browser console:

### Check Students Data
```javascript
const students = JSON.parse(localStorage.getItem('studentsData'));
console.log('Total Students:', students.length);
console.log('Students:', students);
```

### Check Events Data
```javascript
const events = JSON.parse(localStorage.getItem('eventsData'));
console.log('Total Events:', events.length);
console.log('Events:', events);
```

### Watch for Changes
```javascript
// Add a new student in admin portal, then run:
const students = JSON.parse(localStorage.getItem('studentsData'));
console.log('Student count:', students.length);
// The count should match what you see in the UI
```

---

## Expected Visual Indicators

When synchronization is working correctly, you should see:

✅ **Admin Dashboard:**
- Green "Active" status with pulsing dot in System Information
- Real-time count updates in Overview section
- Matching counts on management cards

✅ **Students Management:**
- Green banner: "Live Sync Active - Changes reflect instantly in Student Portal"
- Subtitle shows correct count: "X students registered"
- List updates immediately after add/edit/delete

✅ **Events Management:**
- Green banner: "Live Sync Active - Changes reflect instantly in Student Portal"
- Subtitle shows correct count: "X events listed"
- List updates immediately after add/edit/delete

✅ **Student Portal:**
- New students can login immediately after being added
- Deleted students cannot login
- Events list updates reflect admin changes (after page refresh)
- Event details show latest edited information

---

## Troubleshooting

### If counts don't match:

1. **Open browser console**
2. **Run:**
   ```javascript
   console.log('Students:', JSON.parse(localStorage.getItem('studentsData')).length);
   console.log('Events:', JSON.parse(localStorage.getItem('eventsData')).length);
   ```
3. **Compare with UI counts** - they should match

### If sync seems broken:

1. **Clear localStorage:**
   ```javascript
   localStorage.clear();
   ```
2. **Refresh the page** - data will reinitialize
3. **Test again**

### If student login fails after adding:

1. **Check in browser console:**
   ```javascript
   const students = JSON.parse(localStorage.getItem('studentsData'));
   console.log(students.find(s => s.email === 'student.email@mbcet.ac.in'));
   ```
2. **Verify email and password** match exactly

---

## Success Criteria

All tests should pass with these results:

- ✅ Student count in Admin Dashboard = Students in Students Management
- ✅ Event count in Admin Dashboard = Events in Events Management
- ✅ New students can login immediately
- ✅ Deleted students cannot login
- ✅ Edited student credentials work immediately
- ✅ New events appear in student portal
- ✅ Deleted events disappear from student portal
- ✅ Edited events show updated information
- ✅ Sync indicators show "Active" status
- ✅ Counts update in real-time
- ✅ Changes persist across browser tabs/windows

**If all tests pass, the synchronization is working perfectly!** 🎉
