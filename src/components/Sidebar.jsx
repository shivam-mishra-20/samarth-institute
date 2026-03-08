import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../constants/roles";

const Sidebar = () => {
  const { user, userData, userRole, isTeacher, isStudent, isParent, logout } =
    useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  // Mobile: drawer open/closed
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: isStudent
        ? "/student/dashboard"
        : isParent
          ? "/parent/dashboard"
          : isTeacher
            ? "/teacher/dashboard"
            : "/admin/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      roles: [
        USER_ROLES.STUDENT,
        USER_ROLES.TEACHER,
        USER_ROLES.ADMIN,
        USER_ROLES.PARENT,
      ],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      roles: [
        USER_ROLES.STUDENT,
        USER_ROLES.TEACHER,
        USER_ROLES.ADMIN,
        USER_ROLES.PARENT,
      ],
    },
    {
      name: "Results",
      path: "/results",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      roles: [
        USER_ROLES.STUDENT,
        USER_ROLES.TEACHER,
        USER_ROLES.ADMIN,
        USER_ROLES.PARENT,
      ],
    },
    {
      name: "Video Lectures",
      path: "/recorded-lectures",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      roles: [
        USER_ROLES.STUDENT,
        USER_ROLES.TEACHER,
        USER_ROLES.ADMIN,
        USER_ROLES.PARENT,
      ],
    },
    {
      name: "Announcements",
      path: "/announcements",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      roles: [
        USER_ROLES.STUDENT,
        USER_ROLES.TEACHER,
        USER_ROLES.ADMIN,
        USER_ROLES.PARENT,
      ],
    },
    {
      name: "Manage Announcements",
      path: "/manage-announcements",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
      roles: [USER_ROLES.ADMIN],
    },
    {
      name: "Manage Users",
      path: "/manage-users",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      roles: [USER_ROLES.ADMIN, USER_ROLES.TEACHER],
    },
    {
      name: "Fee Management",
      path: "/fee-management",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      roles: [USER_ROLES.ADMIN],
    },
    {
      name: "My Child's Fees",
      path: "/student-fees",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      roles: [USER_ROLES.PARENT],
    },
    {
      name: "Teacher Applications",
      path: "/teacher-applications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      roles: [USER_ROLES.ADMIN],
    },
    {
      name: "Scholarship Applications",
      path: "/scholarship-applications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      roles: [USER_ROLES.ADMIN, USER_ROLES.TEACHER],
    },
    {
      name: "Contact Enquiries",
      path: "/contact-enquiries",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      roles: [USER_ROLES.ADMIN],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* ── Mobile hamburger button (fixed, always visible on small screens) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-18 left-4 z-40 w-10 h-10 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ── Mobile backdrop overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/40 z-40"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="md:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <span className="font-bold text-indigo-700 text-base">Navigation</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {visibleMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                      isActivePath(item.path)
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* User section */}
            <div className="border-t border-gray-200 p-3">
              <div className="px-3 mb-3">
                <p className="text-xs text-gray-500 mb-0.5">Logged in as:</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{userData?.name || user?.email}</p>
                {userData?.class && (
                  <p className="text-xs text-gray-400">
                    Class: {userData.class}{userData.batch ? ` - ${userData.batch}` : ""}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block self-stretch bg-white shadow-lg overflow-hidden shrink-0"
      >
        <div className="sticky top-28 h-[calc(100vh-7rem)] flex flex-col">
          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-4 z-10 w-6 h-6 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
          </motion.button>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-3 py-6">
            <div className="space-y-1">
              {visibleMenuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                  onHoverStart={() => setHoveredItem(item.path)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActivePath(item.path) ? "text-white" : "text-gray-700"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    {/* Background Animation */}
                    {isActivePath(item.path) && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-indigo-600 rounded-lg shadow-md"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Hover Background */}
                    {hoveredItem === item.path && !isActivePath(item.path) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 bg-gray-100 rounded-lg"
                      />
                    )}

                    {/* Icon */}
                    <motion.span
                      className="shrink-0 relative z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.icon}
                    </motion.span>

                    {/* Text */}
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium text-sm relative z-10 whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <motion.div
            className="border-t border-gray-200 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 mb-3 overflow-hidden"
                >
                  <p className="text-xs text-gray-500 mb-1">Logged in as:</p>
                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    title={userData?.name || user?.email}
                  >
                    {userData?.name || user?.email}
                  </p>
                  {userData?.class && (
                    <p className="text-xs text-gray-500 mt-1">
                      Class: {userData.class}
                      {userData.batch ? ` - ${userData.batch}` : ""}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
                isCollapsed ? "justify-center" : ""
              }`}
              title="Logout"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(254, 226, 226, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </motion.svg>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-sm"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
