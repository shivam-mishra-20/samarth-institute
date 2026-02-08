import React from 'react';
import { FiCheckCircle, FiUsers, FiVideo } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const JoinTeam = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column - Images */}
          <div className="lg:w-1/2 relative">
            <div className="relative w-full max-w-lg mx-auto h-[500px]">
              
              {/* Back Image (Top Right) */}
              <div className="absolute top-0 right-8 w-64 h-80 rounded-[50px] rounded-tr-none overflow-hidden border-4 border-white shadow-lg z-10">
                <img 
                  src="/Bhavna Lohar.jpeg" 
                  alt="Instructor 1" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Front Image (Bottom Left) */}
              <div className="absolute bottom-10 left-4 w-60 h-72 rounded-[50px] rounded-bl-none overflow-hidden border-4 border-white shadow-xl z-20">
                <img 
                  src="/Kiran.jpeg" 
                  alt="Instructor 2" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge - Best Mentors */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute top-20 left-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 z-30"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <FiUsers size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">BEST</p>
                  <p className="text-sm text-gray-500">Mentors</p>
                </div>
              </motion.div>

              {/* Floating Badge - Video Lessons */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-20 right-4 bg-white p-4 pr-8 rounded-full shadow-lg border border-gray-100 flex items-center gap-4 z-30"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <FiVideo size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">VIDEO</p>
                  <p className="text-sm text-gray-500">Lessons</p>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-50 rounded-full opacity-50 blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-1/2">
            <span className="inline-block px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold mb-6">
              Become a Mentor
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Join Our Team — <br />
              Inspire Learners Today!
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Become a part of our passionate educator community and share your expertise with learners worldwide. As an instructor, you'll create engaging courses, guide students, and help shape their personal and professional success.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                "Flexible Teaching Hours",
                "Work Remotely",
                "Access to Global Learners",
                "Competitive Compensation"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FiCheckCircle className="text-purple-600 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Join our team
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JoinTeam;
