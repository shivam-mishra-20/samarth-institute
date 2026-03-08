/**
 * Samarth LMS – Cloud Functions
 *
 * Triggered when a new announcement document is created in Firestore.
 * Sends an FCM push notification to all registered device tokens.
 *
 * Deploy with: firebase deploy --only functions
 * Requires: Firebase Blaze (pay-as-you-go) plan for outbound network calls.
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// Human-readable labels for each announcement type
const TYPE_LABELS = {
  exam_alert: "📝 Exam Alert",
  holiday_notice: "🎉 Holiday Notice",
  motivational: "⭐ Motivational",
  result_announcement: "📊 Result Announcement",
  important_update: "⚠️ Important Update",
};

/**
 * Listens for new documents in `announcements/{docId}`.
 * Sends FCM multicast notification to all registered tokens
 * whose role matches the announcement's targetRoles.
 */
exports.onNewAnnouncement = onDocumentCreated(
  "announcements/{docId}",
  async (event) => {
    const announcement = event.data?.data();
    if (!announcement) return;

    // Skip if announcement is inactive
    if (!announcement.isActive) {
      console.log("Announcement is inactive – skipping notification.");
      return;
    }

    const typeLabel =
      TYPE_LABELS[announcement.type] || "📢 Announcement";
    const targetRoles = announcement.targetRoles || [
      "student",
      "parent",
      "teacher",
      "admin",
    ];

    try {
      // Fetch all stored FCM tokens
      const tokensSnapshot = await db.collection("fcm_tokens").get();
      if (tokensSnapshot.empty) {
        console.log("No FCM tokens registered – skipping.");
        return;
      }

      // Filter by target roles
      const tokens = [];
      tokensSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.token && targetRoles.includes(data.role)) {
          tokens.push(data.token);
        }
      });

      if (tokens.length === 0) {
        console.log(
          "No tokens matched target roles:",
          targetRoles.join(", ")
        );
        return;
      }

      const announcementId = event.params.docId;
      const notifTitle = `${typeLabel}: ${announcement.title}`;
      const notifBody =
        announcement.content.length > 120
          ? announcement.content.substring(0, 120) + "…"
          : announcement.content;

      // FCM allows max 500 tokens per multicast
      const BATCH_SIZE = 500;
      const batches = [];
      for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        batches.push(tokens.slice(i, i + BATCH_SIZE));
      }

      let totalSuccess = 0;
      let totalFailure = 0;
      const invalidTokens = [];

      for (const batch of batches) {
        const message = {
          tokens: batch,
          notification: {
            title: notifTitle,
            body: notifBody,
          },
          data: {
            announcementId,
            type: announcement.type,
            priority: announcement.priority || "medium",
            url: "/announcements",
          },
          webpush: {
            notification: {
              icon: "/favicon.ico",
              badge: "/favicon.ico",
              requireInteraction: announcement.priority === "high",
              actions: [{ action: "view", title: "View" }],
            },
            fcm_options: {
              link: "/announcements",
            },
          },
          android: {
            notification: {
              color: "#4F46E5",
              sound: "default",
            },
            priority:
              announcement.priority === "high" ? "high" : "normal",
          },
        };

        const result = await messaging.sendEachForMulticast(message);
        totalSuccess += result.successCount;
        totalFailure += result.failureCount;

        // Collect invalid / unregistered tokens for cleanup
        result.responses.forEach((resp, idx) => {
          if (
            !resp.success &&
            (resp.error?.code ===
              "messaging/invalid-registration-token" ||
              resp.error?.code ===
                "messaging/registration-token-not-registered")
          ) {
            invalidTokens.push(batch[idx]);
          }
        });
      }

      console.log(
        `FCM sent – success: ${totalSuccess}, failures: ${totalFailure}`
      );

      // Clean up stale / invalid tokens
      if (invalidTokens.length > 0) {
        const cleanupBatch = db.batch();
        for (const staleToken of invalidTokens) {
          const staleQuery = await db
            .collection("fcm_tokens")
            .where("token", "==", staleToken)
            .get();
          staleQuery.forEach((doc) => cleanupBatch.delete(doc.ref));
        }
        await cleanupBatch.commit();
        console.log(
          `Cleaned up ${invalidTokens.length} stale FCM tokens.`
        );
      }

      // Record delivery stats on the announcement document
      await event.data.ref.update({
        fcmSent: true,
        fcmSentAt: admin.firestore.FieldValue.serverTimestamp(),
        fcmSuccessCount: totalSuccess,
        fcmFailureCount: totalFailure,
      });
    } catch (error) {
      console.error("Error sending FCM notification:", error);
    }
  }
);
