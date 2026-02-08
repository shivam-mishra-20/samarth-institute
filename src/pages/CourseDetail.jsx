import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { coursesData } from '../data/coursesData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, 
  FiBookOpen, 
  FiCheckCircle, 
  FiDownload, 
  FiCalendar,
  FiUserCheck,
  FiArrowLeft
} from 'react-icons/fi';

const CourseDetail = () => {
  const { slug } = useParams();
  
  // Directly derive course from data to avoid useEffect/useState sync issues
  const course = coursesData.find(c => c.slug === slug);

  if (!course) {
    return (
        <div className="min-h-screen bg-samarth-bg flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
                <Link to="/courses" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
                    <FiArrowLeft /> Back to Courses
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-samarth-bg font-sans text-gray-800">
      <Navbar />

      <AnimatePresence mode='wait'>
        <motion.div
           key={slug}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Hero Section */}
          <section className={`relative pt-32 pb-20 bg-blue-800 text-white overflow-hidden`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="container-custom relative z-10">
                <Link to="/courses" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
                    <FiArrowLeft className="mr-2" /> Back to All Courses
                </Link>
                
                <div className="max-w-4xl">
                    <div className={`inline-block px-4 py-1 rounded-full bg-${course.color}-500/30 border border-${course.color}-400/50 text-sm font-semibold uppercase tracking-wider mb-4`}>
                        {course.category}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{course.title}</h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl leading-relaxed">
                        {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-6 text-sm md:text-base font-medium">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <FiBookOpen className="text-yellow-400" /> {course.grade}
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <FiClock className="text-yellow-400" /> {course.duration}
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            {course.category === "Competitive" && (
                               <><FiCheckCircle className="text-yellow-400" /> Daily Practice Problems (DPP)</>
                            )}
                            {course.category === "Boards" && (
                               <><FiCheckCircle className="text-yellow-400" /> Answer Writing Focus</>
                            )}
                            {course.category === "Foundation" && (
                               <><FiCheckCircle className="text-yellow-400" /> Activity Based Learning</>
                            )}
                            {!["Competitive", "Boards", "Foundation"].includes(course.category) && (
                               <><FiCalendar className="text-yellow-400" /> New Batches Starting Soon</>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-20">
              <div className="container-custom">
                  <div className="flex flex-col lg:flex-row gap-12">
                      
                      {/* Left Sidebar (Features & Quick Info) */}
                      <div className="lg:w-1/3 space-y-8">
                          {/* Enquire Box */}
                          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                              <h3 className="text-xl font-bold text-gray-900 mb-4">Enroll in this Course</h3>
                              <p className="text-gray-600 mb-6 text-sm">Get expert counseling and detailed fee structure.</p>
                              <Link to="/contact" className="w-full block text-center py-3 bg-samarth-blue-600 hover:bg-samarth-blue-700 text-white rounded-xl font-bold transition-colors mb-3">
                                  Enquire Now
                              </Link>
                              <button className="w-full py-3 bg-blue-50 text-blue-700 hover:bg-blue-400 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm">
                                  <FiDownload /> Download Brochure
                              </button>
                          </div>

                          {/* Subjects */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <FiBookOpen className={`text-${course.color}-600`} /> Subjects Covered
                              </h3>
                              <ul className="space-y-3">
                                  {course.subjects.map((sub, i) => (
                                      <li key={i} className="flex items-center text-gray-700 font-medium">
                                          <span className={`w-2 h-2 rounded-full bg-${course.color}-500 mr-3`}></span>
                                          {sub}
                                      </li>
                                  ))}
                              </ul>
                          </div>

                          {/* Key Features */}
                          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <FiCheckCircle className={`text-${course.color}-600`} /> Why Join?
                               </h3>
                               <ul className="space-y-3">
                                  {course.features.map((feat, i) => (
                                      <li key={i} className="flex items-start text-sm text-gray-600">
                                          <FiCheckCircle className="mt-0.5 mr-2 text-green-500 shrink-0" />
                                          {feat}
                                      </li>
                                  ))}
                               </ul>
                          </div>
                      </div>

                      {/* Main Content Area */}
                      <div className="lg:w-2/3">
                          
                          {/* Overview */}
                          <div className="mb-12">
                              <h2 className="text-2xl font-bold text-samarth-blue-900 mb-6">Course Overview</h2>
                              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                  The <span className="font-semibold">{course.title}</span> program at Samarth Institute is meticulously designed to provide students with deep conceptual clarity and problem-solving skills. Whether you are aiming for strong school results or building a foundation for competitive exams, this course covers all aspects of the curriculum with added focus on logical reasoning and application-based learning.
                              </p>
                              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                                  <h4 className="font-bold text-blue-900 mb-2">Learning Outcomes</h4>
                                  <p className="text-blue-800">{course.outcomes}</p>
                              </div>
                          </div>

                          {/* Syllabus / Phases */}
                          <div className="mb-12">
                              <h2 className="text-2xl font-bold text-samarth-blue-900 mb-6">Syllabus Highlights</h2>
                              <div className="grid md:grid-cols-2 gap-6">
                                  {course.syllabus?.map((topic, i) => (
                                      <div 
                                        key={i}
                                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                      >
                                          <div className={`w-10 h-10 rounded-lg bg-${course.color}-100 text-${course.color}-600 flex items-center justify-center font-bold text-lg mb-3`}>
                                              {i + 1}
                                          </div>
                                          <h4 className="font-bold text-gray-800">{topic}</h4>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Methodology / Extra Benefits */}
                          <div>
                              <h2 className="text-2xl font-bold text-samarth-blue-900 mb-6">Samarth Advantage</h2>
                              <div className="grid sm:grid-cols-2 gap-6">
                                  <div className="flex gap-4">
                                      <div className="shrink-0 mt-1"><FiUserCheck className={`text-3xl text-${course.color}-600`} /></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900 mb-1">Personalized Attention</h4>
                                          <p className="text-sm text-gray-600">Small batch sizes ensuring every student gets individual mentor time.</p>
                                      </div>
                                  </div>
                                  <div className="flex gap-4">
                                      <div className="shrink-0 mt-1"><FiBookOpen className={`text-3xl text-${course.color}-600`} /></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900 mb-1">Comprehensive Material</h4>
                                          <p className="text-sm text-gray-600">Curated study modules, question banks, and revision notes.</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          </section>
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CourseDetail;
