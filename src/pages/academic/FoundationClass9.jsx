import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const FoundationClass9 = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Foundation Course - Class 9</h1>
            <p className="text-xl text-blue-100">Your Journey to Board & Competitive Excellence Begins Here</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Class 9 is the most crucial year in a student's academic career. Our Foundation Course provides 
              comprehensive preparation for board examinations while simultaneously building a strong base for 
              JEE, NEET, and other competitive examinations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This integrated program covers the complete Class 9 syllabus in-depth, introduces competitive exam 
              patterns, and includes intensive NTSE Stage 1 preparation. Students develop advanced problem-solving 
              skills and learn time management techniques essential for success.
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
                title: "Dual Preparation",
                description: "Simultaneous focus on Class 9 Board syllabus and foundation for IIT-JEE/NEET competitive exams."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "IIT/NEET Faculty",
                description: "Learn from experienced teachers who are experts in both board and competitive exam coaching."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "NTSE Preparation",
                description: "Comprehensive training for NTSE Stage 1 with dedicated SAT and MAT practice sessions."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Regular Assessment",
                description: "Weekly chapter tests, monthly cumulative tests, and board-pattern examinations."
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Performance Tracking",
                description: "Detailed analysis of test performance with personalized feedback and improvement strategies."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Complete Support",
                description: "Study material, DPPs (Daily Practice Problems), online doubt-clearing, and parent meetings."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Comprehensive Syllabus Coverage</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mathematics</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Number Systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Algebra and Polynomials</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Coordinate Geometry</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Geometry and Triangles</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Mensuration and Statistics</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Physics & Chemistry</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Motion, Force, and Work</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Gravitation and Sound</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Atomic Structure and Matter</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Chemical Reactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Practical Applications</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Biology</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Cell - The Fundamental Unit</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Tissues and Body Systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Living Organisms Diversity</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Natural Resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Health and Diseases</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Our Foundation Course?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Board + Competitive Together</h4>
              <p className="text-gray-600">No need for separate coaching. We prepare you for both simultaneously.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Small Batch Size</h4>
              <p className="text-gray-600">Limited students per batch ensuring personalized attention to every student.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Conceptual Learning</h4>
              <p className="text-gray-600">Focus on understanding concepts rather than rote memorization.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Proven Results</h4>
              <p className="text-gray-600">Track record of producing board toppers, NTSE scholars, and IIT-JEE/NEET qualifiers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Start Your Success Story with Class 9 Foundation</h2>
          <p className="text-xl text-blue-100 mb-8">Limited seats available. Enroll now for the upcoming batch!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Apply for Admission
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FoundationClass9;
