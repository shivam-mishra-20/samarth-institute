import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FiBookOpen,
  FiAward,
  FiTarget,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiLayers,
  FiClock,
  FiCalendar,
  FiBook
} from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Academic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSection = searchParams.get('section') || 'pre-foundation';

  const sections = [
    { id: 'pre-foundation', name: 'Pre Foundation (6-8)', icon: <FiBookOpen /> },
    { id: 'foundation', name: 'Foundation (9-10)', icon: <FiLayers /> },
    { id: 'after-boards', name: "After Board's", icon: <FiAward /> },
    { id: 'integrated', name: 'Integrated Program', icon: <FiTarget /> },
  ];

  const handleSectionChange = (sectionId) => {
    setSearchParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-samarth-bg font-sans text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-linear-to-br from-samarth-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        {/* Animated Particles/Circles Background */}
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
                <h2 className="text-xl md:text-2xl font-light text-blue-200 uppercase tracking-widest mb-2">Our Programs</h2>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">Academic Excellence</h1>
                <p className="text-xl md:text-2xl font-serif text-yellow-400 italic mb-4">Building Tomorrow's Leaders</p>
            </motion.div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="container-custom relative z-10 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 inline-flex flex-wrap gap-2 justify-center w-full">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  currentSection === section.id
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {section.icon}
                <span className="hidden md:inline">{section.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section Content */}
      <div className="py-12">
        {currentSection === 'pre-foundation' && <PreFoundationSection />}
        {currentSection === 'foundation' && <FoundationSection />}
        {currentSection === 'after-boards' && <AfterBoardsSection />}
        {currentSection === 'integrated' && <IntegratedSection />}
      </div>

      <Footer />
    </div>
  );
};

