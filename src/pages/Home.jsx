import React, { Suspense, useState, useEffect } from "react";
import {
  featuredCourses,
  faculties,
  recentBlogs,
} from "../marketing/data/seed";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScholarshipPopup from "../components/ScholarshipPopup";
import Hero from "../marketing/components/Hero";
import InfoSection from "../marketing/components/InfoSection";
import InstituteFeatures from "../marketing/components/InstituteFeatures";
import AboutSection from "../marketing/components/AboutSection";
import CoursesCarousel from "../marketing/components/CoursesCarousel";
import CourseCard, {
  CourseCardSkeleton,
} from "../marketing/components/CourseCard";
import ClassCard from "../marketing/components/ClassCard";
import CategoryCard from "../marketing/components/CategoryCard";
import { Stethoscope, Atom, Backpack, BookOpen, GraduationCap, Target } from "lucide-react";
import FacultyCard from "../marketing/components/FacultyCard";
import Testimonials from "../marketing/components/Testimonials";
import StudentResults from "../marketing/components/StudentResults";
import BlogCard from "../marketing/components/BlogCard";
import { FiArrowRight, FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Reusable Section Wrapper for On-Scroll Animations
const Section = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 z-50 bg-samarth-bg flex items-center justify-center"
  >
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        borderRadius: ["20%", "50%", "20%"],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-16 h-16 border-4 border-samarth-blue-700 border-t-transparent rounded-full"
    />
  </motion.div>
);

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col font-sans text-samarth-gray-900 bg-samarth-bg">
      <Navbar />
      <ScholarshipPopup />

      <main className="grow">
        {/* Hero Section */}
        <Hero />

        {/* Class Offerings Section - Course Cards */}
        <section className="pt-20 pb-12 bg-linear-to-b from-gray-50 to-white">
          <div className="container-custom">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Class Offerings
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Choose the right program for your academic journey
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  title: "NEET",
                  tags: ["Class 11", "Class 12"],
                  link: "/courses/neet",
                  icon: Stethoscope,
                  bgColor: "blue",
                  accentColor: "orange",
                },
                {
                  title: "IIT JEE",
                  tags: ["Class 11", "Class 12"],
                  link: "/courses/jee",
                  icon: Atom,
                  bgColor: "blue",
                  accentColor: "yellow",
                },
                {
                  title: "Pre Foundation",
                  tags: ["Class 6", "Class 7", "Class 8", "NTSE/Olympiad", "Competitive Exams"],
                  link: "/courses/pre-foundation",
                  icon: Backpack,
                  bgColor: "yellow",
                  accentColor: "orange",
                },
                {
                  title: "Foundation",
                  tags: ["Class 9"],
                  link: "/courses/foundation",
                  icon: BookOpen,
                  bgColor: "green",
                  accentColor: "green",
                },
                {
                  title: "School Boards",
                  tags: ["Class 10"],
                  link: "/courses/boards",
                  icon: GraduationCap,
                  bgColor: "purple",
                  accentColor: "purple",
                },
                {
                  title: "Dropper",
                  tags: ["Class 11", "Class 12"],
                  link: "/courses/dropper",
                  icon: Target,
                  bgColor: "pink",
                  accentColor: "pink",
                },
              ].map((category, idx) => (
                <motion.div key={idx} variants={fadeInUp}>
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="container-custom">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* About Section */}
        <AboutSection />

        {/* Info Section (Fade In Up)
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <InfoSection />
        </motion.div> */}

        {/* Institute Features Section (Zoom In) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={zoomIn}
        >
          <InstituteFeatures />
        </motion.div>

        {/* Divider */}
        <div className="container-custom py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Courses Section (Staggered Grid) */}
        <section className="py-16 container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-samarth-blue-900 mb-4">
                Our Featured Courses
              </h2>
              <p className="text-samarth-gray-600 max-w-xl">
                Explore our highest-rated courses designed by industry experts.
              </p>
            </div>
            <Link
              to="/courses"
              className="hidden md:inline-flex items-center text-samarth-blue-700 font-semibold hover:text-samarth-blue-900 transition-colors mt-4 md:mt-0"
            >
              View All Courses <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <Suspense
              fallback={
                <div className="h-96 w-full bg-gray-100 animate-pulse rounded-2xl"></div>
              }
            >
              <CoursesCarousel courses={featuredCourses} />
            </Suspense>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="container-custom py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Faculties Highlight (Staggered Grid) */}
        <section className="py-16 container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={zoomIn}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">
              Our Team
            </span>
            <h2 className="text-4xl font-bold text-samarth-blue-900 mb-4">
              Learn from Industry Experts
            </h2>
            <p className="text-samarth-gray-600 max-w-2xl mx-auto">
              Gain insights from industry experts and master real-world skills
              for career growth.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {faculties.map((faculty) => (
              <motion.div variants={fadeInUp} key={faculty.id}>
                <FacultyCard faculty={faculty} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-10"
          >
            <Link
              to="/faculties"
              className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              See all
            </Link>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="container-custom py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Student Results Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <StudentResults />
        </motion.div>

        {/* Testimonials Section (Fade In Left) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInLeft}
        >
          <Testimonials />
        </motion.div>

        {/* CTA Banner (Fade In Right) */}
        <motion.section
          className="py-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInRight}
        >
          {/* Explicit inline style for background color to ensure it overrides any potential CSS conflicts or missing classes */}
          <div
            className="relative overflow-hidden"
            style={{ backgroundColor: "#1e40af" }}
          >
            <div className="container-custom py-12 md:py-20 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="md:w-1/2 text-white text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                    Join Us & Spread <br className="hidden md:block" />
                    Experiences
                  </h2>
                  <p className="text-blue-100 text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
                    At Samarth Classes, we believe in the power of education to
                    transform lives. Join our community today.
                  </p>
                  <Link
                    to="/register-scholarship"
                    className="btn-sweep inline-block px-6 py-3 md:px-8 md:py-4 bg-white text-blue-900 font-bold rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                  >
                    Become a Student
                  </Link>
                </div>
                <div className="md:w-1/2 relative">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img
                      src="testimonial_3.jpeg"
                      alt="Join us"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
        </motion.section>

        {/* Latest Blogs (Staggered) */}
        <section className="py-20 container-custom bg-samarth-bg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-samarth-blue-900 mb-4">
                Latest Blogs
              </h2>
              <p className="text-samarth-gray-600 max-w-xl">
                See how our students and mentors are making a difference.
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden md:inline-flex items-center text-samarth-blue-700 font-semibold hover:text-samarth-blue-900 transition-colors mt-4 md:mt-0"
            >
              Read All Articles <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {recentBlogs.map((blog) => (
              <motion.div variants={fadeInUp} key={blog.id}>
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Locations List (Fade Up) */}
        <motion.section
          className="py-20 bg-white border-t border-samarth-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-samarth-blue-900 mb-4">
                Visit Our Centers
              </h2>
              <p className="text-samarth-gray-600">
                We have two convenient branches in Vadodara to serve you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Branch 1 */}
              <div className="p-8 rounded-2xl bg-samarth-bg border border-samarth-gray-200">
                <h3 className="text-2xl font-bold text-samarth-blue-900 mb-4">
                  Waghodia Road Branch
                </h3>
                <div className="space-y-3 text-samarth-gray-600 mb-6">
                  <p className="flex items-start">
                    <FiMapPin className="mt-1 mr-2 text-samarth-blue-700 shrink-0" />{" "}
                    3rd floor, Sharnam complex I/F of Savita hospital, Pariwar
                    Cross road, Waghodia Road, Vadodara - 390025
                  </p>
                  <p className="flex items-center">
                    <FiPhone className="mr-2 text-samarth-blue-700" /> +91
                    9624225939
                  </p>
                  <p className="flex items-center">
                    <FiClock className="mr-2 text-samarth-blue-700" /> Mon-Sat:
                    8AM-8PM, Sun: 8AM-12:30PM
                  </p>
                </div>
                {/* Google Map Embed */}
                <div className="rounded-xl overflow-hidden shadow-md h-64">
                  <iframe
                    title="Waghodia Road Branch"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://maps.google.com/maps?q=Samarth%20Institute%20Waghodia%20Road%20Vadodara&t=&z=15&ie=UTF8&output=embed"
                  ></iframe>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="p-8 rounded-2xl bg-samarth-bg border border-samarth-gray-200">
                <h3 className="text-2xl font-bold text-samarth-blue-900 mb-4">
                  Harni Branch
                </h3>
                <div className="space-y-3 text-samarth-gray-600 mb-6">
                  <p className="flex items-start">
                    <FiMapPin className="mt-1 mr-2 text-samarth-blue-700 shrink-0" />{" "}
                    42, 4th floor siddheshwar Paradise, Near Gada circle, Harni-
                    Sama link road, Harni, Vadodara - 390022
                  </p>
                  <p className="flex items-center">
                    <FiPhone className="mr-2 text-samarth-blue-700" /> +91
                    9624225737
                  </p>
                  <p className="flex items-center">
                    <FiClock className="mr-2 text-samarth-blue-700" /> Mon-Sat:
                    8AM-8PM, Sun: 8AM-12:30PM
                  </p>
                </div>
                {/* Google Map Embed */}
                <div className="rounded-xl overflow-hidden shadow-md h-64">
                  <iframe
                    title="Harni Branch"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://maps.google.com/maps?q=Samarth%20Institute%20Harni%20Vadodara&t=&z=15&ie=UTF8&output=embed"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
