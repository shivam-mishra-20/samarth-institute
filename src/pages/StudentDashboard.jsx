import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
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

const StudentDashboard = () => {
  const { user, userData } = useAuth();
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [resultPercentage, setResultPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalAttendanceDays, setTotalAttendanceDays] = useState(0);
  const [subjectWiseResults, setSubjectWiseResults] = useState([]);
  const [subjectProgression, setSubjectProgression] = useState([]);
  const [recentLectures, setRecentLectures] = useState([]);

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
      fetchStudentData();
    }
    fetchRecentLectures();
  }, [userData]);

  const fetchRecentLectures = async () => {
    try {
      const lecturesQuery = query(
        collection(db, "recordedLectures"),
        where("isPublic", "==", true),
        orderBy("createdAt", "desc"),
        limit(4),
      );
      const snapshot = await getDocs(lecturesQuery);
      const lecturesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentLectures(lecturesData);
    } catch (error) {
      console.error("Error fetching recent lectures:", error);
    }
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return "";
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return videoId
      ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
      : "";
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch attendance records
      if (userData?.name && userData?.class && userData?.batch) {
        // Get all attendance records
        const attendanceRef = collection(db, "attendance");
        const allAttendanceQuery = query(
          attendanceRef,
          where("studentName", "==", userData.name),
          where("class", "==", userData.class),
          where("batch", "==", userData.batch),
        );
        const allAttendanceSnapshot = await getDocs(allAttendanceQuery);
        const totalDays = allAttendanceSnapshot.docs.length;
        setTotalAttendanceDays(totalDays);

        // Get present days
        const presentAttendanceQuery = query(
          attendanceRef,
          where("studentName", "==", userData.name),
          where("class", "==", userData.class),
          where("batch", "==", userData.batch),
          where("status", "==", "present"),
        );
        const presentAttendanceSnapshot = await getDocs(presentAttendanceQuery);
        const presentDays = presentAttendanceSnapshot.docs.length;
        setAttendanceCount(presentDays);

        // Fetch results
        const resultsRef = collection(db, "results");
        const resultsQuery = query(
          resultsRef,
          where("studentName", "==", userData.name),
          where("class", "==", userData.class),
          where("batch", "==", userData.batch),
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
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
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
                  Student Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {userData?.name || user?.email}
                </p>
              </div>
            </div>

            {/* Dashboard Content */}
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
                          Attendance
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <span className="text-sm">Loading...</span>
                          ) : (
                            <span>{attendanceCount} Days Present</span>
                          )}
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
                          Results
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? (
                            <span className="text-sm">Loading...</span>
                          ) : (
                            <span>{resultPercentage}% Average</span>
                          )}
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
            {!loading && (
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
                          fill="#27a2f1 "
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
            )}

            {/* Subject Progression Section */}
            {!loading && subjectProgression.length > 0 && (
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
                    📊 Subject Progression
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
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
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

            {/* Recent Lectures Section */}
            {recentLectures.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900">
                      📺 Recent Video Lectures
                    </h2>
                  </div>
                  <Link
                    to="/recorded-lectures"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentLectures.map((lecture) => (
                    <a
                      key={lecture.id}
                      href={lecture.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="relative aspect-video bg-gray-100">
                        <img
                          src={
                            lecture.thumbnailUrl ||
                            getYouTubeThumbnail(lecture.videoUrl) ||
                            "/Images/default-video-thumbnail.jpg"
                          }
                          alt={lecture.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              "/Images/default-video-thumbnail.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-indigo-600 ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        {lecture.duration && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                            {lecture.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                            {lecture.subject}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {lecture.title}
                        </h3>
                        {lecture.instructor && (
                          <p className="text-xs text-gray-500 mt-1">
                            {lecture.instructor}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentDashboard;
