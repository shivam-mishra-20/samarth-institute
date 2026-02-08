import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';

const CoursesCarousel = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) > (courses.length - cardsToShow) ? 0 : prevIndex + 1
    );
  }, [courses.length, cardsToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, courses.length - cardsToShow) : prevIndex - 1
    );
  }, [courses.length, cardsToShow]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="hidden md:block absolute top-1/2 md:-left-12 -translate-y-1/2 z-10">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-white shadow-lg text-samarth-blue-900 hover:text-samarth-blue-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
          aria-label="Previous courses"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>
      
      <div className="hidden md:block absolute top-1/2 md:-right-12 -translate-y-1/2 z-10">
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-white shadow-lg text-samarth-blue-900 hover:text-samarth-blue-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
          aria-label="Next courses"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Carousel Track */}
      <div className="overflow-hidden py-4 -mx-4 px-4 h-full">
         <motion.div 
            className="flex select-none cursor-grab active:cursor-grabbing"
            animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
         >
            {courses.map((course) => (
               <div 
                  key={course.id} 
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / cardsToShow}%` }}
               >
                  <CourseCard course={course} />
               </div>
            ))}
         </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: Math.ceil(courses.length - cardsToShow + 1) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-6 bg-samarth-blue-700' 
                : 'w-2 bg-gray-300 hover:bg-samarth-blue-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesCarousel;
