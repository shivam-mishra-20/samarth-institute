import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-samarth-bg relative overflow-hidden">
       {/* Background Decor */}
       <div className="absolute top-0 right-0 w-1/3 h-full bg-samarth-blue-50/50 -skew-x-12 transform origin-top-right z-0"></div>

       <div className="container-custom relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-samarth-blue-900 mb-4">See How Our Students Made Their <br/> <span className="text-samarth-blue-600">#SuccessStories</span></h2>
          </div>

          <div className="max-w-6xl mx-auto">
             <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-samarth-gray-100">
                <div className="grid md:grid-cols-2">
                   
                   {/* Left: Image Side */}
                   <div className="relative h-64 md:h-auto overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={testimonials[currentIndex].id}
                          src={testimonials[currentIndex].avatar} // Using avatar as the main image for this design
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-samarth-blue-900/60 to-transparent flex items-end p-8">
                         <div className="text-white">
                            <h3 className="text-2xl font-bold">{testimonials[currentIndex].name}</h3>
                            <p className="text-samarth-blue-200">{testimonials[currentIndex].role}</p>
                         </div>
                      </div>
                   </div>

                   {/* Right: Content Side */}
                   <div className="p-8 md:p-12 md:py-16 flex flex-col justify-center relative">
                      
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={testimonials[currentIndex].id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4 }}
                          className="relative z-10"
                        >
                           <p className="text-lg md:text-xl text-samarth-gray-700 italic leading-relaxed mb-6">
                              "{testimonials[currentIndex].content}"
                           </p>
                           <p className="font-semibold text-samarth-blue-700">
                              - Class of 2024
                           </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation */}
                      <div className="flex space-x-4 mt-8">
                         <button 
                           onClick={prevSlide}
                           className="p-3 rounded-full bg-samarth-gray-100 hover:bg-samarth-blue-700 hover:text-white transition-all text-samarth-gray-600"
                           aria-label="Previous story"
                         >
                           <FiChevronLeft size={24} />
                         </button>
                         <button 
                           onClick={nextSlide}
                           className="p-3 rounded-full bg-samarth-gray-100 hover:bg-samarth-blue-700 hover:text-white transition-all text-samarth-gray-600"
                           aria-label="Next story"
                         >
                           <FiChevronRight size={24} />
                         </button>
                      </div>
                   </div>

                </div>
             </div>
          </div>
       </div>
    </section>
  );
};
export default TestimonialCarousel;
