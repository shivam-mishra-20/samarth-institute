import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle, FiCalendar, FiHeart } from 'react-icons/fi';

const IntegratedNEET = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Target NEET</h1>
            <p className="text-xl text-blue-100">2-Year Integrated Program for 11th Biology Group</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our 2-Year Integrated NEET Program is specifically designed for Class 11th Biology students aspiring to 
              become doctors. This comprehensive program ensures excellence in both Board Examinations and NEET, 
              preparing students for admission to top medical colleges including AIIMS, JIPMER, and government medical colleges.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The integrated approach allows students to master NCERT thoroughly (the foundation of NEET) while also 
              preparing for competitive level questions. With 2 years of focused preparation, students develop strong 
              concepts in Biology, Physics, and Chemistry, along with exam temperament and time management skills 
              essential for NEET success.
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
                title: "NCERT-Focused",
                description: "Deep analysis of NCERT with line-by-line coverage - 90% of NEET questions come from NCERT."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Medical Expert Faculty",
                description: "Learn from MBBS graduates and NEET toppers who understand medical entrance exams thoroughly."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Board + NEET Together",
                description: "Score 95%+ in boards while targeting NEET rank under 1000 for admission to top medical colleges."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Efficient Learning",
                description: "Integrated syllabus eliminates redundancy - learn once, succeed in both board and NEET."
              },
              {
                icon: <FiHeart className="w-8 h-8" />,
                title: "Biology Excellence",
                description: "Special emphasis on Biology (50% of NEET) with diagram practice, memory techniques, and quick revision."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Complete Package",
                description: "NCERT textbooks, competitive books, DPPs, test series, revision modules, and medical counseling guidance."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">2-Year NEET Preparation Journey</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Class 11 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Class 11 - Foundation Year</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Biology (360 marks in NEET)</h4>
                  <p className="text-gray-600 text-sm">Botany: Cell Biology, Plant Physiology, Morphology, Anatomy, Classification
                  <br/>Zoology: Animal Kingdom, Structural Organization, Biomolecules, Digestion, Breathing, Circulation</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Physics (180 marks)</h4>
                  <p className="text-gray-600 text-sm">Physical World, Units, Motion, Laws of Motion, Work-Energy, Gravitation, Thermodynamics, Kinetic Theory, Oscillations, Waves</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Chemistry (180 marks)</h4>
                  <p className="text-gray-600 text-sm">Basic Concepts, Atomic Structure, Chemical Bonding, States of Matter, Thermodynamics, Equilibrium, Redox, Organic Chemistry Basics</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Focus:</strong> NCERT thorough reading (3 times), concept building, board preparation, NEET pattern introduction
                  </p>
                </div>
              </div>
            </div>

            {/* Class 12 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Class 12 - Mastery & Exam Year</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Biology (360 marks in NEET)</h4>
                  <p className="text-gray-600 text-sm">Botany: Reproduction, Genetics, Evolution, Biotechnology, Ecology
                  <br/>Zoology: Reproduction, Genetics, Evolution, Human Health, Biotechnology, Ecology</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Physics (180 marks)</h4>
                  <p className="text-gray-600 text-sm">Electrostatics, Current, Magnetism, EM Induction, AC, EM Waves, Optics, Dual Nature, Atoms, Nuclei, Semiconductors, Communication</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Chemistry (180 marks)</h4>
                  <p className="text-gray-600 text-sm">Solutions, Electrochemistry, Chemical Kinetics, Surface Chemistry, General Principles, p-d-f block, Coordination, Organic Chemistry (Complete)</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Focus:</strong> Previous year NEET analysis, full-length mocks, revision of Class 11, board excellence, NEET counseling guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEET Strategy */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Proven NEET Success Strategy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Biology First Approach</h4>
              <p className="text-gray-600">Maximum focus on Biology (50% weightage) ensuring students score 350+/360 in Biology.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ NCERT Mastery</h4>
              <p className="text-gray-600">Every line of NCERT covered multiple times - diagrams, tables, examples, exercises, all inclusive.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Previous 10 Years</h4>
              <p className="text-gray-600">Thorough analysis and practice of NEET questions from last 10 years - pattern understanding.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Mock Tests</h4>
              <p className="text-gray-600">50+ full-length NEET mocks in actual exam pattern with OMR sheet practice.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Accuracy over Speed</h4>
              <p className="text-gray-600">Training to solve 170-175 questions correctly in 3 hours rather than attempting all 200.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Counseling Guidance</h4>
              <p className="text-gray-600">Post-NEET support for college selection, counseling process, and admission procedures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Begin Your Medical Career from Class 11</h2>
          <p className="text-xl text-blue-100 mb-8">Join our 2-Year NEET Program and fulfill your dream of becoming a doctor!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Enroll for Class 11 NEET Batch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntegratedNEET;
