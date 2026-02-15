import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle, FiTrendingUp, FiHeart } from 'react-icons/fi';

const AfterBoardsEklavy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Eklavy - Re NEET Batch</h1>
            <p className="text-xl text-blue-100">Your Second Chance to Achieve Your Medical Dream</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Eklavy Re NEET Batch is a specialized one-year intensive program designed for students who want 
              to improve their NEET score and secure admission to top medical colleges. Named after the legendary 
              student Eklavya, this program embodies dedication, focus, and excellence.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our comprehensive approach addresses conceptual gaps, focuses on weak areas, implements advanced 
              problem-solving techniques, and builds the confidence needed to excel in NEET. With expert faculty 
              and proven strategies, we help students achieve significant score improvements.
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
                title: "Complete NEET Syllabus",
                description: "Comprehensive coverage of Physics, Chemistry, and Biology as per latest NEET pattern."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Personal Mentor",
                description: "Dedicated mentor assigned to each student for personalized guidance and support."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Weakness Analysis",
                description: "Detailed analysis of your previous attempt to identify and eliminate weak areas."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Full-Day Classes",
                description: "Intensive 6-hour daily sessions with a perfect balance of theory and practice."
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Mock Test Series",
                description: "40+ full-length NEET mock tests with detailed performance analysis and improvement strategies."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Study Material",
                description: "Comprehensive notes, NCERT-based study material, and 10,000+ practice questions."
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

      {/* Subject Focus */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Subject-wise Preparation Strategy</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Physics (180 Marks)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Mechanics and Thermodynamics</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Electricity and Magnetism</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Modern Physics and Optics</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Numerical Problem Solving</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chemistry (180 Marks)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Physical and Inorganic Chemistry</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Organic Chemistry Concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Chemical Reactions and Mechanisms</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>NCERT Deep Analysis</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Biology (360 Marks)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Botany - Complete Coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Zoology - In-depth Study</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Human Physiology and Genetics</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Diagram Practice and Memory Techniques</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Strategy */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Success Strategy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <FiHeart className="text-blue-600 w-6 h-6" />
                <h4 className="text-xl font-bold text-gray-900">Emotional Support</h4>
              </div>
              <p className="text-gray-600">Regular counseling sessions to handle stress, build confidence, and maintain motivation.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Previous Year Analysis</h4>
              <p className="text-gray-600">Detailed review of your last attempt to understand mistakes and avoid repetition.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Time Management</h4>
              <p className="text-gray-600">Special sessions on solving papers within 3 hours with accuracy and speed.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ All India Test Series</h4>
              <p className="text-gray-600">Compete with 50,000+ NEET aspirants and know your exact All India Rank.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Transform Your NEET Dreams into Reality</h2>
          <p className="text-xl text-blue-100 mb-8">Join Eklavy Batch - Where Determination Meets Success!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Apply Now - Start Your Journey
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AfterBoardsEklavy;
