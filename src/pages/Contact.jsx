import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiMessageSquare, FiUser, FiBook, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { db } from '../config/firebase.config';
import { collection, doc, setDoc } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit number';
    }
    if (!formData.course) newErrors.course = 'Please select a course/query type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const docId = `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}_${yy}-${mm}-${dd}`;

      const enquiryData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.course,
        message: formData.message.trim(),
        submittedAt: now.toISOString(),
        status: 'pending',
      };

      await setDoc(doc(collection(db, 'contactEnquiries'), docId), enquiryData);
      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        course: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container-custom relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                We'd Love to Hear From You
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Get In Touch</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Have questions about admissions, courses, or anything else? Reach out and our team will get back to you within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards (General) */}
        <section className="py-16 md:py-20 bg-white relative -mt-12 z-10">
          <div className="container-custom">
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
               <motion.div 
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group text-center"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <FiMail className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">info@samarthinstitute.edu.in</p>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group text-center"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <FiPhone className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">+91 9624225939 / +91 9624225737</p>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group text-center"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <FiClock className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Working Hours</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Mon - Sat: 8:00 AM - 8:00 PM</p>
                </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">

              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
              >
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCheckCircle className="text-4xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h2>
                    <p className="text-gray-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                      <p className="text-gray-500">Fill out the form and we'll get back to you soon.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiUser /></span>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${errors.firstName ? 'border-red-400' : 'border-gray-200'}`}
                              placeholder="e.g., Rahul"
                            />
                          </div>
                          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiUser /></span>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${errors.lastName ? 'border-red-400' : 'border-gray-200'}`}
                              placeholder="e.g., Sharma"
                            />
                          </div>
                          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      {/* Email & Phone Row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiMail /></span>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                              placeholder="you@email.com"
                            />
                          </div>
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiPhone /></span>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              maxLength={10}
                              className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                              placeholder="98765 43210"
                            />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      {/* Course Interest */}
                      <div>
                        <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">Interested In *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiBook /></span>
                          <select
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-700 appearance-none ${errors.course ? 'border-red-400' : 'border-gray-200'}`}
                          >
                            <option value="">Select a course or query type</option>
                            <option value="Pre Foundation (Class 6-8)">Pre Foundation (Class 6-8)</option>
                            <option value="Foundation Class 9">Foundation Class 9</option>
                            <option value="Foundation Class 10">Foundation Class 10</option>
                            <option value="Integrated JEE (Class 11-12)">Integrated JEE (Class 11-12)</option>
                            <option value="Integrated NEET (Class 11-12)">Integrated NEET (Class 11-12)</option>
                            <option value="Integrated NTSE (Class 6-10)">Integrated NTSE (Class 6-10)</option>
                            <option value="Other Enquiry">Other Enquiry</option>
                          </select>
                        </div>
                        {errors.course && <p className="text-xs text-red-500 mt-1">{errors.course}</p>}
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                        <div className="relative">
                          <span className="absolute top-4 left-0 pl-4 flex items-start text-gray-400"><FiMessageSquare /></span>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="Tell us about your query..."
                          ></textarea>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <>
                            <FiLoader className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <FiSend className="transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Branch Locations Section */}
        <section className="py-16 bg-gray-50 border-b border-gray-200">
             <div className="container-custom">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Centers</h2>
                     <p className="text-gray-600 max-w-2xl mx-auto">We have two state-of-the-art campuses in Vadodara to serve you closer to home.</p>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-8">
                     {/* Waghodia Branch */}
                     <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
                     >
                         <div className="h-64 bg-gray-100 relative">
                            <iframe
                                title="Waghodia Road Branch"
                                src="https://maps.google.com/maps?q=Samarth%20Institute%20Waghodia%20Road%20Vadodara&t=&z=15&ie=UTF8&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                         </div>
                         <div className="p-8">
                             <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                Waghodia Road Branch
                             </h3>
                             <div className="space-y-4 text-gray-600">
                                <p className="flex items-start gap-3">
                                    <FiMapPin className="mt-1 text-blue-600 shrink-0" />
                                    <span>3rd floor, Sharnam complex I/F of Savita hospital, Pariwar Cross road, Waghodia Road, Vadodara - 390025</span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <FiPhone className="text-blue-600 shrink-0" />
                                    <span>+91 9624225939</span>
                                </p>
                             </div>
                         </div>
                     </motion.div>

                     {/* Harni Branch */}
                     <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
                     >
                         <div className="h-64 bg-gray-100 relative">
                            <iframe
                                title="Harni Branch"
                                src="https://maps.google.com/maps?q=Samarth%20Institute%20Harni%20Vadodara&t=&z=15&ie=UTF8&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                         </div>
                         <div className="p-8">
                             <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                Harni Branch
                             </h3>
                             <div className="space-y-4 text-gray-600">
                                <p className="flex items-start gap-3">
                                    <FiMapPin className="mt-1 text-blue-600 shrink-0" />
                                    <span>42, 4th floor siddheshwar Paradise, Near Gada circle, Harni- Sama link road, Harni, Vadodara - 390022</span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <FiPhone className="text-blue-600 shrink-0" />
                                    <span>+91 9624225737</span>
                                </p>
                             </div>
                         </div>
                     </motion.div>
                 </div>
             </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
