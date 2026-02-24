import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiUsers,
  FiTrendingUp,
  FiMapPin,
  FiClock,
  FiPhone,
  FiCheckCircle,
  FiBookOpen,
  FiActivity,
  FiLayers,
  FiMonitor,
  FiBook,
  FiAward,
} from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const About = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSection = searchParams.get("section") || "institute";

  const sections = [
    { id: "institute", name: "About Samarth Institute", icon: <FiBookOpen /> },
    { id: "director", name: "Director Message", icon: <FiAward /> },
    { id: "faculty", name: "Faculty And Experts", icon: <FiUsers /> },
    { id: "infrastructure", name: "Infrastructure", icon: <FiMonitor /> },
    { id: "programme", name: "Samarth Programme", icon: <FiBook /> },
  ];

  const handleSectionChange = (sectionId) => {
    setSearchParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <h2 className="text-xl md:text-2xl font-light text-blue-200 uppercase tracking-widest mb-2">
              About Us
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
              Samarth Institute
            </h1>
            <p className="text-xl md:text-2xl font-serif text-yellow-400 italic mb-4">
              "Mine Of Confidence"
            </p>
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
                    ? "bg-white text-blue-900 shadow-lg"
                    : "text-white hover:bg-white/20"
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
        {currentSection === "institute" && <InstituteSection />}
        {currentSection === "director" && <DirectorSection />}
        {currentSection === "faculty" && <FacultySection />}
        {currentSection === "infrastructure" && <InfrastructureSection />}

        {currentSection === "programme" && <ProgrammeSection />}

      </div>

      <Footer />
    </div>
  );
};

// Timeline items for About Us
const timelineItems = [
  { image: "/Images/image copy.png", label: "Our Foundation", year: "Est. 2017" },
  { image: "/Images/image copy 4.png", label: "Academic Excellence", year: "Growing Strong" },
  { image: "/Images/image copy 5.png", label: "Our System", year: "Building Futures" },
  { image: "/Images/image copy 6.png", label: "Student Success", year: "Results Driven" },
];

