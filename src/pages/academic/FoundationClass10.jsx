import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const FoundationClass10 = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Foundation Course - Class 10</h1>
            <p className="text-xl text-blue-100">Your Gateway to Board Excellence & Competitive Success</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Class 10 is the most important milestone in a student's academic journey. Our Foundation Course ensures 
              not only outstanding board exam results but also establishes a rock-solid foundation for JEE, NEET, 
              and other competitive examinations in Classes 11-12.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This comprehensive program covers the entire CBSE/State Board syllabus with depth, includes previous 
              years' board paper analysis, provides NTSE Stage 2 preparation, and introduces students to the world 
              of competitive examinations through specially designed modules.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Program Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiBookOpen className="w-8 h-8" />,
                title: "100% Board Focus",
                description: "Complete syllabus coverage with emphasis on scoring maximum marks in board examinations."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Expert Guidance",
                description: "Learn from board exam specialists who understand marking schemes and examination patterns."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "NTSE Stage 2",
                description: "Advanced training for NTSE Stage 2 qualifiers with specialized coaching for national level."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Board-Pattern Tests",
                description: "Regular full-length tests following exact board exam pattern with detailed answer evaluation."
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Revision Strategy",
                description: "Multiple revision cycles, quick revision modules, and last-minute preparation strategies."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Complete Package",
                description: "NCERT-based study material, previous year papers, sample papers, and marking scheme analysis."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Complete Syllabus Coverage</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mathematics</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Real Numbers and Polynomials</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Quadratic Equations</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Coordinate Geometry</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Triangles and Circles</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Trigonometry and Statistics</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Physics & Chemistry</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Light, Electricity, and Magnetism</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Energy Sources and Conservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Chemical Reactions & Equations</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Acids, Bases, and Salts</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Carbon and Its Compounds</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Biology</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Life Processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Control and Coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Reproduction and Heredity</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Evolution and Classification</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Environment and Ecosystems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Board Topper Strategy</h4>
              <p className="text-gray-600">Proven techniques and answer-writing skills to score 95%+ in boards.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Answer Sheet Evaluation</h4>
              <p className="text-gray-600">Tests evaluated as per exact CBSE marking scheme with detailed feedback.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Pre-Board Preparation</h4>
              <p className="text-gray-600">Multiple pre-board series with school-exam-like environment and evaluation.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Career Counseling</h4>
              <p className="text-gray-600">Guidance for stream selection and competitive exam planning after boards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Achieve Excellence in Class 10 Boards</h2>
          <p className="text-xl text-blue-100 mb-8">Join our Class 10 Foundation batch and score 95%+ marks!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Enroll Now - Limited Seats
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FoundationClass10;
