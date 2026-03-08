import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase (primary app)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize secondary Firebase app for user creation (to avoid logging out current user)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

/**
 * Returns the Firebase Messaging instance, or null if not supported.
 * FCM is not supported in all environments (e.g. Safari < 16, Firefox private).
 */
let _messaging = null;
const getAppMessaging = async () => {
  if (_messaging) return _messaging;
  const supported = await isSupported();
  if (supported) {
    _messaging = getMessaging(app);
  }
  return _messaging;
};

export { auth, db, app, secondaryAuth, getAppMessaging };
