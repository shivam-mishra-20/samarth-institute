/**
 * Samarth LMS – Cloud Functions
 *
 * Push notifications triggered by admin/teacher Firestore writes.
 * Covers: announcements, results, school_updates, assignments,
 *         homework_tasks, exam_schedules, timetable_entries, communication_messages.
 *
 * Deploy with: firebase deploy --only functions
 * Requires: Firebase Blaze (pay-as-you-go) plan for outbound network calls.
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// ─── Shared helper ────────────────────────────────────────────────────────────

/**
 * Fetch FCM tokens from Firestore filtered by roles, then send a multicast
 * FCM notification. Cleans up stale tokens automatically.
 *
 * @param {string[]} targetRoles  - e.g. ["student","parent"]
 * @param {string}   title        - Notification title
 * @param {string}   body         - Notification body (max ~140 chars)
 * @param {object}   data         - Extra key-value data sent with the message
 * @param {string}   deepLinkUrl  - URL to open when notification is tapped
 */
async function sendFCMToRoles(targetRoles, title, body, data = {}, deepLinkUrl = "/") {
  const tokensSnapshot = await db.collection("fcm_tokens").get();
  if (tokensSnapshot.empty) {
    console.log("[FCM] No tokens registered – skipping.");
    return { success: 0, failure: 0 };
  }

  const tokens = [];
  tokensSnapshot.forEach((doc) => {
    const d = doc.data();
    if (d.token && targetRoles.includes(d.role)) tokens.push(d.token);
  });

  if (tokens.length === 0) {
    console.log("[FCM] No tokens matched roles:", targetRoles.join(", "));
    return { success: 0, failure: 0 };
  }

  const BATCH_SIZE = 500;
  let totalSuccess = 0;
  let totalFailure = 0;
  const invalidTokens = [];

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);
    const message = {
      tokens: batch,
      notification: { title, body },
      data: { url: deepLinkUrl, ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) },
      webpush: {
        notification: {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          requireInteraction: data.priority === "high",
        },
        fcm_options: { link: deepLinkUrl },
      },
      android: {
        notification: { color: "#4F46E5", sound: "default" },
        priority: data.priority === "high" ? "high" : "normal",
      },
    };

    const result = await messaging.sendEachForMulticast(message);
    totalSuccess += result.successCount;
    totalFailure += result.failureCount;

    result.responses.forEach((resp, idx) => {
      if (!resp.success &&
        (resp.error?.code === "messaging/invalid-registration-token" ||
          resp.error?.code === "messaging/registration-token-not-registered")) {
        invalidTokens.push(batch[idx]);
      }
    });
  }

  // Clean up stale tokens
  if (invalidTokens.length > 0) {
    const writeBatch = db.batch();
    for (const staleToken of invalidTokens) {
      const q = await db.collection("fcm_tokens").where("token", "==", staleToken).get();
      q.forEach((d) => writeBatch.delete(d.ref));
    }
    await writeBatch.commit();
    console.log(`[FCM] Cleaned up ${invalidTokens.length} stale tokens.`);
  }

  console.log(`[FCM] Sent – success: ${totalSuccess}, failures: ${totalFailure}`);
  return { success: totalSuccess, failure: totalFailure };
}

/** Truncate a string to maxLen with ellipsis */
const truncate = (str = "", maxLen = 120) =>
  str.length > maxLen ? str.substring(0, maxLen) + "…" : str;

// ─── 1. Announcements ─────────────────────────────────────────────────────────

const ANNOUNCEMENT_TYPE_LABELS = {
  exam_alert: "📝 Exam Alert",
  holiday_notice: "🎉 Holiday Notice",
  motivational: "⭐ Motivational",
  result_announcement: "📊 Result Announcement",
  important_update: "⚠️ Important Update",
};

exports.onNewAnnouncement = onDocumentCreated("announcements/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc || !doc.isActive) return;

  const typeLabel = ANNOUNCEMENT_TYPE_LABELS[doc.type] || "📢 Announcement";
  const targetRoles = doc.targetRoles || ["student", "parent", "teacher", "admin"];

  const { success, failure } = await sendFCMToRoles(
    targetRoles,
    `${typeLabel}: ${doc.title}`,
    truncate(doc.content),
    { announcementId: event.params.docId, type: doc.type || "", priority: doc.priority || "medium" },
    "/announcements"
  );

  await event.data.ref.update({
    fcmSent: true,
    fcmSentAt: admin.firestore.FieldValue.serverTimestamp(),
    fcmSuccessCount: success,
    fcmFailureCount: failure,
  });
});

