import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiTrendingUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Sample student results data for Samarth Institute
const studentResults = [
  {
    id: 1,
    name: "Arjun Patel",
    course: "JEE Advanced 2025",
    rank: "AIR 342",
    percentage: "98.6%",
    testimonial: "Samarth Institute's structured approach and dedicated faculty helped me achieve my dream rank. The study material was comprehensive and the doubt-clearing sessions were invaluable.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    resultImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Priya Sharma",
    course: "NEET 2025",
    rank: "AIR 189",
    percentage: "99.2%",
    testimonial: "The biology faculty at Samarth is exceptional. Regular mock tests and performance analysis helped me identify my weak areas and improve consistently.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    resultImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Rahul Mehta",
    course: "GUJCET 2025",
    rank: "State Rank 15",
    percentage: "99.8%",
    testimonial: "Joining Samarth was the best decision for my career. The personalized attention and expert guidance made all the difference in my preparation journey.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    resultImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"  
  },
  {
    id: 4,
    name: "Ananya Desai",
    course: "JEE Mains 2025",
    rank: "99.5 Percentile",
    percentage: "99.5%",
    testimonial: "The problem-solving techniques taught at Samarth Institute are unmatched. The faculty's experience in competitive exams truly shows in their teaching methodology.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    resultImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Karan Singh",
    course: "Board Exams 2025",
    rank: "District Topper",
    percentage: "97.8%",
    testimonial: "Samarth Institute's focus on concept clarity and regular practice helped me top my district in board exams. Forever grateful to my mentors here.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face",
    resultImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face"
  }
];

const StudentResults = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % studentResults.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + studentResults.length) % studentResults.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % studentResults.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  const activeStudent = studentResults[activeIndex];
  
  // Get visible students (current and next two for the list display)
  const getVisibleStudents = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % studentResults.length;
      visible.push({ ...studentResults[index], displayIndex: i });
    }
    return visible;
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="w-2 h-2 rounded-full bg-orange-300"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-samarth-blue-900 mb-4">
            Our Student Results
          </h2>
          <p className="text-samarth-gray-600 max-w-2xl mx-auto">
            Celebrating the outstanding achievements of Samarth Institute students who have excelled in various competitive examinations.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Student Cards List */}
            <div className="lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 order-2 lg:order-1">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {getVisibleStudents().map((student, idx) => (
                    <motion.div
                      key={student.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                        idx === 0 
                          ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 shadow-md' 
                          : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                      }`}
                      onClick={() => handleDotClick((activeIndex + idx) % studentResults.length)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Student Image */}
                        <div className={`relative shrink-0 ${idx === 0 ? 'ring-4 ring-orange-400 ring-offset-2' : ''} rounded-full`}>
                          <img
                            src={student.image}
                            alt={student.name}
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                          />
                          {idx === 0 && (
                            <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                              <FiAward className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-base md:text-lg ${idx === 0 ? 'text-orange-900' : 'text-gray-800'}`}>
                            {student.name}
                          </h4>
                          <p className={`text-sm ${idx === 0 ? 'text-orange-700' : 'text-gray-500'} mb-2`}>
                            {student.course}
                          </p>
                          <p className={`text-xs md:text-sm leading-relaxed line-clamp-2 ${idx === 0 ? 'text-orange-800' : 'text-gray-600'}`}>
                            {student.testimonial}
                          </p>
                          {idx === 0 && (
                            <div className="flex items-center gap-3 mt-3">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                <FiTrendingUp className="w-3 h-3" />
                                {student.rank}
                              </span>
                              <span className="text-orange-600 font-bold text-sm">
                                {student.percentage}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <a 
                  href="/results" 
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  View All Results
                </a>
                
                {/* Nav Arrows & Dots */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <button 
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition-colors"
                    aria-label="Previous result"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex gap-1.5 sm:gap-2">
                    {studentResults.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex 
                            ? 'w-5 sm:w-6 bg-orange-500' 
                            : 'w-2 bg-gray-300 hover:bg-orange-300'
                        }`}
                        aria-label={`Go to result ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleNext}
                    className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition-colors"
                    aria-label="Next result"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Image */}
            <div className="lg:w-1/2 relative min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[450px] bg-gradient-to-br from-gray-100 to-gray-200 order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStudent.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeStudent.resultImage}
                    alt={`${activeStudent.name}'s achievement`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with student info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={activeStudent.image}
                            alt={activeStudent.name}
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-lg">{activeStudent.name}</h4>
                            <p className="text-white/80 text-sm">{activeStudent.course}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg">
                            {activeStudent.rank}
                          </span>
                          <span className="text-2xl font-bold">
                            {activeStudent.percentage}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentResults;
