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
import { Dropdown } from "antd";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const location = useLocation();
  const { user, isStudent, isTeacher } = useAuth();

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
        <div className="grid grid-cols-4 gap-8 p-4 min-w-150">
          {/* PRE FOUNDATION COURSE */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              PRE FOUNDATION COURSE
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
              FOUNDATION COURSE
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

          {/* AFTER BOARD'S */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              AFTER BOARD'S
            </h3>
            <div className="space-y-1">
              <Link
                to="/academic/after-boards/eklavy-neet"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Eklavy - Re Neet Batch
              </Link>
              <Link
                to="/academic/after-boards/arjuna-jee"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Arjuna - Re JEE Batch
              </Link>
            </div>
          </div>

          {/* INTEGRATED CLASSROOM PROGRAM */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              INTEGRATED CLASSROOM PROGRAM
            </h3>
            <div className="space-y-1">
              <Link
                to="/academic/integrated/ntse-olympiad"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md leading-tight"
              >
                Target NTSE/OLYMPIAD/FOUNDATION<br />
                <span className="text-xs text-gray-500">(6 To 10th) - 5 Years</span>
              </Link>
              <Link
                to="/academic/integrated/iit-nit"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md leading-tight"
              >
                Target IIT/NIT<br />
                <span className="text-xs text-gray-500">(11th Maths Group) - 2 Years</span>
              </Link>
              <Link
                to="/academic/integrated/neet"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md leading-tight"
              >
                Target NEET<br />
                <span className="text-xs text-gray-500">(11th Biology Group) - 2 Years</span>
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
        <div className="grid grid-cols-3 gap-8 p-4 min-w-150">
          {/* STUDENT Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              STUDENT
            </h3>
            <div className="space-y-1">
              <Link
                to="/students-corner?tab=time-table"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Time Table
              </Link>
              <Link
                to="/students-corner?tab=student-feedback"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Student Feedback
              </Link>
              <Link
                to="/students-corner?tab=video-feedback"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Student Video Feedback
              </Link>
              <Link
                to="/students-corner?tab=alumni"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-md"
              >
                Alumini Registration
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
          ? "bg-white/95 backdrop-blur-md shadow-md py-6 md:py-2 border-b border-gray-100"
          : "bg-white py-8 md:py-4 border-b border-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-center items-center relative">
          {/* Logo */}
          <div className="shrink-0 flex items-center absolute left-4 md:left-8">
            <Link
              to="/"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Logo className="h-10 w-auto" textClassName="text-2xl" />
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex space-x-6 items-center justify-center">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <Dropdown
                  key={link.name}
                  menu={{ items: link.items }}
                  placement="bottomCenter"
                  overlayClassName="navbar-dropdown"
                  trigger={["hover"]}
                >
                  <Link
                    to={link.path}
                    className={`relative px-4 py-2 font-medium transition-all duration-300 group inline-flex items-center gap-1 hover:scale-105 ${
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
                  </Link>
                </Dropdown>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 group hover:scale-105 ${
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

            {/* Enquiry and Login Buttons */}
            <div className="absolute right-8 md:right-16 flex items-center gap-3">
              {/* Enquiry Button */}
              <Link
                to="/contact"
                className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ring-4 ring-transparent hover:ring-orange-100 inline-flex items-center gap-2"
              >
                <FiPhone className="w-4 h-4" />
                Enquiry
              </Link>

              {/* Login Dropdown or Dashboard Link */}
              {user ? (
                <Link
                  to={
                    isStudent
                      ? "/student/dashboard"
                      : isTeacher
                        ? "/teacher/dashboard"
                        : "/admin/dashboard"
                  }
                  className="btn-sweep px-6 py-2.5 rounded-full bg-samarth-blue-700 text-white font-medium hover:bg-samarth-blue-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ring-4 ring-transparent hover:ring-samarth-blue-100"
                >
                  Dashboard
                </Link>
              ) : (
                <Dropdown
                  menu={{ items: loginItems }}
                  placement="bottomRight"
                  overlayClassName="navbar-dropdown"
                  trigger={["hover"]}
                >
                  <button className="btn-sweep px-6 py-2.5 rounded-full bg-samarth-blue-700 text-white font-medium hover:bg-samarth-blue-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ring-4 ring-transparent hover:ring-samarth-blue-100 inline-flex items-center gap-2">
                    Login
                    <FiChevronDown className="w-4 h-4" />
                  </button>
                </Dropdown>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden absolute right-4 flex items-center">
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
        className={`md:hidden absolute mt-6 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-150 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
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
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Pre Foundation Course</p>
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
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Foundation Course</p>
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
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">After Board's</p>
                            <Link
                              to="/academic/after-boards/eklavy-neet"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Eklavy - Re Neet Batch
                            </Link>
                            <Link
                              to="/academic/after-boards/arjuna-jee"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Arjuna - Re JEE Batch
                            </Link>
                          </div>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Integrated Program</p>
                            <Link
                              to="/academic/integrated/ntse-olympiad"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Target NTSE/Olympiad (6-10th)
                            </Link>
                            <Link
                              to="/academic/integrated/iit-nit"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Target IIT/NIT (11th Maths)
                            </Link>
                            <Link
                              to="/academic/integrated/neet"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Target NEET (11th Biology)
                            </Link>
                          </div>
                        </>
                      )}
                      {link.name === "Student's Corner" && (
                        <>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</p>
                            <Link
                              to="/students-corner?tab=time-table"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Time Table
                            </Link>
                            <Link
                              to="/students-corner?tab=student-feedback"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Student Feedback
                            </Link>
                            <Link
                              to="/students-corner?tab=video-feedback"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Student Video Feedback
                            </Link>
                            <Link
                              to="/students-corner?tab=alumni"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Alumini Registration
                            </Link>
                          </div>
                          <div className="mb-2">
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Get Admission</p>
                            <Link
                              to="/students-corner?tab=apply-online"
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Apply Online
                            </Link>
                          </div>
                          <div>
                            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Download</p>
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
              className="w-full mb-2 px-4 py-3 rounded-lg text-base font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              <FiPhone className="w-4 h-4" />
              Enquiry
            </Link>

            {/* Login Options or Dashboard */}
            {user ? (
              <Link
                to={
                  isStudent
                    ? "/student/dashboard"
                    : isTeacher
                      ? "/teacher/dashboard"
                      : "/admin/dashboard"
                }
                className="block px-4 py-3 rounded-lg text-base font-medium bg-samarth-blue-700 text-white hover:bg-samarth-blue-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Login Options
                </p>
                <Link
                  to="/login?role=student"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-samarth-gray-600 hover:text-samarth-blue-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  to="/login?role=teacher"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-samarth-gray-600 hover:text-samarth-blue-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Teacher Login
                </Link>
                <Link
                  to="/login?role=admin"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-samarth-gray-600 hover:text-samarth-blue-700 hover:bg-gray-50 transition-colors"
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
