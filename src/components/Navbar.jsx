import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiPhone,
} from "react-icons/fi";
import { Dropdown, notification as antNotification } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useFCMToken } from "../hooks/useFCMToken";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const location = useLocation();
  const { user, isStudent, isTeacher, logout } = useAuth();

  // Global FCM registration + foreground notification toast for all authenticated users
  const { foregroundNotification, clearForegroundNotification, permission, requestPermissionAndGetToken } = useFCMToken();

  // Show Ant Design notification toast when a foreground FCM message arrives
  useEffect(() => {
    if (!foregroundNotification) return;
    antNotification.open({
      message: foregroundNotification.title,
      description: foregroundNotification.body,
      icon: <BellOutlined style={{ color: "#4F46E5" }} />,
      duration: 6,
      placement: "topRight",
      onClose: clearForegroundNotification,
    });
  }, [foregroundNotification]); // eslint-disable-line react-hooks/exhaustive-deps

  // Silently request permission for logged-in users who haven't been asked yet
  useEffect(() => {
    if (user && permission === "default") {
      // Delay slightly to avoid jarring the user on first page load
      const t = setTimeout(() => requestPermissionAndGetToken(), 3000);
      return () => clearTimeout(t);
    }
  }, [user, permission]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle window resize to close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setOpenMobileSubmenu(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // About dropdown items
  const aboutItems = [
    {
      key: "about-institute",
      label: (
        <Link
          to="/about?section=institute"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          About Samarth Institute
        </Link>
      ),
    },
    {
      key: "director-message",
      label: (
        <Link
          to="/about?section=director"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Director Message
        </Link>
      ),
    },
    {
      key: "faculty",
      label: (
        <Link
          to="/about?section=faculty"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Faculty And Experts
        </Link>
      ),
    },
    {
      key: "infrastructure",
      label: (
        <Link
          to="/about?section=infrastructure"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Infrastructure
        </Link>
      ),
    },
    {
      key: "programme",
      label: (
        <Link
          to="/about?section=programme"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Samarth Programme
        </Link>
      ),
    },
  ];

  // Academic dropdown mega menu
  const academicItems = [
    {
      key: "academic-mega",
      label: (
        <div className="grid grid-cols-5 gap-6 p-4 min-w-200">
          {/* PRE FOUNDATION COURSE */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              PRE FOUNDATION
            </h3>
            <div className="space-y-1">
              <Link
                to="/academic/pre-foundation/class-6"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Class 6
              </Link>
              <Link
                to="/academic/pre-foundation/class-7"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Class 7
              </Link>
              <Link
                to="/academic/pre-foundation/class-8"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Class 8
              </Link>
            </div>
          </div>

          {/* FOUNDATION COURSE */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              FOUNDATION
            </h3>
            <div className="space-y-1">
              <Link
                to="/academic/foundation/class-9"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Class 9
              </Link>
              <Link
                to="/academic/foundation/class-10"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Class 10
              </Link>
            </div>
          </div>

          {/* BOARDS */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              BOARDS
            </h3>
            <div className="space-y-1">
              <Link
                to="/academic"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Class 11
              </Link>
              <Link
                to="/academic"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Class 12
              </Link>
            </div>
          </div>

          {/* COMPETITIVE EXAMS */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              COMPETITIVE EXAMS
            </h3>
            <div className="space-y-1">
              <Link
                to="/academic/after-boards/eklavy-neet"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Eklavy - Re Neet
              </Link>
              <Link
                to="/academic/after-boards/arjuna-jee"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Arjuna - Re JEE
              </Link>
            </div>
          </div>

          {/* INTEGRATED COURSES */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              INTEGRATED
            </h3>
            <div className="space-y-1">
              <Link
                to="/academic/integrated/ntse-olympiad"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md leading-tight"
              >
                NTSE/OLYMPIAD
                <br />
                <span className="text-xs text-gray-500">(Class 6-10)</span>
              </Link>
              <Link
                to="/academic/integrated/iit-nit"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md leading-tight"
              >
                Target IIT/NIT
                <br />
                <span className="text-xs text-gray-500">(Class 11-12)</span>
              </Link>
              <Link
                to="/academic/integrated/neet"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md leading-tight"
              >
                Target NEET
                <br />
                <span className="text-xs text-gray-500">(Class 11-12)</span>
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Student Corner dropdown - custom mega menu
  const studentCornerItems = [
    {
      key: "student-corner-mega",
      label: (
        <div className="grid grid-cols-2 gap-8 p-4 min-w-100">
          {/* STUDENT Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              ACHIEVEMENTS
            </h3>
            <div className="space-y-1">
              <Link
                to="/results-showcase"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Results Showcase
              </Link>
            </div>
          </div>

          {/* GET ADMISSION Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              GET ADMISSION
            </h3>
            <div className="space-y-1">
              <Link
                to="/students-corner?tab=apply-online"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Apply Online
              </Link>
            </div>
          </div>

          {/* DOWNLOAD Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              DOWNLOAD
            </h3>
            <div className="space-y-1">
              <Link
                to="/students-corner?tab=brochure"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Institute Brochure
              </Link>
              <Link
                to="/students-corner?tab=exam-papers"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Exam Papers
              </Link>
              <Link
                to="/students-corner?tab=news-circulars"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                News & Circulars
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Login dropdown items
  const loginItems = [
    {
      key: "student",
      label: (
        <Link
          to="/login?role=student"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Student Login
        </Link>
      ),
    },
    {
      key: "parent",
      label: (
        <Link
          to="/login?role=parent"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Parent Login
        </Link>
      ),
    },
    {
      key: "teacher",
      label: (
        <Link
          to="/login?role=teacher"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Teacher Login
        </Link>
      ),
    },
    {
      key: "admin",
      label: (
        <Link
          to="/login?role=admin"
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Admin Login
        </Link>
      ),
    },
  ];

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "About",
      path: "/about",
      hasDropdown: true,
      items: aboutItems,
    },
    {
      name: "Academic",
      path: "/academic",
      hasDropdown: true,
      items: academicItems,
    },
    { name: "Blog", path: "/blog" },
    {
      name: "Student's Corner",
      path: "/students-corner",
      hasDropdown: true,
      items: studentCornerItems,
    },
    { name: "Events", path: "/gallery" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const toggleMobileSubmenu = (name) => {
    setOpenMobileSubmenu(openMobileSubmenu === name ? null : name);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-gray-100"
          : "bg-white py-3 md:py-4 border-b border-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center relative">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Logo
                className="h-10 md:h-12 w-auto"
                textClassName="text-xl md:text-2xl font-black"
              />
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex space-x-2 items-center justify-center flex-1 mx-8">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <Dropdown
                  key={link.name}
                  menu={{ items: link.items }}
                  placement="bottom"
                  classNames={{ root: "navbar-dropdown" }}
                  trigger={["hover"]}
                >
                  <span
                    className={`relative px-2 py-2 font-medium transition-all duration-300 group inline-flex items-center gap-1 hover:scale-105 cursor-pointer whitespace-nowrap ${
                      isActive(link.path)
                        ? "text-samarth-blue-700"
                        : "text-samarth-gray-600 hover:text-samarth-blue-700"
                    }`}
                  >
                    {link.name}
                    <FiChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-samarth-blue-700 transform origin-center transition-transform duration-500 ease-out ${
                        isActive(link.path)
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </span>
                </Dropdown>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-2 py-2 font-medium transition-all duration-300 group hover:scale-105 whitespace-nowrap ${
                    isActive(link.path)
                      ? "text-samarth-blue-700"
                      : "text-samarth-gray-600 hover:text-samarth-blue-700"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-samarth-blue-700 transform origin-center transition-transform duration-500 ease-out ${
                      isActive(link.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ),
            )}
          </div>

          {/* Enquiry and Login Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Enquiry Button */}
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 border-2 border-red-700"
            >
              <FiPhone className="w-4 h-4" />
              Enquiry
            </Link>

            {/* Login Dropdown or Dashboard Link */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={
                    isStudent
                      ? "/student/dashboard"
                      : isTeacher
                        ? "/teacher/dashboard"
                        : "/admin/dashboard"
                  }
                  className="px-5 py-2.5 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 border-2 border-blue-800"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-5 py-2.5 rounded-full bg-gray-600 text-white font-bold hover:bg-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 border-2 border-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Dropdown
                menu={{ items: loginItems }}
                placement="bottomRight"
                classNames={{ root: "navbar-dropdown" }}
                trigger={["hover"]}
              >
                <button className="px-6 py-2.5 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 border-2 border-blue-800">
                  Login
                  <FiChevronDown className="w-4 h-4" />
                </button>
              </Dropdown>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-samarth-gray-600 hover:text-samarth-blue-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute mt-3 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "max-h-[calc(100vh-60px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.hasDropdown ? (
                <>
                  <button
                    onClick={() => toggleMobileSubmenu(link.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-samarth-blue-50 text-samarth-blue-700"
                        : "text-samarth-gray-600 hover:text-samarth-blue-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                    <FiChevronRight
                      className={`w-4 h-4 transition-transform ${openMobileSubmenu === link.name ? "rotate-90" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openMobileSubmenu === link.name ? "max-h-96" : "max-h-0"}`}
                  >
                    <div className="pl-6 py-2 space-y-1">
                      {link.name === "About" && (
                        <>
                          <Link
                            to="/about?section=institute"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            About Samarth Institute
                          </Link>
                          <Link
                            to="/about?section=director"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Director Message
                          </Link>
                          <Link
                            to="/about?section=faculty"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Faculty And Experts
                          </Link>
                          <Link
                            to="/about?section=infrastructure"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Infrastructure
                          </Link>
                          <Link
                            to="/about?section=programme"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Samarth Programme
                          </Link>
                        </>
                      )}
                      {link.name === "Academic" && (
                        <>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Pre Foundation
                            </p>
                            <Link
                              to="/academic/pre-foundation/class-6"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Class 6
                            </Link>
                            <Link
                              to="/academic/pre-foundation/class-7"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Class 7
                            </Link>
                            <Link
                              to="/academic/pre-foundation/class-8"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Class 8
                            </Link>
                          </div>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Foundation
                            </p>
                            <Link
                              to="/academic/foundation/class-9"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Class 9
                            </Link>
                            <Link
                              to="/academic/foundation/class-10"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Class 10
                            </Link>
                          </div>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Boards
                            </p>
                            <Link
                              to="/academic"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Class 11
                            </Link>
                            <Link
                              to="/academic"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Class 12
                            </Link>
                          </div>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Competitive Exams
                            </p>
                            <Link
                              to="/academic/after-boards/eklavy-neet"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Eklavy - Re Neet
                            </Link>
                            <Link
                              to="/academic/after-boards/arjuna-jee"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Arjuna - Re JEE
                            </Link>
                          </div>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Integrated
                            </p>
                            <Link
                              to="/academic/integrated/ntse-olympiad"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              NTSE/Olympiad (Class 6-10)
                            </Link>
                            <Link
                              to="/academic/integrated/iit-nit"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Target IIT/NIT (Class 11-12)
                            </Link>
                            <Link
                              to="/academic/integrated/neet"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Target NEET (Class 11-12)
                            </Link>
                          </div>
                        </>
                      )}
                      {link.name === "Student's Corner" && (
                        <>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Achievements
                            </p>
                            <Link
                              to="/results-showcase"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Results Showcase
                            </Link>
                          </div>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Get Admission
                            </p>
                            <Link
                              to="/students-corner?tab=apply-online"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Apply Online
                            </Link>
                          </div>
                          <div>
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Download
                            </p>
                            <Link
                              to="/students-corner?tab=brochure"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Institute Brochure
                            </Link>
                            <Link
                              to="/students-corner?tab=exam-papers"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Exam Papers
                            </Link>
                            <Link
                              to="/students-corner?tab=news-circulars"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              News & Circulars
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-samarth-blue-50 text-samarth-blue-700"
                      : "text-samarth-gray-600 hover:text-samarth-blue-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile Enquiry and Login Options */}
          <div className="pt-2 border-t border-gray-100">
            {/* Enquiry Button */}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full mb-2 px-4 py-3 rounded-lg text-base font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              <FiPhone className="w-4 h-4" />
              Enquiry
            </Link>

            {/* Login Options or Dashboard */}
            {user ? (
              <div className="space-y-2">
                <Link
                  to={
                    isStudent
                      ? "/student/dashboard"
                      : isTeacher
                        ? "/teacher/dashboard"
                        : "/admin/dashboard"
                  }
                  className="block px-4 py-3 rounded-lg text-base font-bold bg-blue-700 text-white hover:bg-blue-800 transition-all shadow-md hover:shadow-lg text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg text-base font-bold bg-gray-600 text-white hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Login Options
                </p>
                <Link
                  to="/login?role=student"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-samarth-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  to="/login?role=parent"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-samarth-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Parent Login
                </Link>
                <Link
                  to="/login?role=teacher"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-samarth-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Teacher Login
                </Link>
                <Link
                  to="/login?role=admin"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-samarth-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
