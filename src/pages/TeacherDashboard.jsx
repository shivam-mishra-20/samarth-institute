import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { USER_ROLES } from "../constants/roles";

const TeacherDashboard = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total students
      const studentsQuery = query(
        collection(db, "users"),
        where("role", "==", USER_ROLES.STUDENT),
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      setTotalStudents(studentsSnapshot.size);

      // Fetch recent attendance updates (last 5)
      const attendanceQuery = query(
        collection(db, "attendance"),
        orderBy("markedAt", "desc"),
        limit(5),
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      const attendanceActivities = attendanceSnapshot.docs.map((doc) => ({
        type: "attendance",
        message: `Attendance marked for ${doc.data().studentName} - ${doc.data().status}`,
        timestamp: doc.data().markedAt,
      }));

      // Fetch recent result updates (last 5)
      const resultsQuery = query(
        collection(db, "results"),
        orderBy("createdAt", "desc"),
        limit(5),
      );
      const resultsSnapshot = await getDocs(resultsQuery);
      const resultActivities = resultsSnapshot.docs.map((doc) => {
        const data = doc.data();
        // Handle Firestore Timestamp
        const timestamp = data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt;
        return {
          type: "result",
          message: `Result uploaded for ${data.studentName} - ${data.subject} (${data.examType})`,
          timestamp: timestamp,
        };
      });

      // Combine and sort activities
      const allActivities = [...attendanceActivities, ...resultActivities]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      setRecentActivity(allActivities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  const handleManageUsers = () => {
    navigate("/manage-users");
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
                  Teacher Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {userData?.name || user?.email}
                </p>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* My Classes */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0 bg-blue-500 rounded-md p-3">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          My Classes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">8</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Students */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Students
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {loading ? "..." : totalStudents}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Assignments */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0 bg-yellow-500 rounded-md p-3">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          To Grade
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          23
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Classes */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0 bg-purple-500 rounded-md p-3">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Today's Classes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">4</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <button
                    onClick={handleManageUsers}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => navigate("/attendance")}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Manage Attendance
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    Schedule Class
                  </button>
                  <button
                    onClick={() => navigate("/results")}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Manage Results
                  </button>
                  <button
                    onClick={() => navigate("/scholarship-applications")}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
                  >
                    Scholarship Applications
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Classes */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <div className="border-t border-gray-200">
                {loading ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Loading recent activity...
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No recent activity
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentActivity.map((activity, index) => (
                      <li key={index} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              activity.type === "attendance"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {activity.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTimestamp(activity.timestamp)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TeacherDashboard;
