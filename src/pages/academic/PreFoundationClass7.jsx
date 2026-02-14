import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle } from 'react-icons/fi';

const PreFoundationClass7 = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pre Foundation - Class 7</h1>
            <p className="text-xl text-blue-100">Strengthening Conceptual Understanding</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Class 7 Pre Foundation program builds upon the fundamentals established in Class 6, introducing 
              more complex concepts in Mathematics and Science. This crucial year strengthens analytical abilities 
              and prepares students for advanced competitive examinations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Students are exposed to challenging problems and competitive exam patterns, developing the skills 
              needed for excellence in NTSE, Olympiads, and future preparation for IIT-JEE and NEET.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Program Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiBookOpen className="w-8 h-8" />,
                title: "Advanced Curriculum",
                description: "Deeper dive into Mathematics and Science with focus on problem-solving and analytical thinking."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Experienced Mentors",
                description: "Dedicated faculty who guide students through complex concepts with clarity and patience."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Competitive Edge",
                description: "Intensive training for Math and Science Olympiads, NTSE Stage 1 preparation."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Continuous Evaluation",
                description: "Regular chapter-wise tests and cumulative assessments to ensure comprehensive understanding."
              },
              {
                icon: <FiAward className="w-8 h-8" />,
                title: "Practical Approach",
                description: "Laboratory sessions, experiments, and real-world applications of theoretical concepts."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Complete Support",
                description: "Study material, practice papers, doubt-clearing sessions, and personalized attention."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Covered */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Subjects Covered</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mathematics</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Integers and Rational Numbers</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Algebraic Expressions and Equations</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Geometry - Lines, Angles, and Triangles</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Ratio, Proportion, and Percentages</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Perimeter, Area, and Volume</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Science</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Physics - Heat, Light, and Sound</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Chemistry - Acids, Bases, and Salts</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Biology - Nutrition and Transportation</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Weather, Climate, and Natural Resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Experimental Skills and Observations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Excel in Class 7 with Expert Guidance</h2>
          <p className="text-xl text-blue-100 mb-8">Join our Pre Foundation program and build a strong academic base!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PreFoundationClass7;
