import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";

const FounderMessage = () => {
  return (
    <div className="min-h-screen bg-samarth-bg font-sans text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-samarth-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
              Founder's Message
            </h1>
            <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto">
              A word from our leadership about our vision and commitment to
              excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder's Message Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            className="bg-blue-50 rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100 flex flex-col md:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="md:w-1/3 text-center">
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
                  alt="Director"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Leading The Way
              </h3>
              <p className="text-blue-600 font-medium">Head of Institute</p>
            </div>
            <div className="md:w-2/3 relative">
              <FiAward className="text-blue-100 w-32 h-32 absolute -top-10 -left-10 -z-10 opacity-50" />
              <h2 className="text-2xl font-bold text-samarth-blue-900 mb-6">
                A Message from Leadership
              </h2>
              <blockquote className="text-xl text-gray-600 italic leading-relaxed mb-6">
                "At Samarth Institute, we don't just teach subjects; we build
                careers and character. Our goal is to ensure that every student
                who walks through our doors leaves with the confidence to
                conquer any challenge. We are committed to providing a learning
                environment that is both rigorous and supportive."
              </blockquote>
              <img
                src="/logo 2.jpg"
                alt="Samarth Logo"
                className="h-12 opacity-80"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FounderMessage;
