import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiCalendar, FiBookOpen, FiMapPin, FiCheckCircle, FiArrowRight, FiAward } from 'react-icons/fi';

// Helper to get next N Sundays from today
const getNextSundays = (count) => {
  const sundays = [];
  const today = new Date();
  let current = new Date(today);
  const daysUntilSunday = (7 - current.getDay()) % 7 || 7;
  current.setDate(current.getDate() + daysUntilSunday);
  for (let i = 0; i < count; i++) {
    sundays.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  return sundays;
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const Register = () => {
  const testDates = getNextSundays(6);
  
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    classApplying: '',
    testDate: '',
    school: '',
    address: '',
    branch: 'waghodia'
  });

  const [submitted, setSubmitted] = useState(false);

  const classOptions = ['6th', '7th', '8th', '9th', '10th', '11th'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setSubmitted(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md mx-4"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="text-4xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for registering for the Scholarship Test. We will contact you shortly with further details.</p>
            <div className="bg-blue-50 p-4 rounded-xl text-left mb-6">
              <p className="text-sm text-gray-500 mb-1">Your Test Date</p>
              <p className="font-bold text-blue-800">{formData.testDate}</p>
            </div>
            <a href="/" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
              Back to Home
            </a>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container-custom relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <FiAward className="text-yellow-300" /> Limited Seats Available
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Scholarship Test Registration</h1>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Register for the upcoming Scholarship Test and get a chance to win up to 100% fee waiver.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <motion.form 
                onSubmit={handleSubmit}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Details</h2>
                <p className="text-gray-500 mb-8">Please fill in all the required information accurately.</p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Student Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student's Full Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiUser /></span>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="e.g., Rahul Sharma"
                      />
                    </div>
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Parent/Guardian Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiUser /></span>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="e.g., Mr. Suresh Sharma"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiMail /></span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="parent@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiPhone /></span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-gray-100" />

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Details</h2>
                <p className="text-gray-500 mb-8">Select your preferred test date and class.</p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Class Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Applying for Class *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiBookOpen /></span>
                      <select
                        name="classApplying"
                        value={formData.classApplying}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none"
                      >
                        <option value="">Select Class</option>
                        {classOptions.map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Test Date Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Test Date *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiCalendar /></span>
                      <select
                        name="testDate"
                        value={formData.testDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none"
                      >
                        <option value="">Select Date</option>
                        {testDates.map((date, i) => (
                          <option key={i} value={formatDate(date)}>{formatDate(date)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Current School */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current School Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiBookOpen /></span>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="e.g., Delhi Public School"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-gray-100" />

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferred Branch</h2>
                <p className="text-gray-500 mb-6">Select the center where you'd like to take the test.</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <label 
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      formData.branch === 'waghodia' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="branch" 
                      value="waghodia" 
                      checked={formData.branch === 'waghodia'}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Waghodia Road</p>
                      <p className="text-sm text-gray-500">3rd floor, Sharnam complex, Pariwar Cross road</p>
                    </div>
                  </label>
                  <label 
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      formData.branch === 'harni' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="branch" 
                      value="harni" 
                      checked={formData.branch === 'harni'}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Harni Branch</p>
                      <p className="text-sm text-gray-500">42, 4th floor, Siddheshwar Paradise, Near Gada circle</p>
                    </div>
                  </label>
                </div>

                {/* Address */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Residential Address</label>
                  <div className="relative">
                    <span className="absolute top-4 left-0 pl-4 flex items-start text-gray-400"><FiMapPin /></span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="Full residential address"
                    ></textarea>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
                >
                  Register for Scholarship Test
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  By registering, you agree to be contacted by our team regarding the scholarship test.
                </p>
              </motion.form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