// Institute Section Component
const InstituteSection = () => {
  return (
  <>
    {/* Stats Section */}
    <section className="-mt-12 relative z-20">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 text-center">
          {[
            { label: "Years of Excellence", value: "8+" },
            { label: "Students Mentored", value: "5000+" },
            { label: "Top Ranks", value: "100+" },
            { label: "Branches", value: "2" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="p-2"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-500 text-sm md:text-base font-medium uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Sticky Scroll - About Us Introduction */}
    <section className="py-24">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex items-center gap-2 text-blue-600 font-bold mb-12 uppercase tracking-wide"
        >
          <span className="w-10 h-0.5 bg-blue-600"></span> About Us
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side - Timeline with Images */}
          <div className="lg:w-1/2 relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200 hidden md:block" />

            <div className="space-y-10">
              {timelineItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="relative md:pl-16 pl-0"
                >
                  {/* Timeline Dot */}
                  <motion.div
                    className="absolute left-4 top-6 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-lg z-10 hidden md:block"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 300 }}
                  />
                  {/* Glowing ring behind dot */}
                  <motion.div
                    className="absolute left-2.5 top-4.5 w-8 h-8 rounded-full bg-blue-400/20 z-0 hidden md:block"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1.2, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  />

                  {/* Label & Year */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.year}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">{item.label}</span>
                  </div>

                  {/* Image Card */}
                  <motion.div
                    className="rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-white"
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-full h-[350px] object-contain group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <p className="text-white font-bold text-lg drop-shadow-lg">{item.label}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Sticky Text Content */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 space-y-6 text-lg text-gray-600 leading-relaxed text-justify">
                <p className="font-medium text-xl text-samarth-blue-900 border-l-4 border-samarth-blue-600 pl-4 italic">
                  "Great institutions are not built by chance. They are built by conviction."
                </p>

                <p>
                  <span className="font-bold text-samarth-blue-900">Samarth Institute, Vadodara</span> was founded with a powerful belief that ordinary students, when guided with the right system, discipline, and clarity, can achieve extraordinary success.
                </p>

                <p>
                  In today's highly competitive academic environment, superficial learning is no longer enough. Students require structured preparation, strong conceptual foundations, scientific thinking, and mental resilience. Samarth Institute was created to deliver exactly that.
                </p>

                <p>
                  We mentor students from <span className="font-semibold text-gray-900">6th to 12th (Science)</span> with specialized programs for Foundation, JEE, NEET, Olympiads, and Board examinations. With dedicated centers at Waghodiya Road and Harni, we are building a reputation in Vadodara for serious, result-oriented academic preparation.
                </p>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <p className="font-bold text-samarth-blue-800 mb-3">What truly defines Samarth is not just subjects or exams — it is our system.</p>
                  <ul className="space-y-2">
                    {[
                      "Builds deep conceptual clarity before speed",
                      "Trains students to think analytically",
                      "Monitors performance consistently",
                      "Strengthens discipline and study habits",
                      "Provides personal mentorship and direction"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="mt-1 text-green-500 shrink-0"><FiCheckCircle size={18} /></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  We do not believe in shortcuts. We believe in strength. We do not create exam pressure — we create <span className="font-bold text-samarth-blue-900">exam confidence</span>.
                </p>

                <p>
                  At Samarth Institute, every child is seen, guided, and pushed towards their highest potential. We work not only on academic performance but also on mindset, focus, and competitive courage.
                </p>

                <p className="font-semibold text-gray-800">
                  We are not preparing students for one exam. We are preparing them for a lifetime of competition.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                  <p className="font-bold text-samarth-blue-900">
                    Samarth is more than a coaching institute in Vadodara. It is a structured academic ecosystem built for national-level success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Our Vision Cards */}
    <section className="py-24 bg-white relative">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Our Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-blue-50 p-10 rounded-3xl border border-blue-100 shadow-lg"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md">
               <FiTarget size={32} />
            </div>
            <h3 className="text-3xl font-bold text-samarth-blue-900 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              To build powerful academic foundations that enable students to excel in Board exams, JEE, NEET, and other national-level competitive examinations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              We are committed to delivering disciplined preparation, conceptual mastery, and consistent performance improvement — while nurturing confidence and character in every student.
            </p>
          </motion.div>

          {/* Our Vision */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-yellow-50 p-10 rounded-3xl border border-yellow-100 shadow-lg"
          >
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md">
               <FiTrendingUp size={32} />
            </div>
            <h3 className="text-3xl font-bold text-samarth-blue-900 mb-4">Our Vision</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              To evolve Samarth Institute into a recognised academic brand that transforms determined students into confident achievers.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              We envision a future where students from Vadodara compete fearlessly at national platforms, carrying with them not just knowledge — but strength, clarity, and belief.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Locations */}
    <section className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-6">
            Visit Our Centers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are conveniently located in two prime locations in Vadodara to
            serve you better.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {[
            {
              name: "Waghodia Road Branch",
              address:
                "7th floor, Sharnam complex I/F of Savita hospital, Pariwar Cross road, Waghodia Road, Vadodara - 390025",
              map: "https://maps.google.com/maps?q=Samarth%20Institute%20Waghodia%20Road%20Vadodara&t=&z=15&ie=UTF8&output=embed",
            },
            {
              name: "Harni Branch",
              address:
                "42, 4th floor Siddheshwar Paradise, Near Gada circle, Harni- Sama link road, Harni, Vadodara - 390022",
              map: "https://maps.google.com/maps?q=Samarth%20Institute%20Harni%20Vadodara&t=&z=15&ie=UTF8&output=embed",
            },
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
                <h3 className="text-2xl font-bold text-samarth-blue-900 mb-6">
                  {branch.name}
                </h3>
                <div className="space-y-4 text-gray-600 text-lg">
                  <p className="flex items-start">
                    <FiMapPin className="mt-1.5 mr-4 text-blue-600 shrink-0" />{" "}
                    {branch.address}
                  </p>
                  <p className="flex items-center">
                    <FiPhone className="mr-4 text-blue-600" /> +91 9624225939,
                    +91 9624225737
                  </p>
                  <p className="flex items-center">
                    <FiClock className="mr-4 text-blue-600" /> Mon-Sat: 8AM-8PM,
                    Sun: 8AM-12:30PM
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
  );
};

// Director Message Section Component
const DirectorSection = () => (
  <section className="py-20 bg-white">
    <div className="container-custom">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Side - Video */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 group w-full max-w-[300px] md:max-w-[360px]"
          >
            <div className="aspect-[9/16] bg-black relative">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                controls
                autoPlay
                loop
                muted
                playsInline
                poster="/logo.png"
              >
                <source src="/samarth-institute.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 w-full max-w-[360px] text-center bg-blue-50 p-6 rounded-xl border border-blue-100"
          >
            <h3 className="text-2xl font-bold text-samarth-blue-900 mb-1">Mrs Tejashri Jadhav</h3>
            <p className="text-gray-600 font-medium text-lg mb-1">Founder and Co-director</p>
            <p className="text-gray-500 font-medium">M.Sc. Biotech , PGDM Bioinfomatics, B.Ed</p>
          </motion.div>
        </div>

        {/* Right Side - Text Content */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold mb-4 border border-orange-100">
              About Institute
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-samarth-blue-900 mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-samarth-blue-700">Samarth Institute</span>
            </h2>

            <div className="space-y-6 text-samarth-gray-600 text-lg leading-relaxed">
              <p>
                Samarth Institute is a leading educational center dedicated to
                fostering academic excellence of each subject for students from
                Class 6th to 12th. Our mission is to equip students with the
                knowledge and skills necessary to excel in their academic and
                professional pursuits, not only in the fields of engineering and
                medicine but also various fields in which students can do their
                best.
              </p>
              <p>
                We specialize in comprehensive preparation for competitive exams
                like JEE and NEET, while also ensuring a strong foundation in
                board curriculum. Our approach goes beyond rote learning; we
                focus on concept clarity, critical thinking, and holistic
                development.
              </p>

              <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-samarth-blue-700 italic text-samarth-blue-900 mt-6">
                "We feel, Empowerment is the key stone of Education and the
                education is fulfilled, when the heart, the intellect and the
                actions of a person are profound."
              </div>

              <div className="flex items-center gap-4 mt-8">
                <img
                  src="/logo_2.jpg"
                  alt="Samarth Logo"
                  className="h-12 opacity-80"
                />
                
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

// Faculty Section Component
const FacultySection = () => (
  <section className="py-20">
    <div className="container-custom">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-6">
          Our Expert Faculty
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our team comprises highly qualified and experienced educators who are
          passionate about teaching and committed to student success.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { name: "Bhavna Ma'am", img: "/faculty-images/Bhavna-maam.png" },
          { name: "Diya Ma'am", img: "/faculty-images/Diya-maam.png" },
          { name: "Kiran Ma'am", img: "/faculty-images/Kiran-maam.jpeg" },
          { name: "Nilam Ma'am", img: "/faculty-images/Nilam-maam.png" },
          { name: "Rinkal Shah", img: "/faculty-images/Rinkal-Shah.png" },
          { name: "Yash Sir", img: "/faculty-images/Yash-sir.png" },
          { name: "Diya Parmar", img: "/faculty-images/diya-parmar.png" },
        ].map((faculty, idx) => (
          <motion.div
            key={idx}
            className="p-4 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
               <img src={faculty.img} alt={faculty.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {faculty.name}
            </h3>
            <p className="text-samarth-blue-600 font-medium text-sm">Expert Faculty</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Meet Our Faculty Team</h3>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Explore detailed profiles of our experienced educators and their areas
          of expertise.
        </p>
        <Link
          to="/faculty"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
        >
          View Faculty Profiles
          <FiUsers />
        </Link>
      </div>
    </div>
  </section>
);

// Infrastructure Section Component
const InfrastructureSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container-custom">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <motion.span
          className="inline-block text-sm font-bold text-blue-600 bg-blue-100 px-5 py-2 rounded-full uppercase tracking-widest mb-5"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Our Campus
        </motion.span>
        <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-5">
          Samarth Infrastructure
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          State-of-the-art facilities designed to provide the best learning environment for our students.
        </p>
      </motion.div>

      {/* Hero Image - Full Width */}
      <motion.div
        className="relative rounded-3xl overflow-hidden mb-10 group"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/testimonial_3.jpeg"
          alt="Students in Classroom"
          className="w-full h-[300px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Where Learning Comes Alive
            </h3>
            <p className="text-white/80 text-sm md:text-lg max-w-xl">
              Spacious, well-lit classrooms with modern amenities designed for focused and interactive learning.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Three Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          {
            image: "/testimonial_2.jpeg",
            icon: <FiMonitor size={22} />,
            title: "Smart Classrooms",
            desc: "Equipped with digital boards, projectors, and audio-visual systems for interactive learning sessions.",
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            image: "/Images/image copy 4.png",
            icon: <FiBookOpen size={22} />,
            title: "Exam-Ready Environment",
            desc: "Dedicated exam halls with natural lighting, proper seating, and a distraction-free atmosphere.",
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            image: "/testimonial_1.jpeg",
            icon: <FiBook size={22} />,
            title: "Study Materials & Library",
            desc: "Comprehensive study material for Physics, Chemistry, Biology, and Maths with reference books.",
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            whileHover={{ y: -8 }}
          >
            {/* Image */}
            <div className="overflow-hidden h-52 bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alternating Feature Rows */}
      {/* Row 1 - Image Left, Text Right */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-10 mb-10 bg-white rounded-3xl p-6 md:p-0 overflow-hidden shadow-lg"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="md:w-1/2 overflow-hidden rounded-2xl md:rounded-none md:rounded-l-3xl bg-gray-100">
          <img
            src="/image.png"
            alt="Our Faculty Team"
            className="w-full h-[280px] md:h-[350px] object-contain hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="md:w-1/2 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <FiUsers size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Our Team
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Expert Faculty & Mentors
          </h3>
          <p className="text-gray-500 leading-relaxed mb-4">
            Our team of experienced educators and mentors bring years of expertise in JEE, NEET, and competitive exam preparation. They are dedicated to guiding every student towards success.
          </p>
          <div className="flex flex-wrap gap-3">
            {["IIT/NIT Alumni", "10+ Years Exp", "Personal Mentoring"].map((tag) => (
              <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Stats / Features Strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {[
          { icon: <FiMonitor size={24} />, label: "Smart Classrooms", value: "10+", color: "from-blue-500 to-blue-600" },
          { icon: <FiActivity size={24} />, label: "Lab Facilities", value: "3", color: "from-purple-500 to-purple-600" },
          { icon: <FiTarget size={24} />, label: "Test Centers", value: "2", color: "from-orange-500 to-orange-600" },
          { icon: <FiCheckCircle size={24} />, label: "AC Classrooms", value: "100%", color: "from-green-500 to-green-600" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-500 group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);



// Programme Section Component
const ProgrammeSection = () => (
  <>
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-6">
            Comprehensive Academic Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From building strong foundations to rigorous competitive
            preparation, we have structured programs for every academic stage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              grade: "Class 6 - 8",
              title: "Middle School Foundation",
              focus: [
                "Conceptual Clarity",
                "Critical Thinking",
                "Analytical Skills",
                "Olympiad Introduction",
              ],
              icon: <FiBookOpen size={24} />,
              color: "from-blue-500 to-blue-600",
            },
            {
              grade: "Class 9 - 10",
              title: "Secondary Excellence",
              focus: [
                "Advanced Subjects",
                "Board Exam Preparation",
                "Time Management",
                "NTSE Training",
              ],
              icon: <FiLayers size={24} />,
              color: "from-green-500 to-green-600",
            },
            {
              grade: "Class 11 - 12",
              title: "Higher Secondary Science",
              focus: [
                "Physics, Chemistry, Maths/Biology",
                "Rigorous Training",
                "Career Counseling",
                "Board Support",
              ],
              icon: <FiActivity size={24} />,
              color: "from-purple-500 to-purple-600",
            },
            {
              grade: "Competitive",
              title: "Entrance Exams",
              focus: [
                "JEE Main & Advanced",
                "NEET (Medical)",
                "Problem Solving Techniques",
                "Mock Tests & Analysis",
              ],
              icon: <FiTarget size={24} />,
              color: "from-orange-500 to-orange-600",
            },
          ].map((program, idx) => (
            <motion.div
              key={idx}
              className={`bg-linear-to-br ${program.color} rounded-2xl p-6 text-white hover:-translate-y-2 transition-all duration-300 shadow-xl`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold uppercase tracking-wider text-sm bg-white/20 px-3 py-1 rounded-full">
                  {program.grade}
                </span>
                {program.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{program.title}</h3>
              <ul className="space-y-2">
                {program.focus.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <FiCheckCircle className="mt-1 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            What Makes Our Programs Special?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Comprehensive Curriculum",
                desc: "Meticulously designed syllabus covering all key concepts, advanced problem-solving techniques, and exam-oriented preparation.",
              },
              {
                title: "Regular Assessments",
                desc: "Weekly tests, monthly evaluations, and full-length mock exams to track progress and identify areas for improvement.",
              },
              {
                title: "Study Material",
                desc: "Custom-designed study materials, practice worksheets, and question banks created by our experienced faculty team.",
              },
              {
                title: "Doubt Clearing Sessions",
                desc: "Dedicated time slots for individual doubt clearing, extra help, and personalized guidance for every student.",
              },
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
                    <FiCheckCircle size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
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
            Explore All Courses
            <FiBookOpen />
          </Link>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24 bg-linear-to-r from-blue-900 to-indigo-900 text-white text-center relative overflow-hidden">
      {/* Animated Background Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border border-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-white/10 rounded-full"></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Shape Your Future?
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join Samarth Institute today and pave the way to a successful and
            fulfilling career with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full font-bold text-xl transition-transform hover:scale-105 shadow-xl shadow-yellow-500/20"
            >
              Enquire Now
            </Link>
            <Link
              to="/courses"
              className="px-10 py-5 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white text-white rounded-full font-bold text-xl transition-all"
            >
              Explore Courses
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </>
);



export default About;
