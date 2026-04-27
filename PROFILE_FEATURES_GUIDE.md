# Profile Features Implementation Guide

## Features Implemented

### 1. **Change Password**
Located in: `/src/app/pages/Security.tsx`

**Current Behavior (localStorage):**
- Validates current password against stored password
- Ensures new password is at least 6 characters
- Ensures new password is different from current password
- Updates password in localStorage
- Logs user out for security after password change

**How it works:**
1. User enters current password, new password, and confirmation
2. Frontend validates the passwords
3. Calls `AuthService.changePassword(currentPassword, newPassword)`
4. On success, logs user out and redirects to login

### 2. **Profile Picture Upload**
Located in: `/src/app/pages/AccountSettings.tsx`

**Current Behavior (localStorage):**
- Allows user to upload images (JPG, PNG, GIF)
- Validates file type and size (max 5MB)
- Converts image to base64 string for storage
- Stores in localStorage as `userProfilePicture`
- Displays in Profile page

**How it works:**
1. User clicks "Upload Photo" button
2. Selects image file from device
3. Image is validated and converted to base64
4. User clicks "Save Changes" to persist
5. Calls `AuthService.updateProfile({ profilePicture: base64String })`

### 3. **Phone Number Update**
Located in: `/src/app/pages/AccountSettings.tsx`

**Current Behavior (localStorage):**
- Allows user to update phone number
- Validates phone number format
- Stores in localStorage as `userPhone`
- Displays in Profile page

**How it works:**
1. User edits phone number in input field
2. Clicks "Save Changes"
3. Frontend validates phone format
4. Calls `AuthService.updateProfile({ phone: phoneNumber })`

---

## Flask Backend Integration

When ready to connect to your Flask backend, update the following in `/src/app/services/authService.ts`:

### Change `USE_MOCK` to `false`
```typescript
private static USE_MOCK = false; // Enable Flask backend
```

### Required Flask API Endpoints

#### 1. Change Password Endpoint
```
POST /api/auth/change-password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "string",
  "newPassword": "string"
}
Response: {
  "success": true,
  "message": "Password changed successfully"
}
```

#### 2. Update Profile Endpoint
```
PUT /api/user/profile
Headers: Authorization: Bearer <token>
Body: {
  "name": "string" (optional),
  "phone": "string" (optional),
  "profilePicture": "base64_string" (optional)
}
Response: {
  "success": true,
  "user": {
    "name": "string",
    "phone": "string",
    "profilePicture": "url_or_base64"
  }
}
```

---

## localStorage Keys Used

- `userName` - User's full name
- `userEmail` - User's email (read-only, linked to college ID)
- `userPassword` - User's password (for mock validation only)
- `userPhone` - User's phone number
- `userProfilePicture` - Base64 encoded profile picture
- `authToken` - JWT token for authenticated requests

---

## Security Considerations

### For Production with Flask:

1. **Password Storage**
   - Never store passwords in localStorage
   - Flask should hash passwords using bcrypt or similar
   - Only store password hashes in database

2. **Profile Pictures**
   - Base64 encoding works for localStorage
   - For Flask backend, consider uploading to cloud storage (AWS S3, Cloudinary)
   - Store image URLs in database instead of base64
   - Implement file size limits on backend

3. **Phone Number**
   - Validate phone numbers on backend
   - Consider adding phone verification via OTP
   - Store in database with proper validation

4. **Authentication**
   - All update endpoints should require valid JWT token
   - Validate token on every request
   - Implement rate limiting for security endpoints

---

## Testing the Features

### Change Password:
1. Go to Profile → Security
2. Enter current password (for mock mode, check localStorage or use default)
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Update Password"
6. You'll be logged out and redirected to login

### Profile Picture:
1. Go to Profile → Account Settings
2. Click "Upload Photo"
3. Select an image file (JPG, PNG, or GIF, max 5MB)
4. Click "Save Changes"
5. Go back to Profile to see updated picture

### Phone Number:
1. Go to Profile → Account Settings
2. Edit phone number field
3. Click "Save Changes"
4. Go back to Profile to see updated phone number

---

## Next Steps for Flask Integration

1. Create Flask endpoints as documented above
2. Update `AuthService.BASE_URL` to point to your Flask API
3. Set `USE_MOCK = false` in authService.ts
4. Test all features with real API
5. Implement proper error handling on backend
6. Add validation and security measures
7. Consider migrating from base64 to cloud storage for images

---

## Files Modified

- `/src/app/services/authService.ts` - Added changePassword() and updateProfile() methods
- `/src/app/pages/Security.tsx` - Connected to AuthService for password change
- `/src/app/pages/AccountSettings.tsx` - Added profile picture upload and connected to AuthService
- `/src/app/pages/Profile.tsx` - Display profile picture and phone number
