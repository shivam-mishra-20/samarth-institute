import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES, ROLE_NAMES, ROLE_ROUTES } from "../constants/roles";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Bell, Video } from "lucide-react";

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

  const [showPassword, setShowPassword] = useState(false);

  const roleTabs = [
    { role: USER_ROLES.STUDENT, label: "Student",  d: "M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM12 11a4 4 0 110-8 4 4 0 010 8z" },
    { role: USER_ROLES.TEACHER, label: "Teacher",  d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { role: USER_ROLES.PARENT,  label: "Parent",   d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { role: USER_ROLES.ADMIN,   label: "Admin",    d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];

  // per-role accent colours used in the mobile hero strip
  const roleAccent = {
    [USER_ROLES.STUDENT]: { from: "from-indigo-600", via: "via-indigo-500",  to: "to-blue-500"   },
    [USER_ROLES.TEACHER]: { from: "from-emerald-600", via: "via-teal-500",   to: "to-cyan-500"   },
    [USER_ROLES.PARENT]:  { from: "from-violet-600",  via: "via-purple-500", to: "to-fuchsia-500"},
    [USER_ROLES.ADMIN]:   { from: "from-rose-600",    via: "via-red-500",    to: "to-orange-500" },
  };
  const ac = roleAccent[roleParam] || roleAccent[USER_ROLES.STUDENT];

  // stagger children for the form card
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Branding Panel (desktop only) ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-indigo-900 via-indigo-700 to-blue-500 flex-col justify-between p-12 overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-16 w-md h-112 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-128 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-white/25 transition-colors">
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">Samarth</p>
              <p className="text-indigo-300 text-xs mt-0.5">Institute</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Welcome back to<br />
              <span className="text-blue-200">Samarth Institute</span>
            </h1>
            <p className="mt-3 text-indigo-200 text-lg leading-relaxed">
              Your complete learning management platform for academic excellence.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              { Icon: GraduationCap, text: "Track attendance & academic progress" },
              { Icon: Bell,          text: "Real-time announcements & notifications" },
              { Icon: Video,         text: "Access recorded lectures & study material" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-indigo-100">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-200" strokeWidth={1.5} />
                </div>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-indigo-300 text-sm">
            &copy; {new Date().getFullYear()} Samarth Institute. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* ── Right / Full-width Form Panel ───────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 min-h-screen">

        {/* ── Mobile Hero Strip (hidden on desktop) ── */}
        <motion.div
          key={roleParam}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`lg:hidden relative overflow-hidden bg-linear-to-br ${ac.from} ${ac.via} ${ac.to} px-4 pt-4 pb-4`}
        >
          {/* Animated blobs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/20 rounded-full blur-2xl"
          />

          {/* Back-to-home link */}
          <Link to="/" className="relative z-10 inline-flex items-center gap-1.5 text-white/80 text-xs font-medium mb-6">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          {/* Logo + copy */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Samarth Institute</p>
              <h1 className="text-white text-xl font-bold leading-tight">
                Sign in as<br /><span className="text-white/90">{ROLE_NAMES[roleParam]}</span>
              </h1>
            </div>
          </div>

          
        </motion.div>

        {/* ── Form card (overlaps the hero strip on mobile) ── */}
        <div className="flex-1 px-5 sm:px-8 lg:px-16 mt-6 lg:mt-0 lg:flex lg:items-center lg:justify-center pb-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-md mx-auto bg-white lg:bg-transparent rounded-3xl lg:rounded-none shadow-xl lg:shadow-none p-6 sm:p-8 lg:p-0"
          >

            {/* Desktop-only heading */}
            <motion.div variants={item} className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
              <p className="mt-1 text-gray-500 text-sm">Welcome back! Please enter your credentials.</p>
            </motion.div>

            {/* Mobile heading inside card */}
            <motion.div variants={item} className="lg:hidden mb-5">
              <h2 className="text-xl font-bold text-gray-900">Welcome back 👋</h2>
              <p className="text-gray-500 text-sm mt-0.5">Enter your credentials to continue</p>
            </motion.div>

            {/* ── Role Tab Selector ── */}
            <motion.div variants={item} className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-xl mb-6">
              {roleTabs.map(({ role, label, d }) => (
                <Link
                  key={role}
                  to={`/login?role=${role}`}
                  className={`relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-xs font-semibold transition-all ${
                    roleParam === role
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {roleParam === role && (
                    <motion.span
                      layoutId="role-pill"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                  </svg>
                  <span className="relative z-10">{label}</span>
                </Link>
              ))}
            </motion.div>

            {/* ── Error Banner ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "1.25rem" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm overflow-hidden"
                >
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <motion.div variants={item}>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email-address" name="email" type="email" autoComplete="email" required
                    placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 lg:bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </motion.div>

              {/* Student UID (Parent only) */}
              <AnimatePresence>
                {isParentLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <label htmlFor="student-uid" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Child's Student UID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <input
                        id="student-uid" name="studentUid" type="text" required
                        placeholder="e.g. STU001"
                        value={studentUid} onChange={(e) => setStudentUid(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 lg:bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-mono tracking-wider"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">Provided by the administrator when your child enrolled.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password */}
              <motion.div variants={item}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password" name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password" required
                    placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl bg-gray-50 lg:bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={item}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in as {ROLE_NAMES[roleParam]}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* ── Footer links ── */}
            <motion.div variants={item} className="mt-5 space-y-3">
              
              <p className="text-center lg:hidden">
                <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </p>
              <p className="hidden lg:block text-center">
                <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
