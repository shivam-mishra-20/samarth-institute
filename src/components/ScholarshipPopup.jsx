import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAward, FiCalendar, FiUsers, FiArrowRight, FiGift } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Helper to get next N Sundays from today
const getNextSundays = (count) => {
  const sundays = [];
  const today = new Date();
  let current = new Date(today);
  
  // Find the next Sunday
  const daysUntilSunday = (7 - current.getDay()) % 7 || 7;
  current.setDate(current.getDate() + daysUntilSunday);

  for (let i = 0; i < count; i++) {
    sundays.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  return sundays;
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ScholarshipPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const testDates = getNextSundays(6);
  const [selectedDate, setSelectedDate] = useState(testDates[0] || null);

  // Seat availability per class
  const seatData = [
    { class: '6th', seats: 25, color: 'blue' },
    { class: '7th', seats: 22, color: 'indigo' },
    { class: '8th', seats: 20, color: 'violet' },
    { class: '9th', seats: 18, color: 'purple' },
    { class: '10th', seats: 15, color: 'fuchsia' },
    { class: '11th', seats: 12, color: 'pink' },
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 }
    })
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/50 text-white hover:bg-white hover:text-red-500 transition-colors backdrop-blur-md"
            >
              <FiX size={20} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"
              ></motion.div>
              <div className="relative z-10 flex items-center gap-4">
                <motion.div
                   initial={{ rotate: -15, scale: 0 }}
                   animate={{ rotate: 0, scale: 1 }}
                   transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                   className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hidden sm:block"
                >
                  <FiGift className="text-3xl text-yellow-300" />
                </motion.div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">Scholarship Test</h2>
                  <p className="text-blue-100 text-xs md:text-sm">Up to 100% Fee Waiver for Meritorious Students</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 space-y-5">
              
              {/* Test Dates */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiCalendar /> Select Test Date
                </h3>
                <div className="flex flex-wrap gap-2">
                  {testDates.map((date, i) => (
                    <motion.button
                      key={i}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => setSelectedDate(date)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedDate && selectedDate.getTime() === date.getTime()
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {formatDate(date)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Available Seats Per Class */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiUsers /> Available Seats
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {seatData.map((item, i) => (
                    <motion.div
                      key={item.class}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`p-2 rounded-lg text-center bg-${item.color}-50 border border-${item.color}-100`}
                    >
                      <p className={`text-sm font-bold text-${item.color}-700 leading-none`}>{item.seats}</p>
                      <p className="text-[10px] text-gray-500 font-medium">Class {item.class}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Test Details Grid */}
               <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Format</p>
                      <p className="font-semibold text-gray-800 text-sm">Objective (MCQ)</p>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Duration</p>
                      <p className="font-semibold text-gray-800 text-sm">1 Hour</p>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Reg. Fee</p>
                      <p className="font-bold text-green-600 text-sm">FREE</p>
                  </div>
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Venue</p>
                      <p className="font-semibold text-gray-800 text-sm">Offline Center</p>
                  </div>
              </div>

              {/* Benefits */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-3">
                <FiAward className="text-xl text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 text-sm">Win Scholarship</p>
                  <p className="text-xs text-amber-700 leading-snug">Top performers receive 25% to 100% tuition fee waiver.</p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <Link
                  to="/register-scholarship"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                >
                  Register for Scholarship Test
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScholarshipPopup;
