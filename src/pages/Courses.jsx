import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiClock, 
  FiBook, 
  FiAward, 
  FiArrowRight, 
  FiUsers, 
  FiCheck,
  FiStar,
  FiBookOpen
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { coursesData } from '../data/coursesData';

const categories = ["All", "Foundation", "Boards", "Competitive"];

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-samarth-bg font-sans text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-samarth-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Expert Designed Courses
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto mb-10"
            >
              From building strong foundations in Class 6 to mastering competitive exams like JEE & NEET, we have the perfect roadmap for your success.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="max-w-xl mx-auto relative"
            >
               <input 
                 type="text" 
                 placeholder="Search for a course (e.g. 'Class 10', 'NEET')..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full py-4 pl-12 pr-6 rounded-full text-gray-800 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg"
               />
               <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
         <div className="container-custom">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
               {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                       activeCategory === cat 
                         ? 'bg-samarth-blue-700 text-white shadow-lg' 
                         : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>

            {/* Courses Grid */}
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               <AnimatePresence>
                 {filteredCourses.map((course) => (
                    <motion.div
                       layout
                       key={course.id}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       transition={{ duration: 0.3 }}
                       className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 group transition-all duration-300 flex flex-col h-full"
                    >
                       {/* Card Header Color Strip */}
                       <div className={`h-2 w-full bg-blue-600`}></div>
                       
                       <div className="p-8 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                             <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700`}>
                                {course.category}
                             </span>
                             <div className="flex items-center text-gray-500 text-sm">
                                <FiClock className="mr-1" /> {course.duration}
                             </div>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-samarth-blue-700 transition-colors">
                             {course.title}
                          </h3>
                          <div className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                             <FiBookOpen className="mr-2 text-samarth-blue-500"/> {course.grade}
                          </div>

                          <p className="text-gray-600 mb-6 flex-1">
                             {course.description}
                          </p>
                          
                          <div className="space-y-3 mb-8">
                             {course.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start text-sm text-gray-700">
                                   <FiCheck className={`mt-0.5 mr-2 text-${course.color}-500 shrink-0`} />
                                   {feature}
                                </div>
                             ))}
                          </div>

                          <Link to={`/courses/${course.slug}`} className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-700 font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                             Brochure & Syllabus <FiArrowRight />
                          </Link>
                       </div>
                    </motion.div>
                 ))}
               </AnimatePresence>
            </motion.div>

            {filteredCourses.length === 0 && (
               <div className="text-center py-20">
                  <p className="text-xl text-gray-500">No courses found matching your criteria.</p>
                  <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="mt-4 text-blue-600 font-semibold hover:underline">
                     Clear Filters
                  </button>
               </div>
            )}
         </div>
      </section>

      {/* Why Our Courses Section */}
      <section className="py-20 bg-blue-50">
         <div className="container-custom">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-samarth-blue-900 mb-4">Why Our Curriculum Works</h2>
               <p className="text-gray-600 max-w-2xl mx-auto">Our courses are scientifically designed to match the cognitive development of students at each stage.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                  {
                     icon: <FiBook className="w-8 h-8"/>,
                     title: "Structured Learning",
                     desc: "Carefully sequenced topics ensuring prerequisite knowledge is solid before moving to advanced concepts."
                  },
                  {
                     icon: <FiUsers className="w-8 h-8"/>,
                     title: "Expert Mentorship",
                     desc: "Courses are delivered by subject matter experts who specialize in coaching for that specific grade level."
                  },
                  {
                     icon: <FiAward className="w-8 h-8"/>,
                     title: "Result Oriented",
                     desc: "Every module includes regular assessments and feedback loops to track and improve performance."
                  }
               ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm text-center">
                     <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        {item.icon}
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                     <p className="text-gray-600">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
