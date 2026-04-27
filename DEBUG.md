# Debug Guide for WhatNext? App

## Issue 1: Events not appearing in LIVE/COMING SOON tabs

### How to diagnose:

1. **Open Browser Console** (F12 or Cmd+Option+I)

2. **Check what events are loaded:**
   - Navigate to the home page as a student
   - Look for console log: `🏠 Home page loaded events:`
   - This will show all events with their categories

3. **Check event filtering:**
   - Switch between LIVE and COMING SOON tabs
   - Look for logs like: `❌ Event "X" category "Y" doesn't match tab "Z"`
   - This shows which events are being filtered out and why

4. **Check event creation:**
   - Go to admin portal
   - Create a new event
   - Look for log: `💾 Saving event with category:`
   - Then: `✅ Creating new event:` with event details
   - Finally: `💾 Total events in storage:`

5. **Check localStorage directly:**
   ```javascript
   // In browser console
   const events = JSON.parse(localStorage.getItem('eventsData'));
   console.table(events.map(e => ({
     title: e.title,
     category: e.category,
     subtitle: e.subtitle
   })));
   ```

### Expected values:
- `category` should be either `"live"` or `"coming-soon"`
- `subtitle` should have a value
- All required fields should be present

## Issue 2: Photos showing errors

### How to diagnose:

1. **Check localStorage size:**
   ```javascript
   // In browser console
   let totalSize = 0;
   for (const key in localStorage) {
     if (localStorage.hasOwnProperty(key)) {
       totalSize += localStorage[key].length + key.length;
     }
   }
   console.log('Total size:', (totalSize / (1024 * 1024)).toFixed(2), 'MB');
   ```

2. **Check if images are compressed:**
   - Upload a photo in admin portal
   - Look for toast: "Image uploaded & compressed"
   - Check console for: `📊 Total localStorage size:`

3. **Check for image errors:**
   - Look for console error: `Failed to load image for event:`
   - Or: `Failed to load coordinator image:`
   - If fallback is working, images should still display

### Solutions implemented:

1. **Image compression:**
   - Event covers: compressed to max 800px width, 80% quality
   - Coordinator photos: compressed to max 200px width, 70% quality

2. **Error handling:**
   - Images that fail to load fallback to Unsplash placeholder
   - Error is logged to console for debugging

3. **Storage monitoring:**
   - After saving event, check console for storage stats
   - Warning if localStorage > 4MB

## Quick Fix Commands

### Clear all events and start fresh:
```javascript
localStorage.removeItem('eventsData');
location.reload();
```

### Clear all data:
```javascript
localStorage.clear();
location.reload();
```

### Manually set an event category:
```javascript
const events = JSON.parse(localStorage.getItem('eventsData'));
events[0].category = 'live'; // or 'coming-soon'
localStorage.setItem('eventsData', JSON.stringify(events));
location.reload();
```
