import { useState, useEffect, useRef } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, getAppMessaging } from "../config/firebase.config";
import { useAuth } from "../context/AuthContext";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * useFCMToken
 *
 * Handles browser push-notification permission, FCM token registration,
 * and foreground message delivery for the current authenticated user.
 *
 * - On mount: if permission is already "granted", silently registers token.
 * - requestPermissionAndGetToken(): call this from a user-gesture (button click)
 *   when permission has not been requested yet.
 * - foregroundNotification: the most recent message received while the tab is open.
 * - clearForegroundNotification(): dismiss the in-app toast.
 */
export const useFCMToken = () => {
  const { user, userRole } = useAuth();
  const [fcmToken, setFcmToken] = useState(null);
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [foregroundNotification, setForegroundNotification] = useState(null);
  const messagingRef = useRef(null);
  const listenerCleanupRef = useRef(null);

  // Register or refresh the FCM token and save it to Firestore
  const registerToken = async (messaging) => {
    try {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!token) return;
      setFcmToken(token);
      if (user) {
        await setDoc(
          doc(db, "fcm_tokens", user.uid),
          {
            token,
            userId: user.uid,
            role: userRole || "unknown",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      // Token fetch can fail when the service worker is not yet active
      console.warn("FCM token registration failed:", err.message);
    }
  };

  // Attach foreground message listener
  const attachListener = (messaging) => {
    if (listenerCleanupRef.current) listenerCleanupRef.current();
    const unsubscribe = onMessage(messaging, (payload) => {
      setForegroundNotification({
        id: Date.now(),
        title: payload.notification?.title || "New Announcement",
        body: payload.notification?.body || "",
        data: payload.data || {},
      });
    });
    listenerCleanupRef.current = unsubscribe;
  };

  /**
   * Request notification permission, acquire FCM token, and save to Firestore.
   * Call this from a button click so the browser permission prompt has a user gesture.
   */
  const requestPermissionAndGetToken = async () => {
    if (!user || typeof Notification === "undefined") return;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return;

      const messaging = await getAppMessaging();
      if (!messaging) return;
      messagingRef.current = messaging;
      attachListener(messaging);
      await registerToken(messaging);
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  // On mount: if permission is already granted, silently register token
  useEffect(() => {
    if (!user) return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    (async () => {
      const messaging = await getAppMessaging();
      if (!messaging) return;
      messagingRef.current = messaging;
      attachListener(messaging);
      await registerToken(messaging);
    })();

    return () => {
      if (listenerCleanupRef.current) listenerCleanupRef.current();
    };
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearForegroundNotification = () => setForegroundNotification(null);

  return {
    fcmToken,
    permission,
    foregroundNotification,
    clearForegroundNotification,
    requestPermissionAndGetToken,
  };
};