// ─── 2. Results ───────────────────────────────────────────────────────────────

exports.onNewResult = onDocumentCreated("results/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc) return;

  const subject = doc.subject || "a subject";
  const studentName = doc.studentName || "a student";
  const examType = doc.examType || "exam";

  await sendFCMToRoles(
    ["student", "parent"],
    `📊 New Result – ${subject}`,
    `${examType} result for ${studentName} has been posted. Check your results page.`,
    { resultId: event.params.docId, subject },
    "/results"
  );
});

// ─── 3. School Updates (news / events / bulletins) ───────────────────────────

exports.onNewSchoolUpdate = onDocumentCreated("school_updates/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc) return;

  const typeEmoji = doc.type === "event" ? "📅" : doc.type === "bulletin" ? "📌" : "📰";
  const typeLabel = doc.type ? doc.type.charAt(0).toUpperCase() + doc.type.slice(1) : "Update";

  await sendFCMToRoles(
    ["student", "parent", "teacher"],
    `${typeEmoji} School ${typeLabel}: ${doc.title || "New Update"}`,
    truncate(doc.details || ""),
    { updateId: event.params.docId, type: doc.type || "" },
    "/school-updates"
  );
});

// ─── 4. Assignments ───────────────────────────────────────────────────────────

exports.onNewAssignment = onDocumentCreated("assignments/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc) return;

  const subject = doc.subject || "";
  const dueDate = doc.dueDate ? ` (Due: ${doc.dueDate})` : "";

  await sendFCMToRoles(
    ["student", "parent"],
    `📚 New Assignment${subject ? " – " + subject : ""}`,
    `${doc.title || "New assignment"}${dueDate}. ${truncate(doc.instructions || "", 80)}`,
    { assignmentId: event.params.docId, subject },
    "/assignments"
  );
});

// ─── 5. Homework ──────────────────────────────────────────────────────────────

exports.onNewHomework = onDocumentCreated("homework_tasks/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc) return;

  const subject = doc.subject || "";
  const dueDate = doc.dueDate ? ` – Due ${doc.dueDate}` : "";

  await sendFCMToRoles(
    ["student", "parent"],
    `📖 Homework${subject ? ": " + subject : ""}${dueDate}`,
    truncate(doc.details || doc.title || "", 120),
    { homeworkId: event.params.docId, subject },
    "/homework"
  );
});

// ─── 6. Exam Schedules ────────────────────────────────────────────────────────

exports.onNewExam = onDocumentCreated("exam_schedules/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc) return;

  const subject = doc.subject || "";
  const examDate = doc.examDate ? ` on ${doc.examDate}` : "";

  await sendFCMToRoles(
    ["student", "parent"],
    `📝 Exam Scheduled: ${doc.examName || subject}`,
    `${subject} exam${examDate}. Max marks: ${doc.maxMarks || "N/A"}. ${truncate(doc.syllabus || "", 80)}`,
    { examId: event.params.docId, subject },
    "/exams"
  );
});

// ─── 7. Timetable Updates ─────────────────────────────────────────────────────

exports.onNewTimetableEntry = onDocumentCreated("timetable_entries/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc) return;

  const day = doc.dayOfWeek ? doc.dayOfWeek.charAt(0).toUpperCase() + doc.dayOfWeek.slice(1) : "a day";
  const time = doc.startTime ? ` at ${doc.startTime}` : "";

  await sendFCMToRoles(
    ["student", "parent"],
    `🗓️ Timetable Updated`,
    `${doc.subject || doc.title || "A period"} added on ${day}${time}.`,
    { timetableId: event.params.docId },
    "/timetable"
  );
});

// ─── 8. Communication Messages ────────────────────────────────────────────────

exports.onNewCommunication = onDocumentCreated("communication_messages/{docId}", async (event) => {
  const doc = event.data?.data();
  if (!doc) return;

  const categoryEmoji =
    doc.category === "urgent" ? "🚨" :
    doc.category === "parent-meeting" ? "👨‍👩‍👧" :
    doc.category === "fee-reminder" ? "💳" : "💬";

  const targetRoles = doc.category === "parent-meeting" || doc.category === "fee-reminder"
    ? ["parent"]
    : ["student", "parent", "teacher"];

  await sendFCMToRoles(
    targetRoles,
    `${categoryEmoji} ${doc.title || "New Message"}`,
    truncate(doc.details || "", 120),
    { messageId: event.params.docId, category: doc.category || "" },
    "/communication"
  );
});
