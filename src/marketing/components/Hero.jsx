/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { scholarshipDetails } from '../data/seed';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-[600px] mt-18 flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1920" 
                alt="Students learning" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Scholarship Banner (Floating at top) */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-samarth-red-600/90 backdrop-blur-sm text-white text-center py-2 px-4">
             <p className="text-sm font-medium animate-pulse">
               🎓 {scholarshipDetails.title} | {scholarshipDetails.dates} | <Link to="/register" className="underline font-bold hover:text-samarth-blue-100">{scholarshipDetails.cta}</Link>
             </p>
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-10 text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight px-2">
                    Learn Skills From Our <br className="hidden md:block" />
                    <span className="text-samarth-blue-300 block md:inline mt-2 md:mt-0">Top Instructors</span>
                </h1>
                <p className="text-base md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                    Samarth Classes is a leading educational center dedicated to fostering academic excellence. Equipping students from Class 6th to 12th for Board exams, JEE, NEET, and Olympiads.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                     <Link to="/courses" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-samarth-blue-600 hover:bg-samarth-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center btn-sweep text-sm md:text-base">
                        Explore Courses <FiArrowRight className="ml-2" />
                     </Link>
                     <Link to="/about" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all flex items-center justify-center text-sm md:text-base">
                        About Institute
                     </Link>
                </div>
            </motion.div>
        </div>

        {/* Carousel Indicators (Visual Only) */}
        {/* <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-colors cursor-pointer"></div>
        </div> */}
    </section>
  );
};

export default Hero;
