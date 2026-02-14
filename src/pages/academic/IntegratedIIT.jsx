import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const IntegratedIIT = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Target IIT/NIT</h1>
            <p className="text-xl text-blue-100">2-Year Integrated Program for 11th Maths Group</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our 2-Year Integrated Program for IIT/NIT is designed for Class 11th students who aim to crack JEE Main 
              and JEE Advanced. This program provides simultaneous preparation for 11th-12th Board Examinations and 
              JEE, ensuring students excel in both without compromising either.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Starting from Class 11 gives students the advantage of building concepts from scratch with proper depth. 
              The integrated approach saves time, reduces stress, and ensures comprehensive coverage of both board and 
              competitive exam syllabi. By the end of 12th class, students are fully prepared to crack JEE and secure 
              admission to top engineering colleges like IITs, NITs, and IIITs.
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
                title: "Board + JEE Together",
                description: "Integrated teaching approach covering both board and JEE syllabus simultaneously."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "IIT Faculty",
                description: "Learn from IIT graduates and JEE experts who understand the exam pattern thoroughly."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Dual Target Strategy",
                description: "Score 90%+ in boards while preparing for JEE Main rank under 10,000 and JEE Advanced qualification."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Optimized Schedule",
                description: "Time-efficient curriculum with no overlap - one teaching covers both board and JEE requirements."
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Regular Testing",
                description: "Weekly chapter tests, monthly JEE-level tests, board-pattern exams, and full-length JEE mocks."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Complete Support",
                description: "Study material for both years, DPPs, doubt sessions, online resources, and personal mentorship."
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

      {/* Year-wise Plan */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">2-Year Learning Roadmap</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Class 11 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Class 11 - Foundation Year</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Physics</h4>
                  <p className="text-gray-600 text-sm">Mechanics, Thermodynamics, Waves, Physical World, Units & Measurements, Motion, Laws of Motion, Work-Energy-Power</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Chemistry</h4>
                  <p className="text-gray-600 text-sm">Physical Chemistry (Mole Concept, Atomic Structure, Chemical Bonding), Organic Chemistry (GOC, Hydrocarbons), Inorganic Chemistry</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Mathematics</h4>
                  <p className="text-gray-600 text-sm">Sets, Relations, Functions, Trigonometry, Complex Numbers, Sequences & Series, Straight Lines, Conic Sections, Calculus Introduction</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Focus:</strong> Building strong conceptual foundation, developing problem-solving approach, board exam preparation
                  </p>
                </div>
              </div>
            </div>

            {/* Class 12 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Class 12 - Mastery & Exam Year</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Physics</h4>
                  <p className="text-gray-600 text-sm">Electrostatics, Current Electricity, Magnetism, EM Induction, AC Circuits, Optics, Modern Physics, Semiconductor Devices</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Chemistry</h4>
                  <p className="text-gray-600 text-sm">Solutions, Electrochemistry, Chemical Kinetics, Surface Chemistry, Organic (Alcohols, Ethers, Aldehydes, Amines), Coordination Compounds</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Mathematics</h4>
                  <p className="text-gray-600 text-sm">Relations & Functions, Inverse Trigonometry, Matrices, Determinants, Calculus (Continuity, Differentiation, Integration, Applications), Vectors, 3D Geometry</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Focus:</strong> JEE Advanced level problems, revision of Class 11, mock tests, board exam excellence, time management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Program */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why 2-Year Integrated Approach Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ No Wasted Effort</h4>
              <p className="text-gray-600">Everything taught for boards is useful for JEE and vice versa - efficient use of time.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Proper Depth</h4>
              <p className="text-gray-600">2 years provide sufficient time to master concepts without rushing through any topic.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Revision Cycles</h4>
              <p className="text-gray-600">Multiple revision rounds ensure Class 11 concepts are fresh even during Class 12 boards & JEE.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Reduced Pressure</h4>
              <p className="text-gray-600">Starting early reduces last-minute stress and allows students to learn with understanding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Start Your IIT Journey from Class 11</h2>
          <p className="text-xl text-blue-100 mb-8">Join our 2-Year Integrated Program and achieve your engineering dreams!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Enroll for Class 11 Batch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntegratedIIT;
