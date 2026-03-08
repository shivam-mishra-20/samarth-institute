import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { USER_ROLES } from "../constants/roles";

const StudentFeedback = () => {
  const { user, userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchMyFeedbacks();
  }, [user]);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const studentsQuery = query(
        collection(db, "users"),
        where("role", "==", USER_ROLES.STUDENT)
      );
      const snapshot = await getDocs(studentsQuery);
      const studentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Fetch feedbacks given by the current teacher/admin
  const fetchMyFeedbacks = async () => {
    try {
      setLoading(true);
      const feedbackQuery = query(
        collection(db, "studentFeedbacks"),
        where("teacherId", "==", user?.uid)
      );
      const snapshot = await getDocs(feedbackQuery);
      const feedbackList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeedbacks(feedbackList);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate document ID: student_class_date_teacher
  const generateDocId = (student) => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, ""); // HHMMSS
    const studentName = (student?.name || "unknown").replace(/\s+/g, "_").toLowerCase();
    const studentClass = (student?.class || "unknown").replace(/\s+/g, "_").toLowerCase();
    const teacherName = (userData?.name || user?.email || "unknown").replace(/\s+/g, "_").toLowerCase();
    
    return `${studentName}_${studentClass}_${dateStr}${timeStr}_${teacherName}`;
  };

  // Submit feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !feedbackText.trim()) {
      setError("Please select a student and enter feedback");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const student = students.find((s) => s.id === selectedStudent);
      const docId = generateDocId(student);
      const now = new Date();

      await setDoc(doc(db, "studentFeedbacks", docId), {
        studentId: selectedStudent,
        studentName: student?.name || "Unknown",
        studentClass: student?.class || "",
        studentBatch: student?.batch || "",
        studentCustomUid: student?.customUid || "",
        feedback: feedbackText.trim(),
        teacherId: user?.uid,
        teacherName: userData?.name || user?.email,
        createdAt: now.toISOString(),
        date: now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });

      setSuccess("Feedback submitted successfully!");
      setFeedbackText("");
      setSelectedStudent("");
      fetchMyFeedbacks(); // Refresh the list
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDateTime = (feedback) => {
    if (feedback.date && feedback.time) {
      return `${feedback.date} at ${feedback.time}`;
    }
    if (feedback.createdAt) {
      const date = new Date(feedback.createdAt);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return "Unknown date";
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Student Feedback
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Add feedback for students and view your previous submissions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Feedback Form */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Add New Feedback
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmitFeedback}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Student
                      </label>
                      <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      >
                        <option value="">-- Select a student --</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name}{" "}
                            {student.class && `(${student.class})`}{" "}
                            {student.batch && `- ${student.batch}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback / Comment
                      </label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter your feedback about the student..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
                    >
                      {submitting ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Previous Feedbacks */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    My Previous Feedbacks
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {feedbacks.length} feedback{feedbacks.length !== 1 ? "s" : ""} submitted
                  </p>
                </div>
                <div className="p-4 sm:p-6 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading feedbacks...
                    </div>
                  ) : feedbacks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <p className="mt-2">No feedbacks submitted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {feedback.studentName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {feedback.studentClass}
                                {feedback.studentBatch &&
                                  ` | ${feedback.studentBatch}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {formatDateTime(feedback)}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap text-sm">
                            {feedback.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentFeedback;
