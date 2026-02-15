/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
} from "react-icons/fi";
import { scholarshipDetails } from "../data/seed";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  // Carousel slides - Add more banner images here
  const slides = [
    {
      id: 1,
      image: "Banner.JPG.jpeg",
      alt: "Samarth Institute Banner 1",
    },
    {
      id: 2,
      image: "logo_2.jpg",
      alt: "Samarth Institute Banner 2",
    },
    // Add more slides here as needed
    // {
    //   id: 2,
    //   image: "Banner2.jpg",
    //   alt: "Samarth Institute Banner 2"
    // },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  return (
    <section className="relative w-full mt-16 md:mt-20 overflow-hidden">
      {/* Scholarship Banner (Floating at top) */}
      <div className="relative z-30 bg-samarth-red-600/95 backdrop-blur-sm text-white text-center py-2 px-4">
        <p className="text-xs sm:text-sm font-medium animate-pulse">
          🎓 {scholarshipDetails.title} | {scholarshipDetails.dates}{" "}
          <Link
            to="/register-scholarship"
            className="font-bold hover:text-samarth-blue-100"
          >
            {scholarshipDetails.cta}
          </Link>
        </p>
      </div>

      {/* Banner Carousel Section */}
      <div className="relative w-full group">
        {/* Carousel Images */}
        <div className="relative w-full h-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full h-auto"
            >
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                className="w-full h-auto object-contain max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"></div>

        {/* Navigation Buttons - Show only if more than 1 slide */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white w-6 sm:w-8"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons Below Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="py-6 sm:py-8 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-samarth-blue-600 bg-samarth-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center justify-center btn-sweep text-sm sm:text-base"
            >
              Explore Courses <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center justify-center text-sm sm:text-base"
            >
              Contact Us
            </Link>
            <Link
              to="/register-scholarship"
              className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiAward className="w-4 h-4 sm:w-5 sm:h-5" />
              Register For Scholarship (Limited Seats)
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
