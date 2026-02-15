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

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

// Institute Section Component
const InstituteSection = () => (
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
                className="rounded-3xl shadow-2xl w-full object-cover h-125 transform group-hover:rotate-1 transition-transform duration-500"
              />
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 -left-6 bg-white p-6 rounded-xl shadow-xl border-l-4 border-yellow-400 max-w-xs hidden md:block"
              >
                <p className="font-bold text-gray-900 text-lg italic">
                  "Empowering students today for a brighter tomorrow."
                </p>
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
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-wide"
            >
              <span className="w-10 h-0.5 bg-blue-600"></span> Who We Are
            </motion.div>
            <motion.h3
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-8 leading-tight"
            >
              Fostering Academic Excellence Since 2017
            </motion.h3>

            <motion.div
              variants={fadeInUp}
              className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify"
            >
              <p>
                <span className="font-semibold text-samarth-blue-700">
                  Samarth Institute
                </span>{" "}
                is a premier educational hub dedicated to specialized coaching
                for students from{" "}
                <span className="text-gray-900 font-medium">Class 6 to 12</span>
                . Our mission is simple yet profound: to equip students with the
                deep knowledge and problem-solving skills necessary to excel in
                their academic and professional pursuits—whether in Engineering
                (JEE), Medicine (NEET), or any other field.
              </p>
              <p>
                Founded on{" "}
                <span className="font-bold text-gray-900">15th April 2017</span>{" "}
                with a noble vision, we aim to revolutionize how education is
                perceived. Our tagline,{" "}
                <span className="bg-yellow-100 px-2 py-0.5 rounded font-bold text-samarth-blue-800">
                  "Mine Of Confidence"
                </span>
                , reflects our core intention: digging deep to unearth the
                potential within every student, making them confident
                individuals ready to face the world.
              </p>
              <p>
                With a dedicated team of expert faculty and a friendly
                environment that encourages curiosity, we integrate innovative
                learning techniques to make education an enjoyable, stress-free
                experience.
              </p>
            </motion.div>
          </motion.div>
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
          <span className="text-blue-600 font-bold uppercase tracking-wide">
            Our Philosophy
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mt-2 mb-6">
            Our Vision & Mission
          </h2>
          <p className="text-lg text-gray-600">
            To be a global leader in quality education, inspiring students to
            excel in Board exams and competitive arenas like JEE, NEET, NTSE,
            and Olympiads.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiTarget size={32} />,
              title: "Academic Excellence",
              desc: "Revolutionizing educational landscapes with exceptional & innovative learning experiences provided by expert mentors.",
            },
            {
              icon: <FiTrendingUp size={32} />,
              title: "Passion for Learning",
              desc: "Fostering a genuine love for knowledge that goes beyond textbooks, encouraging innovation and curiosity.",
            },
            {
              icon: <FiUsers size={32} />,
              title: "Social Responsibility",
              desc: "Empowering students to become ethical leaders and catalysts for positive change in society and their communities.",
            },
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                {item.desc}
              </p>
            </motion.div>
          ))}
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

// Director Message Section Component
const DirectorSection = () => (
  <section className="py-20 bg-white">
    <div className="container-custom">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Side - Video */}
        <div className="flex justify-center w-full lg:w-1/2">
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
                  src="/logo 2.jpg"
                  alt="Samarth Logo"
                  className="h-12 opacity-80"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    Samarth Institute
                  </p>
                  <p className="text-sm text-gray-500">Mine Of Confidence</p>
                </div>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          {
            title: "Expert Faculty",
            desc: "Highly qualified educators with years of experience in Science and competitive exam preparation.",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: "Advanced Degrees",
            desc: "Our faculty members hold advanced degrees from premier institutions and bring real-world expertise.",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            title: "Teaching Excellence",
            desc: "Proven track record of producing top rankers and helping students achieve their academic goals.",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            title: "Personalized Mentoring",
            desc: "One-on-one doubt clearing sessions, performance tracking, and individualized attention for every student.",
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            className="p-8 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <div
              className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform`}
            >
              <FiCheckCircle />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {feature.desc}
            </p>
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
  <section className="py-20">
    <div className="container-custom">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-samarth-blue-900 mb-6">
          World-Class Infrastructure
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          State-of-the-art facilities designed to provide an optimal learning
          environment for our students.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800"
            alt="Modern Classroom"
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <FiMonitor size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Smart Classrooms
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our classrooms are equipped with modern audio-visual equipment,
              digital boards, and smart technology to enhance the learning
              experience and make complex concepts easier to understand.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800"
            alt="Library"
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <FiBookOpen size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Resource Library
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Extensive collection of reference books, study materials, previous
              year papers, and digital resources accessible to all students for
              comprehensive exam preparation.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <FiActivity size={28} />,
            title: "Laboratory Facilities",
            desc: "Well-equipped physics, chemistry, and biology labs for hands-on practical learning and experiments.",
            color: "bg-purple-50 text-purple-600",
          },
          {
            icon: <FiTarget size={28} />,
            title: "Testing Center",
            desc: "Dedicated test centers with computerized systems for regular mock tests and assessments.",
            color: "bg-orange-50 text-orange-600",
          },
          {
            icon: <FiUsers size={28} />,
            title: "Comfortable Environment",
            desc: "Air-conditioned classrooms, comfortable seating, and a conducive atmosphere for focused study.",
            color: "bg-blue-50 text-blue-600",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div
              className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6`}
            >
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
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
