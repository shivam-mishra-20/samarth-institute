import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle, FiTrendingUp, FiZap } from 'react-icons/fi';

const AfterBoardsArjuna = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Arjuna - Re JEE Batch</h1>
            <p className="text-xl text-blue-100">Your Path to IIT Starts Here - Aim, Focus, Achieve</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Arjuna Re JEE Batch is an intensive one-year program for students determined to crack JEE Main and 
              Advanced. Named after the legendary archer Arjuna, this program emphasizes precision, focus, and mastery 
              - the qualities needed to hit the IIT bullseye.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our scientifically designed curriculum addresses every aspect of JEE preparation - from fundamentals to 
              advanced problem-solving, from conceptual clarity to exam temperament. With our proven methodology 
              and expert guidance, students achieve remarkable improvements in their JEE scores.
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
                title: "Complete JEE Coverage",
                description: "Full syllabus of JEE Main and Advanced with Physics, Chemistry, and Mathematics."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "IIT Alumni Faculty",
                description: "Learn from IITians who have cracked JEE themselves and understand the exam inside-out."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Gap Analysis",
                description: "Scientific analysis of previous attempts to identify weaknesses and create improvement plans."
              },
              {
                icon: <FiClock className="w-8 h-8" />,
                title: "Intensive Schedule",
                description: "7-8 hours of focused study daily with theory, problem-solving, and doubt-clearing sessions."
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: "Test Series",
                description: "50+ JEE Main and 20+ JEE Advanced level tests with detailed solutions and rank analysis."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Complete Material",
                description: "Theory modules, DPPs, previous 20 years' JEE papers with solutions, and formula sheets."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Subject-wise Mastery Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Physics</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Mechanics and Rotation</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Thermodynamics and Kinetic Theory</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Electrodynamics and SHM</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Optics and Modern Physics</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Numerical Techniques and Shortcuts</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chemistry</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Physical Chemistry Mastery</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Inorganic Chemistry - Reactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Organic Chemistry - GOC to Named Reactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Periodic Properties and Chemical Bonding</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Memory Techniques for Inorganic</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mathematics</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Calculus - Differential and Integral</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Algebra - Complex Numbers to Matrices</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Coordinate Geometry - 2D and 3D</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Trigonometry and Vector Algebra</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Advanced Problem-Solving Strategies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Arjuna Batch Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <FiZap className="text-blue-600 w-6 h-6" />
                <h4 className="text-xl font-bold text-gray-900">Mistakes Analysis</h4>
              </div>
              <p className="text-gray-600">Deep dive into previous year mistakes to ensure they never repeat in the exam.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Rank Predictor</h4>
              <p className="text-gray-600">After every test, get your predicted JEE Main and Advanced ranks.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Exam Strategy</h4>
              <p className="text-gray-600">Learn which questions to attempt, time management, and mark maximization techniques.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3">✓ Peer Competition</h4>
              <p className="text-gray-600">Healthy competition with equally motivated students drives everyone to perform better.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Your IIT Dream Deserves Another Shot</h2>
          <p className="text-xl text-blue-100 mb-8">Join Arjuna Batch and crack JEE with flying colors!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Enroll Today - Limited Seats
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AfterBoardsArjuna;
