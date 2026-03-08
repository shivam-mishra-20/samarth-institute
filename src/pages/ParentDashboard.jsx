import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase.config";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ParentDashboard = () => {
  const { user, userData } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [resultPercentage, setResultPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalAttendanceDays, setTotalAttendanceDays] = useState(0);
  const [subjectWiseResults, setSubjectWiseResults] = useState([]);
  const [subjectProgression, setSubjectProgression] = useState([]);
  const [error, setError] = useState("");
  const [studentFeedback, setStudentFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Helper function to convert subject names to short forms
  const getShortSubjectName = (subject) => {
    const shortForms = {
      Science: "Sci",
      "Social Science": "SS",
      English: "Eng",
      Hindi: "Hindi",
      Sanskrit: "Sanskrit",
      Physics: "Phy",
      Chemistry: "Chem",
      Biology: "Bio",
    };
    return shortForms[subject] || subject;
  };

  useEffect(() => {
    if (userData) {
      fetchLinkedStudentData();
    }
  }, [userData]);

  const fetchLinkedStudentData = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if parent has a linked student
      if (!userData?.studentUid) {
        setError(
          "No student linked to your account. Please contact the administrator to link your child's account.",
        );
        setLoading(false);
        return;
      }

      // Fetch the linked student's data from users collection by customUid
      const usersRef = collection(db, "users");
      const studentQuery = query(
        usersRef,
        where("customUid", "==", userData.studentUid),
      );
      const studentSnapshot = await getDocs(studentQuery);

      if (studentSnapshot.empty) {
        setError(
          "Linked student account not found. The Student UID may be incorrect. Please contact the administrator.",
        );
        setLoading(false);
        return;
      }

      const linkedStudent = studentSnapshot.docs[0].data();
      setStudentData(linkedStudent);

      // Now fetch attendance and results for the linked student
      await fetchStudentPerformance(linkedStudent);

      // Fetch feedback for the student
      await fetchStudentFeedback(linkedStudent);
    } catch (err) {
      console.error("Error fetching linked student data:", err);
      setError("Failed to fetch student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback for the linked student
  const fetchStudentFeedback = async (student) => {
    try {
      setFeedbackLoading(true);
      // Query by customUid if available, otherwise by name/class/batch
      let feedbackQuery;
      if (student?.customUid) {
        feedbackQuery = query(
          collection(db, "studentFeedbacks"),
          where("studentCustomUid", "==", student.customUid)
        );
      } else if (student?.name && student?.class && student?.batch) {
        feedbackQuery = query(
          collection(db, "studentFeedbacks"),
          where("studentName", "==", student.name),
          where("studentClass", "==", student.class),
          where("studentBatch", "==", student.batch)
        );
      } else {
        setStudentFeedback([]);
        return;
      }

      const feedbackSnapshot = await getDocs(feedbackQuery);
      const feedbackData = feedbackSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setStudentFeedback(feedbackData);
    } catch (err) {
      console.error("Error fetching student feedback:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const fetchStudentPerformance = async (student) => {
    try {
      // Fetch attendance records
      if (student?.name && student?.class && student?.batch) {
        // Get all attendance records
        const attendanceRef = collection(db, "attendance");
        const allAttendanceQuery = query(
          attendanceRef,
          where("studentName", "==", student.name),
          where("class", "==", student.class),
          where("batch", "==", student.batch),
        );
        const allAttendanceSnapshot = await getDocs(allAttendanceQuery);
        const totalDays = allAttendanceSnapshot.docs.length;
        setTotalAttendanceDays(totalDays);

        // Get present days
        const presentAttendanceQuery = query(
          attendanceRef,
          where("studentName", "==", student.name),
          where("class", "==", student.class),
          where("batch", "==", student.batch),
          where("status", "==", "present"),
        );
        const presentAttendanceSnapshot = await getDocs(presentAttendanceQuery);
        const presentDays = presentAttendanceSnapshot.docs.length;
        setAttendanceCount(presentDays);

        // Fetch results
        const resultsRef = collection(db, "results");
        const resultsQuery = query(
          resultsRef,
          where("studentName", "==", student.name),
          where("class", "==", student.class),
          where("batch", "==", student.batch),
        );
        const resultsSnapshot = await getDocs(resultsQuery);

        // Calculate average percentage and subject-wise data
        if (resultsSnapshot.docs.length > 0) {
          const results = resultsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              subject: data.subject,
              percentage: (data.marks / data.maxMarks) * 100,
              marks: data.marks,
              maxMarks: data.maxMarks,
              examDate: data.examDate,
              examType: data.examType,
            };
          });

          // Calculate overall average
          const avgPercentage =
            results.reduce((a, b) => a + b.percentage, 0) / results.length;
          setResultPercentage(Math.round(avgPercentage));

          // Group by subject and calculate detailed metrics
          const subjectMap = {};
          const detailedSubjectMap = {};

          results.forEach((result) => {
            const { subject, percentage, examDate } = result;

            if (!subjectMap[subject]) {
              subjectMap[subject] = { total: 0, count: 0 };
              detailedSubjectMap[subject] = [];
            }
            subjectMap[subject].total += percentage;
            subjectMap[subject].count += 1;
            detailedSubjectMap[subject].push(result);
          });

          // Create bar chart data
          const subjectData = Object.entries(subjectMap).map(
            ([subject, data]) => ({
              subject: getShortSubjectName(subject),
              percentage: Math.round(data.total / data.count),
            }),
          );
          setSubjectWiseResults(subjectData);

          // Create detailed subject progression data
          const progressionData = Object.entries(detailedSubjectMap).map(
            ([subject, tests]) => {
              // Sort tests by date
              const sortedTests = tests.sort(
                (a, b) => new Date(a.examDate) - new Date(b.examDate),
              );

              const percentages = sortedTests.map((t) => t.percentage);
              const avgPercentage =
                percentages.reduce((a, b) => a + b, 0) / percentages.length;
              const minPercentage = Math.min(...percentages);
              const maxPercentage = Math.max(...percentages);

              // Calculate trend (first vs last test)
              let trend = 0;
              if (sortedTests.length > 1) {
                const firstTest = sortedTests[0].percentage;
                const lastTest = sortedTests[sortedTests.length - 1].percentage;
                trend = ((lastTest - firstTest) / firstTest) * 100;
              }

              // Create timeline data for line chart
              const timelineData = sortedTests.map((test) => ({
                date: new Date(test.examDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                percentage: Math.round(test.percentage),
              }));

              return {
                subject,
                testCount: sortedTests.length,
                average: Math.round(avgPercentage),
                trend: Math.round(trend),
                min: Math.round(minPercentage),
                max: Math.round(maxPercentage),
                timeline: timelineData,
              };
            },
          );

          setSubjectProgression(progressionData);
        } else {
          setResultPercentage(0);
          setSubjectWiseResults([]);
          setSubjectProgression([]);
        }
      }
    } catch (err) {
      console.error("Error fetching student performance:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Parent Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {userData?.name || user?.email}
                </p>
                {studentData && (
                  <p className="mt-2 text-sm text-indigo-600">
                    Viewing data for:{" "}
                    <span className="font-semibold">{studentData.name}</span>
                    {studentData.class && ` | ${studentData.class}`}
                    {studentData.batch && ` | ${studentData.batch}`}
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Loading student data...</p>
              </div>
            )}

            {/* Dashboard Content - Only show if student is linked */}
            {!loading && !error && studentData && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                  {/* Attendance Card */}
                  <Link
                    to="/attendance"
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="shrink-0 bg-indigo-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {studentData.name}'s Attendance
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              <span>{attendanceCount} Days Present</span>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View details →
                      </span>
                    </div>
                  </Link>

                  {/* Results Card */}
                  <Link
                    to="/results"
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="shrink-0 bg-green-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {studentData.name}'s Results
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              <span>{resultPercentage}% Average</span>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <span className="text-sm font-medium text-green-600 hover:text-green-500">
                        View details →
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Charts Section */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                  {/* Attendance Pie Chart */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <svg
                        className="h-6 w-6 text-indigo-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        />
                      </svg>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Attendance Overview
                      </h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Present", value: attendanceCount },
                            {
                              name: "Absent",
                              value: totalAttendanceDays - attendanceCount,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center text-sm text-gray-600">
                      Total Days: {totalAttendanceDays} | Present:{" "}
                      {attendanceCount} | Absent:{" "}
                      {totalAttendanceDays - attendanceCount}
                    </div>
                  </div>

                  {/* Subject-wise Performance Bar Chart */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <svg
                        className="h-6 w-6 text-green-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Subject-wise Performance
                      </h2>
                    </div>
                    {subjectWiseResults.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectWiseResults}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" interval={0} />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="percentage"
                            fill="#27a2f1"
                            name="Percentage"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        No results data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject Progression Section */}
                {subjectProgression.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <svg
                        className="h-6 w-6 text-indigo-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Subject Progression
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {subjectProgression.map((subjectData) => (
                        <div
                          key={subjectData.subject}
                          className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          {/* Subject Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {subjectData.subject}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {subjectData.testCount}{" "}
                                {subjectData.testCount === 1 ? "test" : "tests"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Avg:</p>
                              <p className="text-xl font-bold text-gray-900">
                                {subjectData.average}%
                              </p>
                              {subjectData.testCount > 1 && (
                                <p
                                  className={`text-sm font-medium flex items-center justify-end ${
                                    subjectData.trend >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {subjectData.trend >= 0 ? "↑" : "↓"}{" "}
                                  {Math.abs(subjectData.trend)}%
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Line Chart */}
                          <div className="mb-4">
                            <ResponsiveContainer width="100%" height={150}>
                              <LineChart data={subjectData.timeline}>
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  interval={0}
                                />
                                <YAxis
                                  domain={[0, 100]}
                                  tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Line
                                  type="monotone"
                                  dataKey="percentage"
                                  stroke="#6366f1"
                                  strokeWidth={2}
                                  dot={{ fill: "#6366f1", r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Child Feedback Section */}
                <div className="mt-8 bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-teal-600 mr-2"
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
                      <h2 className="text-lg font-semibold text-gray-900">
                        Teacher Feedback
                      </h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Feedback and comments from teachers about{" "}
                      {studentData?.name || "your child"}
                    </p>
                  </div>

                  <div className="p-4">
                    {feedbackLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading feedback...
                      </div>
                    ) : studentFeedback.length === 0 ? (
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
                        <p className="mt-2">No feedback available yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {studentFeedback.map((feedback) => (
                          <div
                            key={feedback.id}
                            className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-teal-600 font-semibold text-sm">
                                    {feedback.teacherName
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase() || "T"}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {feedback.teacherName || "Teacher"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {feedback.createdAt
                                      ? new Date(
                                          feedback.createdAt
                                        ).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "Unknown date"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {feedback.feedback}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ParentDashboard;
