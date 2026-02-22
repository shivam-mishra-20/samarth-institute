import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiAward, FiTrendingUp, FiStar, FiTarget } from 'react-icons/fi';

const ResultsShowcase = () => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Student results data from images
  const studentsData = [
    {
      id: 1,
      name: 'Jignyasa Patil',
      percentage: '98.31',
      standard: '10th',
      badge: 'A1',
      achievement: 'Top Scorer',
      category: 'Board Exams',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Jinal Vasava',
      percentage: '98.05',
      standard: '10th',
      badge: 'MBBS',
      achievement: 'PDU College, Rajkot',
      category: 'Board Exams',
      color: 'purple'
    },
    {
      id: 3,
      name: 'Jash Patel',
      percentage: '96.86',
      standard: '12th',
      achievement: 'Outstanding Performance',
      category: 'Board Exams',
      color: 'indigo'
    },
    {
      id: 4,
      name: 'Mannat Singh',
      percentage: '96.00',
      standard: '10th',
      badge: 'A1',
      achievement: 'Excellent Result',
      category: 'Board Exams',
      color: 'red'
    },
    {
      id: 5,
      name: 'Ashmay Panchbhave',
      percentage: '95.53',
      standard: '11th',
      achievement: 'ILE - Top Performer',
      category: 'Competitive',
      color: 'orange'
    },
    {
      id: 6,
      name: 'Om Bagul',
      percentage: '95.20',
      standard: '12th',
      achievement: 'Outstanding Achievement',
      category: 'Board Exams',
      color: 'teal'
    },
    {
      id: 7,
      name: 'Manthan Shah',
      percentage: '94.92',
      standard: '11th',
      achievement: 'ILE - Excellent',
      category: 'Competitive',
      color: 'cyan'
    },
    {
      id: 8,
      name: 'Meghanshi Kakde',
      percentage: '94.92',
      standard: '11th',
      achievement: 'ILE - Top Performer',
      category: 'Competitive',
      color: 'pink'
    },
    {
      id: 9,
      name: 'Annana Purwar',
      percentage: '94.00',
      standard: '12th',
      achievement: 'Excellent Performance',
      category: 'Board Exams',
      color: 'green'
    },
    {
      id: 10,
      name: 'Bhagya Shah',
      percentage: '94.00',
      standard: '12th',
      achievement: 'JEE - ILE Achiever',
      category: 'Competitive',
      color: 'amber'
    },
    {
      id: 11,
      name: 'Shahana Electricwala',
      percentage: '93.63',
      standard: '11th',
      achievement: 'ILE - Great Performance',
      category: 'Competitive',
      color: 'lime'
    },
    {
      id: 12,
      name: 'Priyal Brahmbhatt',
      percentage: '93.11',
      standard: '11th',
      achievement: 'ILE - Outstanding',
      category: 'Competitive',
      color: 'violet'
    },
    {
      id: 13,
      name: 'Krina Zalawadia',
      percentage: '91.86',
      standard: '11th',
      achievement: 'ILE - Excellent',
      category: 'Competitive',
      color: 'fuchsia'
    },
    {
      id: 14,
      name: 'Krishna Chandawani',
      percentage: '91.00',
      standard: '12th',
      achievement: 'Great Achievement',
      category: 'Board Exams',
      color: 'rose'
    },
    {
      id: 15,
      name: 'Kyana Suthar',
      percentage: '91.00',
      standard: '12th',
      achievement: 'Outstanding Result',
      category: 'Board Exams',
      color: 'sky'
    },
    {
      id: 16,
      name: 'Annanya Purwar',
      percentage: 'MBBS',
      standard: '12th',
      badge: 'MBBS',
      achievement: 'GMERS College, Gotri',
      category: 'Medical',
      color: 'emerald'
    }
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    { value: '10th', label: 'Class 10th' },
    { value: '11th', label: 'Class 11th' },
    { value: '12th', label: 'Class 12th' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        hover: 'from-blue-600 to-blue-700',
        border: 'border-blue-200',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        hover: 'from-purple-600 to-purple-700',
        border: 'border-purple-200',
        text: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700'
      },
      indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        hover: 'from-indigo-600 to-indigo-700',
        border: 'border-indigo-200',
        text: 'text-indigo-600',
        badge: 'bg-indigo-100 text-indigo-700'
      },
      red: {
        bg: 'from-red-500 to-red-600',
        hover: 'from-red-600 to-red-700',
        border: 'border-red-200',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-700'
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        hover: 'from-orange-600 to-orange-700',
        border: 'border-orange-200',
        text: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700'
      },
      teal: {
        bg: 'from-teal-500 to-teal-600',
        hover: 'from-teal-600 to-teal-700',
        border: 'border-teal-200',
        text: 'text-teal-600',
        badge: 'bg-teal-100 text-teal-700'
      },
      cyan: {
        bg: 'from-cyan-500 to-cyan-600',
        hover: 'from-cyan-600 to-cyan-700',
        border: 'border-cyan-200',
        text: 'text-cyan-600',
        badge: 'bg-cyan-100 text-cyan-700'
      },
      pink: {
        bg: 'from-pink-500 to-pink-600',
        hover: 'from-pink-600 to-pink-700',
        border: 'border-pink-200',
        text: 'text-pink-600',
        badge: 'bg-pink-100 text-pink-700'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        hover: 'from-green-600 to-green-700',
        border: 'border-green-200',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-700'
      },
      amber: {
        bg: 'from-amber-500 to-amber-600',
        hover: 'from-amber-600 to-amber-700',
        border: 'border-amber-200',
        text: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-700'
      },
      lime: {
        bg: 'from-lime-500 to-lime-600',
        hover: 'from-lime-600 to-lime-700',
        border: 'border-lime-200',
        text: 'text-lime-600',
        badge: 'bg-lime-100 text-lime-700'
      },
      violet: {
        bg: 'from-violet-500 to-violet-600',
        hover: 'from-violet-600 to-violet-700',
        border: 'border-violet-200',
        text: 'text-violet-600',
        badge: 'bg-violet-100 text-violet-700'
      },
      fuchsia: {
        bg: 'from-fuchsia-500 to-fuchsia-600',
        hover: 'from-fuchsia-600 to-fuchsia-700',
        border: 'border-fuchsia-200',
        text: 'text-fuchsia-600',
        badge: 'bg-fuchsia-100 text-fuchsia-700'
      },
      rose: {
        bg: 'from-rose-500 to-rose-600',
        hover: 'from-rose-600 to-rose-700',
        border: 'border-rose-200',
        text: 'text-rose-600',
        badge: 'bg-rose-100 text-rose-700'
      },
      sky: {
        bg: 'from-sky-500 to-sky-600',
        hover: 'from-sky-600 to-sky-700',
        border: 'border-sky-200',
        text: 'text-sky-600',
        badge: 'bg-sky-100 text-sky-700'
      },
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        hover: 'from-emerald-600 to-emerald-700',
        border: 'border-emerald-200',
        text: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700'
      }
    };

    return colors[color] || colors.blue;
  };

  const filteredStudents = selectedClass === 'all' 
    ? studentsData 
    : studentsData.filter(student => student.standard === selectedClass);

  const stats = [
    { icon: FiAward, label: 'Top Achievers', value: '16+', color: 'text-blue-600' },
    { icon: FiTrendingUp, label: 'Average Score', value: '94.2%', color: 'text-purple-600' },
    { icon: FiStar, label: 'Above 90%', value: '100%', color: 'text-amber-600' },
    { icon: FiTarget, label: 'Success Rate', value: '98%', color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 to-blue-50 font-sans text-gray-800">
      <Navbar />
      
      <main className="grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-linear-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block mb-6"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-block">
                  <FiAward className="w-16 h-16 text-yellow-300" />
                </div>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                Outstanding Results 2025-26
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Celebrating Excellence & Academic Achievements
              </p>
              <p className="text-lg text-blue-50 max-w-2xl mx-auto">
                Our students have achieved remarkable success in Board Exams and Competitive Tests,
                showcasing their dedication and our commitment to quality education.
              </p>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-12 bg-linear-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our Star Performers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Filter results by class to see outstanding achievements
              </p>
              
              {/* Class Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                {classOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setSelectedClass(option.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      selectedClass === option.value
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Results Grid */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedClass}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredStudents.map((student, index) => {
                  const colorClasses = getColorClasses(student.color, hoveredCard === student.id);
                  
                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredCard(student.id)}
                      onHoverEnd={() => setHoveredCard(null)}
                      whileHover={{ y: -8 }}
                      className="relative"
                    >
                      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${colorClasses.border} transition-all duration-300 ${hoveredCard === student.id ? 'shadow-2xl' : ''}`}>
                        {/* Badge */}
                        {student.badge && (
                          <div className={`absolute top-4 right-4 ${colorClasses.badge} px-3 py-1 rounded-full text-xs font-bold z-10`}>
                            {student.badge}
                          </div>
                        )}

                        {/* Gradient Header */}
                        <div className={`h-32 bg-linear-to-r ${hoveredCard === student.id ? colorClasses.hover : colorClasses.bg} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                          <div className="relative z-10 h-full flex items-center justify-center">
                            <motion.div
                              animate={{ scale: hoveredCard === student.id ? 1.1 : 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FiAward className="w-16 h-16 text-white" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                            {student.name}
                          </h3>
                          
                          <div className={`text-4xl font-bold ${colorClasses.text} text-center mb-2`}>
                            {student.percentage}{student.percentage !== 'MBBS' && '%'}
                          </div>
                          
                          <div className="text-center text-sm text-gray-600 mb-2">
                            Class {student.standard}
                          </div>
                          
                          {student.achievement && (
                            <div className="text-center text-sm text-gray-700 font-medium bg-gray-50 rounded-lg py-2 px-3">
                              {student.achievement}
                            </div>
                          )}

                          {student.category && (
                            <div className="mt-3 text-center">
                              <span className={`inline-block text-xs font-semibold ${colorClasses.badge} px-3 py-1 rounded-full`}>
                                {student.category}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* No Results Message */}
            {filteredStudents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 text-lg">No results found for the selected class.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-linear-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Join Our Success Story?
              </h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Be part of our next batch of achievers. Admissions open for 2026-27.
              </p>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Apply Now for Admission
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsShowcase;
