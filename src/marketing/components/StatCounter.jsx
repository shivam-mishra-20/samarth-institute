import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiMonitor, FiBookOpen, FiUsers, FiVideo } from 'react-icons/fi';

const StatCounter = ({ stats }) => {
  // Using custom icons mapping based on the labels in original seed data, 
  // or we can just map the new icons directly.
  const icons = [
    <FiUsers size={40} />,
    <FiBookOpen size={40} />,
    <FiMonitor size={40} />,
    <FiVideo size={40} />
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-samarth-blue-900 mb-2">Maximize Your Potentials & Possibilities</h2>
           <p className="text-samarth-gray-500">Learn the secrets to Life Success, these people have got the key.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-6 group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {icons[index] || <FiUsers size={40} />}
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {stat.value}{stat.suffix}
              </div>
              <p className="text-samarth-gray-600 font-medium text-sm uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatCounter;
