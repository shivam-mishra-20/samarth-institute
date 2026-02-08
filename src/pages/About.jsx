import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiAward, 
  FiUsers, 
  FiTrendingUp, 
  FiMapPin, 
  FiClock, 
  FiPhone,
  FiCheckCircle, 
  FiBookOpen,
  FiActivity,
  FiLayers
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const About = () => {
  return (
    <div className="min-h-screen bg-samarth-bg font-sans text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-samarth-blue-900 via-blue-800 to-indigo-900 text-white">
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
                <h2 className="text-xl md:text-2xl font-light text-blue-200 uppercase tracking-widest mb-4">Welcome to</h2>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">Samarth Institute</h1>
                <p className="text-2xl md:text-4xl font-serif text-yellow-400 italic mb-8">"Mine Of Confidence"</p>
                
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-blue-100/90 text-sm md:text-base font-medium">
                   <span className="flex items-center gap-2"><FiCheckCircle /> Est. 15th April 2017</span>
                   <span className="hidden md:inline">•</span>
                   <span className="flex items-center gap-2"><FiMapPin /> Vadodara, Gujarat</span>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="-mt-12 relative z-20">
         <div className="container-custom">
            <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 text-center">
               {[
                  { label: "Years of Excellence", value: "8+" },
                  { label: "Students Mentored", value: "5000+" },
                  { label: "Top Ranks", value: "100+" },
                  { label: "Branches", value: "2" }
               ].map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="p-2"
                  >
                     <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stat.value}</h3>
                     <p className="text-gray-500 text-sm md:text-base font-medium uppercase tracking-wide">{stat.label}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Mission & Introduction */}
      <section className="py-24">
        <div className="container-custom">
           <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div 
                className="lg:w-1/2 relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                  <div className="relative group">
                      <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full -z-10 group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-100 rounded-full -z-10 group-hover:scale-125 transition-transform duration-500 delay-100"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" 
                        alt="Students Learning" 
                        className="rounded-3xl shadow-2xl w-full object-cover h-[500px] transform group-hover:rotate-1 transition-transform duration-500"
                      />
                      <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-10 -left-6 bg-white p-6 rounded-xl shadow-xl border-l-4 border-yellow-400 max-w-xs hidden md:block"
                      >
                          <p className="font-bold text-gray-900 text-lg italic">"Empowering students today for a brighter tomorrow."</p>
                      </motion.div>
                  </div>
              </motion.div>
              
              <motion.div 
                 className="lg:w-1/2"
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true }}
                 variants={staggerContainer}
              >
                  <motion.div variants={fadeInUp} className="flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-wide">
                     <span className="w-10 h-0.5 bg-blue-600"></span> Who We Are
                  </motion.div>
                  <motion.h3 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-8 leading-tight">
                     Fostering Academic Excellence Since 2017
                  </motion.h3>
                  
                  <motion.div variants={fadeInUp} className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify">
                      <p>
                          <span className="font-semibold text-samarth-blue-700">Samarth Institute</span> is a premier educational hub dedicated to specialized coaching for students from <span className="text-gray-900 font-medium">Class 6 to 12</span>. 
                          Our mission is simple yet profound: to equip students with the deep knowledge and problem-solving skills necessary to excel in their academic and professional pursuits—whether in Engineering (JEE), Medicine (NEET), or any other field.
                      </p>
                      <p>
                          Founded on <span className="font-bold text-gray-900">15th April 2017</span> with a noble vision, we aim to revolutionize how education is perceived. Our tagline, <span className="bg-yellow-100 px-2 py-0.5 rounded font-bold text-samarth-blue-800">"Mine Of Confidence"</span>, reflects our core intention: digging deep to unearth the potential within every student, making them confident individuals ready to face the world.
                      </p>
                      <p>
                          With a dedicated team of expert faculty and a friendly environment that encourages curiosity, we integrate innovative learning techniques to make education an enjoyable, stress-free experience.
                      </p>
                  </motion.div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Directors Message Section */}
      <section className="py-20 bg-blue-50">
          <div className="container-custom">
             <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100 flex flex-col md:flex-row items-center gap-12">
                 <div className="md:w-1/3 text-center">
                    <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                       {/* Placeholder for Director Image */}
                       <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="Director" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Leading The Way</h3>
                    <p className="text-blue-600 font-medium">Head of Institute</p>
                 </div>
                 <div className="md:w-2/3 relative">
                    <FiAward className="text-blue-100 w-32 h-32 absolute -top-10 -left-10 -z-10 opacity-50" />
                    <h2 className="text-2xl font-bold text-samarth-blue-900 mb-6">A Message from Leadership</h2>
                    <blockquote className="text-xl text-gray-600 italic leading-relaxed mb-6">
                       "At Samarth Institute, we don't just teach subjects; we build careers and character. Our goal is to ensure that every student who walks through our doors leaves with the confidence to conquer any challenge. We are committed to providing a learning environment that is both rigorous and supportive."
                    </blockquote>
                    <img src="/logo 2.jpg" alt="Samarth Logo" className="h-12 opacity-80" />
                 </div>
             </div>
          </div>
      </section>

      {/* Our Vision Cards */}
      <section className="py-24 bg-white relative">
          <div className="container-custom">
              <motion.div 
                className="text-center max-w-3xl mx-auto mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                  <span className="text-blue-600 font-bold uppercase tracking-wide">Our Philosophy</span>
                  <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mt-2 mb-6">Our Vision & Mission</h2>
                  <p className="text-lg text-gray-600">
                      To be a global leader in quality education, inspiring students to excel in Board exams and competitive arenas like JEE, NEET, NTSE, and Olympiads. We envision a future where top-tier education is accessible to all.
                  </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { icon: <FiTarget size={32} />, title: "Academic Excellence", desc: "Revolutionizing educational landscapes with exceptional & innovative learning experiences provided by expert mentors." },
                      { icon: <FiTrendingUp size={32} />, title: "Passion for Learning", desc: "Fostering a genuine love for knowledge that goes beyond textbooks, encouraging innovation and curiosity." },
                      { icon: <FiUsers size={32} />, title: "Social Responsibility", desc: "Empowering students to become ethical leaders and catalysts for positive change in society and their communities." }
                  ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        className="bg-gray-50 p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group relative overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-md relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {item.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{item.title}</h3>
                          <p className="text-gray-600 leading-relaxed relative z-10">{item.desc}</p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* Academic Journey / Programs */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
          
          <div className="container-custom relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Comprehensive Academic Roadmap</h2>
                  <p className="text-blue-200 text-lg max-w-3xl mx-auto">
                      From building strong foundations in lower classes to rigorous competitive preparation in higher secondary, we have a structured path for every stage.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                    {
                       grade: "Class 6 - 8",
                       title: "Middle School Foundation",
                       focus: ["Conceptual Clarity", "Critical Thinking", "Analytical Skills", "Olympiad Intro"],
                       icon: <FiBookOpen size={24} />
                    },
                    {
                       grade: "Class 9 - 10",
                       title: "Secondary Excellence",
                       focus: ["Advanced Subjects", "Board Exam Prep", "Time Management", "NTSE Training"],
                       icon: <FiLayers size={24} />
                    },
                    {
                       grade: "Class 11 - 12",
                       title: "Higher Secondary Science",
                       focus: ["Physics, Chemistry, Maths/Bio", "Rigorous Training", "Career Counseling", "Board Support"],
                       icon: <FiActivity size={24} />
                    },
                    {
                       grade: "Competitive",
                       title: "Entrance Exams",
                       focus: ["JEE Main & Advanced", "NEET (Medical)", "Problem Solving Techniques", "Mock Tests"],
                       icon: <FiTarget size={24} />
                    }
                 ].map((program, idx) => (
                    <motion.div 
                       key={idx}
                       className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
                       initial={{ opacity: 0, scale: 0.9 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.1 }}
                    >
                       <div className="flex items-center justify-between mb-4 text-yellow-400">
                          <span className="font-bold uppercase tracking-wider text-sm">{program.grade}</span>
                          {program.icon}
                       </div>
                       <h3 className="text-xl font-bold mb-4">{program.title}</h3>
                       <ul className="space-y-2">
                          {program.focus.map((item, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-blue-100">
                                <span className="text-blue-400 mt-1">›</span> {item}
                             </li>
                          ))}
                       </ul>
                    </motion.div>
                 ))}
              </div>
          </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-24 bg-gray-50">
          <div className="container-custom">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div className="max-w-2xl">
                     <span className="text-blue-600 font-bold uppercase tracking-wide">Why Choose Us</span>
                     <h2 className="text-3xl md:text-4xl font-bold text-samarth-blue-900 mt-2">Distinguishing Features</h2>
                     <p className="text-gray-600 mt-4 text-lg">We go beyond traditional teaching to ensure every student succeeds.</p>
                  </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      { title: "Expert Faculty", desc: "Highly qualified educators with years of experience in Science and competitive exam preparation.", color: "text-blue-600", bg: "bg-blue-50" },
                      { title: "Proven Track Record", desc: "A consistent history of students achieving top national ranks in JEE, NEET, and Olympiads.", color: "text-green-600", bg: "bg-green-50" },
                      { title: "Comprehensive Curriculum", desc: "Meticulously designed syllabus covering all key concepts and advanced problem-solving techniques.", color: "text-purple-600", bg: "bg-purple-50" },
                      { title: "Individualized Attention", desc: "Personalized mentoring, 1-on-1 doubt clearing, and regular performance tracking.", color: "text-orange-600", bg: "bg-orange-50" }
                  ].map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        className="p-8 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleIn}
                      >
                          <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform`}>
                              <FiCheckCircle />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                          <p className="text-gray-600 leading-relaxed text-sm module-fade">{feature.desc}</p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* Locations */}
      <section className="py-24 bg-white">
          <div className="container-custom">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-6">Visit Our Centers</h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">We are conveniently located in two prime locations in Vadodara to serve you better.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                  {[
                      {
                          name: "Waghodia Road Branch",
                          address: "7th floor, Sharnam complex I/F of Savita hospital, Pariwar Cross road, Waghodia Road, Vadodara - 390025",
                          map: "https://maps.google.com/maps?q=Samarth%20Institute%20Waghodia%20Road%20Vadodara&t=&z=15&ie=UTF8&output=embed"
                      },
                      {
                          name: "Harni Branch",
                          address: "42, 4th floor Siddheshwar Paradise, Near Gada circle, Harni- Sama link road, Harni, Vadodara - 390022",
                          map: "https://maps.google.com/maps?q=Samarth%20Institute%20Harni%20Vadodara&t=&z=15&ie=UTF8&output=embed"
                      }
                  ].map((branch, idx) => (
                      <motion.div 
                        key={idx}
                        className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-300"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                      >
                         <div className="h-72 w-full bg-gray-200 relative">
                             <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                             <iframe 
                                title={branch.name}
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                style={{ border: 0 }} 
                                src={branch.map} 
                                allowFullScreen 
                                loading="lazy"
                             ></iframe>
                         </div>
                         <div className="p-8 md:p-10 flex-1">
                             <h3 className="text-2xl font-bold text-samarth-blue-900 mb-6">{branch.name}</h3>
                             <div className="space-y-4 text-gray-600 text-lg">
                                <p className="flex items-start"><FiMapPin className="mt-1.5 mr-4 text-blue-600 shrink-0" /> {branch.address}</p>
                                <p className="flex items-center"><FiPhone className="mr-4 text-blue-600" /> +91 9624225939, +91 9624225737</p>
                                <p className="flex items-center"><FiClock className="mr-4 text-blue-600" /> Mon-Sat: 8AM-8PM <br/> Sun: 8AM-12:30PM</p>
                             </div>
                         </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-center relative overflow-hidden">
          {/* Animated Background Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>

          <div className="container-custom relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Shape Your Future?</h2>
                  <p className="text-xl md:text-2xl text-blue-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                      Join Samarth Institute today and pave the way to a successful and fulfilling career with confidence.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Link to="/contact" className="px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full font-bold text-xl transition-transform hover:scale-105 shadow-xl shadow-yellow-500/20">
                          Enquire Now
                      </Link>
                      <Link to="/courses" className="px-10 py-5 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white text-white rounded-full font-bold text-xl transition-all">
                          Explore Courses
                      </Link>
                  </div>
              </motion.div>
          </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
