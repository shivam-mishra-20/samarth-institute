/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiAward, FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";
import { GraduationCap, Trophy, Calendar, Users, Target, BookOpen, Sparkles, CheckCircle, Clock, Star, Award } from "lucide-react";

const Hero = () => {
  return (
    <>
      {/* Scholarship Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full mt-16 md:mt-20 bg-linear-to-br from-orange-100 via-red-100 to-pink-100 border-b-4 border-orange-300 py-6 px-4 overflow-hidden shadow-2xl"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200/30 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-200/40 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative max-w-7xl mx-auto z-10">
          {/* Top Row - Main Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-200 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                  <GraduationCap className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-gray-900 text-lg sm:text-xl">#ExamReadyWithSamarth</p>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white font-bold text-xs rounded-full"
                    >
                      <Star className="w-3 h-3 fill-current" />
                      ADMISSIONS OPEN
                    </motion.div>
                  </div>
                  <p className="text-xs text-gray-700 font-bold">JEE | NEET | FOUNDATION | Classes 6th-12th</p>
                </div>
              </div>
              <div className="hidden xl:block">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-red-700 font-black text-3xl rounded-xl shadow-xl border-2 border-red-300"
                >
                  <Trophy className="w-7 h-7 text-yellow-600" />
                  UP TO 90% OFF
                  <Trophy className="w-7 h-7 text-yellow-600" />
                </motion.div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full shadow-xl text-sm sm:text-base flex items-center gap-2 border-2 border-red-700"
            >
              Register Now <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Bottom Row - Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* Scholarship Pool */}
            <div className="col-span-2 md:col-span-2 lg:col-span-2 p-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-orange-300 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-xs font-bold text-gray-700">Scholarship Pool</span>
              </div>
              <p className="text-2xl font-black text-red-700">₹50 Lakh</p>
            </div>

            {/* Next Test */}
            <div className="p-3 rounded-xl bg-red-600 backdrop-blur-sm border-2 border-red-700 shadow-md">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">Next Test</span>
              </div>
              <p className="text-sm font-black text-white">22nd Feb</p>
              <p className="text-xs text-red-100">Sunday</p>
            </div>

            {/* Seats Left */}
            <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-orange-300 shadow-md">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold text-gray-700">Seats Left</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-900">234</span>
                <span className="text-xs text-red-600 font-bold animate-pulse">HURRY!</span>
              </div>
            </div>

            {/* Merit Rewards */}
            <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-orange-300 shadow-md">
              <div className="flex items-center gap-1 mb-1">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-bold text-gray-700">Top 10</span>
              </div>
              <p className="text-xs font-black text-gray-900 leading-tight">Free Study Material</p>
            </div>

            {/* Batch Size */}
            <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-orange-300 shadow-md">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-gray-700">Small Batch</span>
              </div>
              <p className="text-xl font-black text-gray-900">15-18</p>
              <p className="text-xs text-gray-700">students</p>
            </div>
          </div>

          {/* Bottom Features - Mobile Hidden */}
          <div className="hidden lg:flex items-center justify-center gap-6 mt-4 pt-4 border-t border-orange-300">
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-semibold">Interactive Live Classes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-semibold">One-on-One Doubt Solving</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-semibold">Personal Academic Mentor</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-semibold">Priority Batch Selection</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-red-600 min-h-[32vh]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-white space-y-4 lg:space-y-5 z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-bold text-white">Excellence Through Consistency</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-start gap-3 mb-2">
                <Trophy className="w-10 h-10 text-yellow-400 mt-1 animate-pulse" />
                <div>
                  <span className="text-red-400 drop-shadow-lg">Consistency</span>
                  <span className="text-white"> is what</span>
                </div>
              </div>
              <span className="text-blue-200 drop-shadow-lg">Transforms Average</span>
              <span className="block mt-2 text-white">into </span>
              <span className="text-red-400 drop-shadow-lg text-5xl lg:text-6xl">Excellence.</span>
            </motion.h1>

            {/* Standards Section with Icon */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <GraduationCap className="w-5 h-5" />
                <span>Available for Standards</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[6, 7, 8, 9, 10, 11, 12].map((std, i) => (
                  <motion.div
                    key={std}
                    className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-base shadow-lg border-2 border-red-400"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                    whileHover={{ scale: 1.15, backgroundColor: "rgb(220, 38, 38)", y: -3 }}
                  >
                    {std}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Boards Section with Icon */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <BookOpen className="w-5 h-5" />
                <span>Boards & Streams</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {['Science', 'CBSE', 'GSEB', 'ICSE', 'Eng. Med.'].map((board, i) => (
                  <motion.span
                    key={board}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                    className="px-4 py-1.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-lg text-white font-bold text-sm"
                  >
                    {board}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="grid grid-cols-2 gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-white">Expert Faculty</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-white">Small Batches</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              className="flex gap-3 pt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-base hover:bg-blue-50 transition-colors shadow-2xl border-4 border-blue-200"
                >
                  <FiBookOpen className="w-5 h-5" />
                  Explore Courses
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FiArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Images Grid Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-3 gap-4">
              {/* Image 1 - Top Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                className="col-span-2 row-span-2 bg-white rounded-2xl shadow-2xl overflow-hidden h-64"
              >
                <img
                  src="/Images/image.png"
                  alt="Student Group"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Image 2 - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                className="bg-white rounded-xl shadow-xl overflow-hidden h-30"
              >
                <img
                  src="/Images/image copy 2.png"
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Image 3 - Middle Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                className="bg-white rounded-xl shadow-xl overflow-hidden h-30"
              >
                <img
                  src="/Images/image copy 3.png"
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Image 4 - Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                className="bg-white rounded-xl shadow-xl overflow-hidden h-32"
              >
                <img
                  src="/Images/image copy 4.png"
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Image 5 - Bottom Middle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                className="bg-white rounded-xl shadow-xl overflow-hidden h-32"
              >
                <img
                  src="/Images/image copy 5.png"
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Image 6 - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                className="bg-white rounded-xl shadow-xl overflow-hidden h-32"
              >
                <img
                  src="/Images/image copy.png"
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
    </>
  );
};

export default Hero;
