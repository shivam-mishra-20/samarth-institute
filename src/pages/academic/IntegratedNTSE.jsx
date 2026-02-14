import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiTarget, FiCheckCircle, FiCalendar, FiLayers } from 'react-icons/fi';

const IntegratedNTSE = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Target NTSE/Olympiad/Foundation</h1>
            <p className="text-xl text-blue-100">5-Year Integrated Program (Class 6 to 10)</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our 5-Year Integrated Program is a comprehensive long-term strategy designed for students from Class 6 
              to Class 10. This program simultaneously prepares students for Board Examinations, NTSE, and various 
              Olympiads (Math, Science, Cyber) while building a rock-solid foundation for IIT-JEE and NEET.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Starting early gives students the advantage of time - they develop deep conceptual understanding, 
              master problem-solving techniques gradually, and stay ahead of their peers consistently. By Class 10, 
              students are fully prepared for both board exams and national-level competitive examinations.
            </p>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose 5-Year Integrated Program?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiCalendar className="w-8 h-8" />,
                title: "Time Advantage",
                description: "5 years of systematic preparation ensures no concept is rushed and every topic is mastered."
              },
              {
                icon: <FiLayers className="w-8 h-8" />,
                title: "Progressive Learning",
                description: "Difficulty level increases gradually, building confidence at each stage without overwhelming students."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Multiple Targets",
                description: "Prepare for Boards, NTSE, Olympiads, and build foundation for JEE/NEET simultaneously."
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: "Consistent Mentorship",
                description: "Same faculty throughout 5 years ensures deep understanding of each student's strengths and weaknesses."
              },
              {
                icon: <FiAward className="w-8 h-8" />,
                title: "Early Success",
                description: "Students start winning Olympiad medals and scholarships from Class 6 onwards."
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Stress-Free Learning",
                description: "No last-minute rush - concepts are learned thoroughly with sufficient time for revision."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Year-wise Learning Journey</h2>
          <div className="space-y-6">
            {[
              {
                year: "Class 6",
                focus: "Foundation Building",
                details: "Introduction to advanced Math and Science concepts. Basic problem-solving. Foundation for Olympiads."
              },
              {
                year: "Class 7",
                focus: "Skill Development",
                details: "Analytical thinking. Math and Science Olympiad Level 1. NTSE Stage 1 introduction."
              },
              {
                year: "Class 8",
                focus: "Competitive Temperament",
                details: "Advanced problems. Olympiad Level 2 preparation. NTSE Stage 1 intensive training."
              },
              {
                year: "Class 9",
                focus: "Board + Competitive",
                details: "Complete Board syllabus. NTSE Stage 1 & 2 preparation. Introduction to JEE/NEET pattern."
              },
              {
                year: "Class 10",
                focus: "Excellence & Foundation",
                details: "95%+ Board target. NTSE Stage 2 mastery. Strong foundation for 11th-12th JEE/NEET."
              }
            ].map((phase, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="shrink-0">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">{idx + 6}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{phase.year} - {phase.focus}</h3>
                    <p className="text-gray-700">{phase.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiBookOpen className="text-blue-600" />
                Complete Study Material
              </h4>
              <p className="text-gray-600">Year-wise modules, practice worksheets, Olympiad level problems, NTSE preparation material.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Regular Assessments
              </h4>
              <p className="text-gray-600">Weekly tests, monthly evaluations, Olympiad mock tests, NTSE mock tests throughout the year.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiTarget className="text-blue-600" />
                Olympiad Training
              </h4>
              <p className="text-gray-600">Special coaching for IMO, NSO, NSTSE, NMMS, and other prestigious Olympiad examinations.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiUsers className="text-blue-600" />
                Parent Engagement
              </h4>
              <p className="text-gray-600">Regular parent-teacher meetings, progress reports, and guidance sessions for parents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Invest in Your Child's Future Today</h2>
          <p className="text-xl text-blue-100 mb-8">Give your child the advantage of early preparation and long-term success!</p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Enroll in 5-Year Program
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntegratedNTSE;
