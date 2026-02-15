import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle } from 'react-icons/fi';

const PreFoundationClass6 = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pre Foundation - Class 6</h1>
            <p className="text-xl text-blue-100">Building Strong Fundamentals from the Start</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our Class 6 Pre Foundation program is designed to introduce young students to advanced concepts in 
              Mathematics and Science. This program lays the groundwork for competitive examinations like NTSE, 
              Olympiads, and future JEE/NEET preparation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Students develop analytical thinking, problem-solving skills, and a deep understanding of fundamental 
              concepts that will serve as the foundation for their academic journey.
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
                title: "Comprehensive Curriculum",
                description: "Age-appropriate syllabus covering Mathematics, Science, and Logical Reasoning with emphasis on conceptual clarity."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Expert Faculty",
                description: "Experienced teachers who understand young minds and make learning engaging and enjoyable."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Olympiad Preparation",
                description: "Special focus on Math and Science Olympiads to develop competitive exam temperament early."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Regular Assessments",
                description: "Weekly tests and monthly evaluations to track progress and identify areas for improvement."
              },
              {
                icon: <FiAward className="w-8 h-8" />,
                title: "Interactive Learning",
                description: "Hands-on activities, practical sessions, and interactive teaching methods to enhance understanding."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Study Material",
                description: "Comprehensive notes, practice worksheets, and question banks designed specifically for Class 6."
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
                  <span>Number Systems and Operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Geometry - Basic Shapes and Angles</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Algebra Introduction</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Fractions, Decimals and Percentages</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Mensuration Basics</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Science</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Physics - Motion, Force, and Energy</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Chemistry - Properties of Materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Biology - Living Organisms</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Environmental Science</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Practical Experiments and Activities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">Enroll in our Class 6 Pre Foundation program today!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Contact Us for Admission
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PreFoundationClass6;
