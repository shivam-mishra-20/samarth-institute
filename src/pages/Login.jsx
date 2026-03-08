import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES, ROLE_NAMES, ROLE_ROUTES } from "../constants/roles";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || USER_ROLES.STUDENT;

  const [email, setEmail] = useState("");
  const [studentUid, setStudentUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isParentLogin = roleParam === USER_ROLES.PARENT;

  const { login, user, userRole, passwordResetRequired } = useAuth();
  const navigate = useNavigate();

  // Debug: Log Firebase project being used
  useEffect(() => {
    console.log(
      "🔥 Firebase Project ID:",
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
    );
    console.log("🔥 Auth Domain:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  }, []);

  useEffect(() => {
    // Redirect if already logged in
    if (user && userRole) {
      if (passwordResetRequired) {
        navigate("/change-password", { replace: true });
      } else {
        navigate(ROLE_ROUTES[userRole], { replace: true });
      }
    }
  }, [user, userRole, passwordResetRequired, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // For parent login, verify Student UID before authentication
      if (isParentLogin) {
        if (!studentUid.trim()) {
          throw new Error("Please enter the Student UID.");
        }

        // Check if parent exists with this email and verify studentUid
        const usersRef = collection(db, "users");
        const parentQuery = query(
          usersRef,
          where("email", "==", email.trim().toLowerCase()),
          where("role", "==", USER_ROLES.PARENT),
        );
        const parentSnapshot = await getDocs(parentQuery);

        if (parentSnapshot.empty) {
          throw new Error(
            "No parent account found with this email. Please contact the administrator.",
          );
        }

        const parentData = parentSnapshot.docs[0].data();

        // Verify the Student UID matches
        if (parentData.studentUid !== studentUid.toUpperCase().trim()) {
          throw new Error(
            "The Student UID does not match this parent account. Please check and try again.",
          );
        }
      }

      await login(email, password, roleParam);
      // Check will happen in useEffect after login updates state
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {ROLE_NAMES[roleParam]} Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isParentLogin ? "" : "rounded-t-md"} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isParentLogin ? "rounded-t-md" : ""}`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {isParentLogin && (
                <div>
                  <label htmlFor="student-uid" className="sr-only">
                    Student UID
                  </label>
                  <input
                    id="student-uid"
                    name="studentUid"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Student UID (e.g., STU001)"
                    value={studentUid}
                    onChange={(e) =>
                      setStudentUid(e.target.value.toUpperCase())
                    }
                  />
                </div>
              )}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            {!isParentLogin && (
              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to={`/signup?role=${roleParam}`}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </Link>
              </div>
            )}

            {isParentLogin && (
              <div className="text-center text-sm text-gray-600">
                <p>
                  Enter your email, your child's Student UID, and password
                  provided by the administrator.
                </p>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
