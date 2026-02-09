import React from "react";
import { motion } from "framer-motion";
import {
  FiMonitor,
  FiBookOpen,
  FiUsers,
  FiVideo,
  FiLayers,
  FiShield,
  FiMessageCircle,
  FiActivity,
} from "react-icons/fi";

const features = [
  {
    icon: <FiLayers />,
    title: "Best Study Material",
    description: "Comprehensive resources for every subject.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: <FiBookOpen />,
    title: "Vast Library",
    description: "Collection of books and digital resources.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: <FiShield />,
    title: "Student Security",
    description: "Safe and secure learning environment.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: <FiUsers />,
    title: "Expert Faculties",
    description: "Learn from experienced mentors.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: <FiMessageCircle />,
    title: "Counseling Services",
    description: "Professional guidance for career paths.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: <FiActivity />,
    title: "Extracurriculars",
    description: "Activities for all-round development.",
    color: "bg-pink-50 text-pink-600",
  },
];

const InstituteFeatures = () => {
  return (
    <section className="py-20 bg-samarth-bg">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-400 bg-clip-text text-transparent mb-3"
          >
            Why Us? Why Samarth Institute
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-samarth-blue-900 mb-6"
          >
            Samarth Institute Facilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-samarth-gray-600 max-w-3xl mx-auto text-lg"
          >
            At Samarth Institute, we provide a range of facilities to support
            our students’ academic and extracurricular needs:
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstituteFeatures;
