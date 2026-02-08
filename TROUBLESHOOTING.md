# Troubleshooting "Unknown SID" Error

## Steps to fix:

### 1. Clear ALL browser data for localhost:5173

```
1. Open Dev Tools (F12)
2. Go to Application tab
3. Click "Clear site data" button
4. OR manually delete:
   - Local Storage (all items)
   - Session Storage (all items)
   - IndexedDB (all databases)
   - Cookies
```

### 2. Close browser completely and reopen

### 3. Make sure .env file is being loaded:

Add this temporarily to Login.jsx to verify:

```javascript
console.log("Firebase Config:", {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
});
```

### 4. Verify the user exists in the CORRECT Firebase project:

Go to Firebase Console:

- https://console.firebase.google.com/
- Select project: `samarth-project-fec8a`
- Go to Authentication → Users
- Search for the email - **Is it there?**

If NOT there, the user was created in a different project!

## Most likely cause:

The user account exists in Firebase Project A, but the .env points to Firebase Project B.

## Solution:

Either:

1. Create the user in the CORRECT project (samarth-project-fec8a), OR
2. Update .env to point to the project where the user actually exists
