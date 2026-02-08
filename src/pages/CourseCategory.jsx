import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { coursesData, categoryMeta } from '../data/coursesData';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiArrowRight, FiUsers, FiAward, FiCheckCircle } from 'react-icons/fi';

const CourseCategory = () => {
  const { categorySlug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  const meta = categoryMeta[categorySlug];

  if (!meta) {
    return (
      <div className="min-h-screen flex flex-col bg-samarth-bg">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Category Not Found</h1>
            <Link to="/courses" className="text-blue-600 hover:underline">Go to All Courses</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter courses by the category's filterKey
  const filteredCourses = coursesData.filter(course => course.category === meta.filterKey);

  return (
    <div className="min-h-screen flex flex-col bg-samarth-bg font-sans text-gray-800">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden text-white">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img src={meta.heroImage} alt={meta.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/70"></div>
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 text-sm font-medium backdrop-blur-md border border-white/10">
                <FiAward className="text-yellow-400" /> Samarth Programs
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{meta.title}</h1>
              <p className="text-xl md:text-2xl text-blue-100 font-light mb-6">{meta.subtitle}</p>
              <p className="text-lg text-blue-200 leading-relaxed max-w-2xl">
                {meta.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-white border-b border-gray-100 py-6">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div><span className="text-3xl font-bold text-samarth-blue-700">{filteredCourses.length}</span><p className="text-gray-500 text-sm">Courses Available</p></div>
              <div><span className="text-3xl font-bold text-samarth-blue-700">25+</span><p className="text-gray-500 text-sm">Expert Faculty</p></div>
              <div><span className="text-3xl font-bold text-samarth-blue-700">10K+</span><p className="text-gray-500 text-sm">Successful Students</p></div>
              <div><span className="text-3xl font-bold text-samarth-blue-700">97%</span><p className="text-gray-500 text-sm">Selection Rate</p></div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our {meta.title}</h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">Explore our structured programs designed for maximum success.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col group"
                >
                  {/* Card Header */}
                  <div className={`p-6 bg-blue-600 text-white`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-bold rounded-full uppercase">{course.grade}</span>
                      <span className="flex items-center gap-1 text-sm text-blue-100"><FiClock /> {course.duration}</span>
                    </div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-1">{course.description}</p>

                    {/* Subjects */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><FiBook /> Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {course.subjects.map(sub => (
                          <span key={sub} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">{sub}</span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><FiUsers /> Highlights</p>
                      <ul className="space-y-1">
                        {course.features.slice(0, 3).map(feat => (
                          <li key={feat} className="text-sm text-gray-600 flex items-center gap-2">
                            <FiCheckCircle className="text-green-500 flex-shrink-0" /> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link 
                      to={`/courses/${course.slug}`} 
                      className="mt-auto block text-center w-full py-3 rounded-xl bg-samarth-blue-700 text-white font-semibold hover:bg-blue-800 transition-all group-hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      View Details <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-samarth-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
          <div className="container-custom relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-200 max-w-xl mx-auto mb-8">
              Enroll today and take the first step towards academic excellence.
            </p>
            <Link to="/contact" className="inline-block px-10 py-4 bg-yellow-400 text-blue-900 font-bold rounded-full hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl">
              Get in Touch
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseCategory;
