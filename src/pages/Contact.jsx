import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiMessageSquare, FiUser } from 'react-icons/fi';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



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
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-500">Fill out the form and we'll get back to you soon.</p>
                </div>

                <form className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiUser /></span>
                      <input
                        type="text"
                        id="name"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="e.g., Rahul Sharma"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiMail /></span>
                        <input
                          type="email"
                          id="email"
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FiPhone /></span>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course Interest */}
                  <div>
                    <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">Interested In</label>
                    <select
                      id="course"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-700"
                    >
                      <option value="">Select a course or query type</option>
                      <option value="foundation">Foundation Courses (Class 6-10)</option>
                      <option value="boards">Board Exam Prep (Class 11-12)</option>
                      <option value="jee">JEE Main & Advanced</option>
                      <option value="neet">NEET Preparation</option>
                      <option value="other">Other Enquiry</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                    <div className="relative">
                      <span className="absolute top-4 left-0 pl-4 flex items-start text-gray-400"><FiMessageSquare /></span>
                      <textarea
                        id="message"
                        rows="4"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="Tell us about your query..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
                  >
                    <span>Send Message</span>
                    <FiSend className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
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
