import React, { useState } from "react";
import {
  FiCheckCircle,
  FiUsers,
  FiVideo,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../data/seed";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column - Images */}
          <div className="lg:w-1/2 relative mt-8 lg:mt-0 order-2 lg:order-1">
            <div className="relative w-full max-w-lg mx-auto h-[400px] lg:h-[500px]">
              {/* Back Image (Top Right) */}
              <div className="absolute top-0 right-4 lg:right-8 w-48 h-60 lg:w-64 lg:h-80 rounded-[30px] lg:rounded-[50px] rounded-tr-none overflow-hidden border-4 border-white shadow-lg z-10">
                <img
                  src="testimonial_1.jpeg"
                  alt="Student Success"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Front Image (Bottom Left) */}
              <div className="absolute bottom-4 lg:bottom-10 left-4 w-44 h-56 lg:w-60 lg:h-72 rounded-[30px] lg:rounded-[50px] rounded-bl-none overflow-hidden border-4 border-white shadow-xl z-20">
                <img
                  src="testimonial_2.jpeg"
                  alt="Student Learning"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge - Best Results */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute top-10 left-0 lg:top-20 lg:left-4 bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 lg:gap-4 z-30"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <FiStar
                    size={20}
                    className="lg:w-6 lg:h-6"
                    fill="currentColor"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm lg:text-base">
                    4.9/5
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">Rating</p>
                </div>
              </motion.div>

              {/* Floating Badge - Video Lessons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-16 -right-2 lg:bottom-20 lg:right-4 bg-white p-3 pr-6 lg:p-4 lg:pr-8 rounded-full shadow-lg border border-gray-100 flex items-center gap-3 lg:gap-4 z-30"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <FiUsers size={20} className="lg:w-6 lg:h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm lg:text-base">
                    100+
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">Students</p>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full opacity-50 blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-1/2">
            <span className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold mb-6">
              Reviews & Testimonials
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We are proud to have received a stellar rating of 4.9 out of 5
              from 129 reviews on Google! These reviews are a testament to the
              quality education and exceptional services we provide at Samarth
              Institute.
            </p>

            {/* Testimonial Carousel */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Rating Stars */}
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          fill={
                            i < (testimonials[currentIndex].rating || 5)
                              ? "currentColor"
                              : "none"
                          }
                          className={`w-5 h-5 ${i < (testimonials[currentIndex].rating || 5) ? "" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {testimonials[currentIndex].date}
                    </span>
                  </div>

                  <p className="text-xl font-medium text-gray-800 italic mb-6">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 text-white flex items-center justify-center font-bold text-xl uppercase">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-sm text-blue-600 font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                "Personalized Mentorship",
                "Proven Track Record",
                "Conceptual Clarity",
                "Regular Assessments",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FiCheckCircle
                    className="text-blue-600 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