// Pre Foundation Section Component (Class 6-8)
const PreFoundationSection = () => (
  <>
    <section className="py-20">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-blue-600 font-bold uppercase tracking-wide">Pre Foundation Course</span>
          <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mt-2 mb-6">Building Strong Fundamentals</h2>
          <p className="text-lg text-gray-600">
            Introducing young minds to the world of science and mathematics with conceptual clarity and strong foundational skills.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { 
              class: "Class 6",
              title: "Beginning the Journey",
              features: ["Basic Science Concepts", "Mathematical Foundations", "Logical Reasoning", "Interactive Learning"],
              color: "from-blue-500 to-blue-600"
            },
            { 
              class: "Class 7",
              title: "Strengthening Skills",
              features: ["Advanced Mathematics", "Physics Introduction", "Chemistry Basics", "Problem Solving"],
              color: "from-indigo-500 to-indigo-600"
            },
            { 
              class: "Class 8",
              title: "Foundation Excellence",
              features: ["Complex Problems", "Competitive Prep Intro", "Analytical Thinking", "NTSE Foundation"],
              color: "from-purple-500 to-purple-600"
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className={`bg-linear-to-br ${item.color} rounded-3xl p-8 text-white shadow-xl hover:-translate-y-2 transition-all duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="bg-white/20 inline-block px-4 py-2 rounded-full mb-4">
                <span className="font-bold">{item.class}</span>
              </div>
              <h3 className="text-2xl font-bold mb-6">{item.title}</h3>
              <ul className="space-y-3">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FiCheckCircle className="mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Program Highlights</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: <FiBookOpen size={24} />, title: "Comprehensive Curriculum", desc: "Age-appropriate syllabus designed to build strong fundamentals in Science and Mathematics." },
              { icon: <FiUsers size={24} />, title: "Expert Faculty", desc: "Experienced teachers who make learning fun and engaging for young students." },
              { icon: <FiTarget size={24} />, title: "Olympiad Preparation", desc: "Introduction to competitive exams like NTSE, Math & Science Olympiads." },
              { icon: <FiTrendingUp size={24} />, title: "Regular Assessments", desc: "Weekly tests and monthly evaluations to track student progress effectively." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex gap-4"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </>
);

// Foundation Section Component (Class 9-10)
const FoundationSection = () => (
  <>
    <section className="py-20">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-blue-600 font-bold uppercase tracking-wide">Foundation Course</span>
          <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mt-2 mb-6">Mastering Board & Competitive Exams</h2>
          <p className="text-lg text-gray-600">
            Comprehensive preparation for Class 9-10 Board exams along with foundation for JEE, NEET, and other competitive exams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            { 
              class: "Class 9",
              title: "Critical Foundation Year",
              features: [
                "Advanced Mathematics (Algebra, Geometry)",
                "Physics & Chemistry Depth Study",
                "Biology for NEET Aspirants",
                "NTSE First Level Preparation",
                "Board Exam Pattern Introduction",
                "Time Management Skills"
              ],
              color: "from-green-500 to-green-600",
              icon: <FiLayers size={32} />
            },
            { 
              class: "Class 10",
              title: "Board Excellence & Beyond",
              features: [
                "Complete Board Syllabus Coverage",
                "Competitive Exam Foundation",
                "Previous Year Papers Practice",
                "NTSE Second Level Training",
                "Advanced Problem Solving",
                "Career Counseling Sessions"
              ],
              color: "from-teal-500 to-teal-600",
              icon: <FiAward size={32} />
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className={`bg-linear-to-br ${item.color} rounded-3xl p-10 text-white shadow-xl hover:-translate-y-2 transition-all duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="bg-white/20 inline-block px-5 py-2 rounded-full">
                  <span className="font-bold text-lg">{item.class}</span>
                </div>
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold mb-6">{item.title}</h3>
              <ul className="space-y-3">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FiCheckCircle className="mt-1 shrink-0" size={20} />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: <FiBook size={28} />, title: "Study Material", desc: "Comprehensive notes, practice problems, and question banks", color: "bg-blue-50 text-blue-600" },
            { icon: <FiClock size={28} />, title: "Flexible Batches", desc: "Morning, afternoon, and weekend batches available", color: "bg-green-50 text-green-600" },
            { icon: <FiTarget size={28} />, title: "Regular Tests", desc: "Weekly assessments and monthly full-length tests", color: "bg-purple-50 text-purple-600" },
            { icon: <FiUsers size={28} />, title: "Small Batches", desc: "Limited students per batch for personalized attention", color: "bg-orange-50 text-orange-600" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

// After Boards Section Component
const AfterBoardsSection = () => (
  <>
    <section className="py-20">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-blue-600 font-bold uppercase tracking-wide">After Board's Program</span>
          <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mt-2 mb-6">Re-attempt with Confidence</h2>
          <p className="text-lg text-gray-600">
            Specialized batches for students who want to improve their JEE/NEET scores with focused preparation and expert guidance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {[
            {
              name: "Arjuna - Re JEE Batch",
              tagline: "Your Second Chance to IIT",
              icon: <FiTarget size={40} />,
              color: "from-orange-500 to-red-600",
              features: [
                "Intensive JEE Main & Advanced Preparation",
                "Previous Year Analysis & Strategy",
                "Conceptual Clarity Sessions",
                "Mock Tests & Performance Analysis",
                "Personal Mentor Assignment",
                "Doubt Clearing Sessions",
                "Study Material & Test Series",
                "Motivational & Counseling Support"
              ],
              duration: "1 Year Intensive Program",
              target: "JEE Main & Advanced"
            },
            {
              name: "Eklavy - Re NEET Batch",
              tagline: "Path to Medical Excellence",
              icon: <FiAward size={40} />,
              color: "from-green-500 to-teal-600",
              features: [
                "Comprehensive NEET Syllabus Coverage",
                "Biology, Physics & Chemistry Focus",
                "Previous Year Pattern Analysis",
                "Regular Tests & Assessments",
                "Medical Career Counseling",
                "Dedicated Faculty Support",
                "Complete Study Package",
                "Revision & Practice Sessions"
              ],
              duration: "1 Year Intensive Program",
              target: "NEET Medical Entrance"
            }
          ].map((batch, idx) => (
            <motion.div
              key={idx}
              className={`bg-linear-to-br ${batch.color} rounded-3xl p-10 text-white shadow-2xl hover:scale-105 transition-all duration-300`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-4 rounded-2xl">
                  {batch.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{batch.name}</h3>
                  <p className="text-white/90 italic">{batch.tagline}</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <FiClock />
                    <span className="font-semibold">Duration:</span>
                  </span>
                  <span>{batch.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiTarget />
                    <span className="font-semibold">Target:</span>
                  </span>
                  <span>{batch.target}</span>
                </div>
              </div>

              <h4 className="text-xl font-bold mb-4">Program Features:</h4>
              <ul className="space-y-3">
                {batch.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FiCheckCircle className="mt-1 shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link 
                  to="/contact"
                  className="block w-full bg-white text-center text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
                >
                  Enroll Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Re-attempt Programs?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Expert Faculty", desc: "Experienced teachers who understand the challenges of re-attempt students" },
              { title: "Proven Strategy", desc: "Time-tested methods to overcome previous weaknesses and improve scores" },
              { title: "Personalized Attention", desc: "Individual analysis and customized study plans for each student" },
              { title: "Comprehensive Material", desc: "Updated study material aligned with latest exam patterns" },
              { title: "Mock Test Series", desc: "Regular full-length tests simulating actual exam conditions" },
              { title: "Mental Preparation", desc: "Counseling and motivation to build confidence and reduce exam stress" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <FiCheckCircle size={28} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </>
);

// Integrated Section Component
const IntegratedSection = () => (
  <>
    <section className="py-20">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-blue-600 font-bold uppercase tracking-wide">Integrated Classroom Program</span>
          <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mt-2 mb-6">Long-term Success Strategy</h2>
          <p className="text-lg text-gray-600">
            Multi-year programs designed to build strong fundamentals early and gradually progress towards competitive exam excellence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "NTSE/Olympiad/Foundation",
              subtitle: "Target: 6th to 10th",
              duration: "5 Years Program",
              color: "from-blue-500 to-indigo-600",
              icon: <FiBookOpen size={32} />,
              features: [
                "Early start for competitive mindset",
                "Olympiad (Math, Science) training",
                "NTSE Stage I & II preparation",
                "Strong conceptual foundation",
                "Board exam excellence focus",
                "Progressive difficulty levels",
                "Regular assessments",
                "Parent-teacher interaction"
              ],
              benefits: [
                "Build confidence from young age",
                "Develop problem-solving skills",
                "Stay ahead of peers",
                "Smooth transition to higher classes"
              ]
            },
            {
              title: "Target IIT/NIT",
              subtitle: "11th Maths Group",
              duration: "2 Years Program",
              color: "from-purple-500 to-pink-600",
              icon: <FiTarget size={32} />,
              features: [
                "JEE Main & Advanced focus",
                "Physics, Chemistry, Maths depth",
                "Board + Competitive parallel prep",
                "IIT coaching methodology",
                "Regular mock tests",
                "Rank improvement strategy",
                "Problem-solving techniques",
                "Crash course before exams"
              ],
              benefits: [
                "Dual preparation advantage",
                "Time-efficient study plan",
                "Expert faculty guidance",
                "Top engineering college admission"
              ]
            },
            {
              title: "Target NEET",
              subtitle: "11th Biology Group",
              duration: "2 Years Program",
              color: "from-green-500 to-emerald-600",
              icon: <FiAward size={32} />,
              features: [
                "NEET focused curriculum",
                "Biology, Physics, Chemistry",
                "Medical entrance strategy",
                "Board + NEET integrated approach",
                "NCERT mastery emphasis",
                "Regular test series",
                "Previous year analysis",
                "Entrance exam tactics"
              ],
              benefits: [
                "Medical college readiness",
                "Strong Biology foundation",
                "High scoring strategy",
                "Top medical institution entry"
              ]
            }
          ].map((program, idx) => (
            <motion.div
              key={idx}
              className={`bg-linear-to-br ${program.color} rounded-3xl p-8 text-white shadow-xl hover:-translate-y-2 transition-all duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="bg-white/20 p-4 rounded-2xl inline-flex mb-4">
                {program.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
              <p className="text-white/90 mb-1">{program.subtitle}</p>
              <div className="bg-white/10 inline-block px-3 py-1 rounded-full text-sm mb-6">
                <FiCalendar className="inline mr-1" />
                {program.duration}
              </div>

              <h4 className="text-lg font-bold mb-3">Program Features:</h4>
              <ul className="space-y-2 mb-6">
                {program.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <FiCheckCircle className="mt-0.5 shrink-0" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/20 pt-4">
                <h4 className="text-lg font-bold mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {program.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <FiTrendingUp className="mt-0.5 shrink-0" size={16} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Integrated Programs Work Better?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                icon: <FiClock size={24} />, 
                title: "Time Advantage", 
                desc: "Early start provides more time to master concepts thoroughly without last-minute rush. Students develop deep understanding rather than superficial knowledge." 
              },
              { 
                icon: <FiTrendingUp size={24} />, 
                title: "Progressive Learning", 
                desc: "Gradual increase in difficulty level ensures students are never overwhelmed. Each year builds upon previous knowledge systematically." 
              },
              { 
                icon: <FiTarget size={24} />, 
                title: "Board + Competitive Balance", 
                desc: "Integrated approach covers both board exams and competitive entrance simultaneously, avoiding the need for separate coaching." 
              },
              { 
                icon: <FiUsers size={24} />, 
                title: "Consistent Mentorship", 
                desc: "Long-term association with same faculty ensures personalized guidance and deep understanding of each student's strengths and weaknesses." 
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex gap-4"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-xl hover:bg-blue-700 transition-all shadow-xl"
          >
            View All Courses
            <FiBookOpen />
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default Academic;
