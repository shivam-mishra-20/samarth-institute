import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { faculties } from '../marketing/data/seed';
import { motion } from 'framer-motion';
import { FiBookOpen, FiAward, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Faculty = () => {
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
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
          <div className="container-custom relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                Meet Our Experts
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Faculty</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Learn from experienced educators who are passionate about helping you succeed in your academic journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-8 bg-white border-b border-gray-100 relative -mt-10 z-10">
          <div className="container-custom">
            <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{faculties.length}+</p>
                <p className="text-sm text-gray-500">Expert Educators</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">50+</p>
                <p className="text-sm text-gray-500">Years Combined Exp.</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">100%</p>
                <p className="text-sm text-gray-500">Dedicated Support</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">5+</p>
                <p className="text-sm text-gray-500">Subject Specializations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Faculty Grid */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {faculties.map((faculty) => (
                <motion.div
                  key={faculty.id}
                  variants={fadeInUp}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&size=300&background=6366f1&color=fff&bold=true`;
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="flex gap-3">
                        {faculty.socials?.linkedin && (
                          <a href={faculty.socials.linkedin} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-indigo-600 transition-colors">
                            <FiLinkedin size={18} />
                          </a>
                        )}
                        {faculty.socials?.twitter && (
                          <a href={faculty.socials.twitter} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-indigo-600 transition-colors">
                            <FiTwitter size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{faculty.name}</h3>
                        <p className="text-indigo-600 font-medium text-sm">{faculty.role}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                        <FiBookOpen size={12} /> {faculty.specialty}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                        <FiAward size={12} /> {faculty.Qualification}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        <span className="font-bold text-gray-800">{faculty.courseCount}</span> Courses
                      </p>
                      <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                        View Profile →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Learning Community</h2>
              <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
                Get personalized attention from our expert educators and excel in your academic goals.
              </p>
              <a href="/register-scholarship" className="inline-block px-10 py-4 bg-white text-indigo-700 font-bold rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Enroll Now
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Faculty;
