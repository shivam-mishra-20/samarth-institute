import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const InfoSection = () => {
  return (
    <section className="bg-white overflow-hidden">
      {/* Logos Strip */}
      <div className="border-b border-gray-100 py-10">
         <div className="container-custom">
            <p className="text-center text-samarth-gray-500 font-semibold mb-8 uppercase tracking-widest text-sm">Trusted by families & students of</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {['CBSE', 'GSEB', 'JEE Main', 'NEET', 'Olympiad'].map((brand, idx) => (
                  <span key={idx} className="text-2xl font-bold text-samarth-blue-900 font-serif">{brand}</span>
               ))}
            </div>
         </div>
      </div>

      {/* Main Info Block */}
      <div className="py-20 container-custom">
         <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
            >
               <h4 className="text-samarth-blue-600 font-bold mb-2 uppercase tracking-wide text-sm">Better Learning. Better Results.</h4>
               <h2 className="text-3xl md:text-4xl font-bold text-samarth-blue-900 mb-6 leading-tight">
                  Educational Institute that fits <br/>
                  <span className="text-samarth-blue-700">everyone's needs</span>
               </h2>
               <p className="text-samarth-gray-600 text-lg mb-6 leading-relaxed">
                  Welcome to <strong>Samarth Classes</strong>. We aim to revolutionize the educational landscape by offering exceptional learning experiences. Our mission is to equip students with the knowledge and skills necessary to excel in academic and professional pursuits.
               </p>
               
               <ul className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                     "Expert Faculties", "Interactive Live Classes", 
                     "Modern Classrooms", "Personal Counseling"
                  ].map((item, i) => (
                     <li key={i} className="flex items-center text-samarth-gray-700 font-medium">
                        <FiCheckCircle className="text-samarth-blue-500 mr-2 shrink-0" /> {item}
                     </li>
                  ))}
               </ul>

               <Link to="/about" className="btn-sweep px-8 py-3.5 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-lg shadow-lg inline-block transition-transform hover:-translate-y-1">
                  Explore More About Us
               </Link>
            </motion.div>

            {/* Right Image Collage */}
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="relative"
            >
               {/* Main Image */}
               <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-500">
                  <img 
                     src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800" 
                     alt="Students discussing" 
                     className="w-full h-auto object-cover"
                  />
               </div>

               {/* Secondary Image/Decor */}
               <div className="absolute -bottom-10 -left-10 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 hidden md:block">
                  <img 
                     src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" 
                     alt="Study materials" 
                     className="w-full h-full object-cover"
                  />
               </div>

               {/* Experience Badge */}
               <div className="absolute -top-4 -right-2 md:-top-6 md:-right-6 md:right-10 z-30 bg-samarth-blue-600 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-2 md:border-4 border-white text-center animate-bounce-slow">
                  <span className="block text-2xl md:text-4xl font-bold">10+</span>
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-samarth-blue-100">Years of<br/>Excellence</span>
               </div>
               
               {/* Background Decor */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-samarth-blue-50/50 rounded-full blur-3xl -z-10"></div>
            </motion.div>

         </div>
      </div>
    </section>
  );
};

export default InfoSection;
