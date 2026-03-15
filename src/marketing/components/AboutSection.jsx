import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side - Video */}
          <div className="flex justify-center w-full lg:w-1/2">
            <div className="w-full max-w-75 space-y-4 md:max-w-90">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 group w-full"
              >
                <div className="aspect-9/16 bg-black relative">
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="relative overflow-hidden rounded-2xl border border-samarth-blue-100 bg-linear-to-br from-samarth-blue-900 via-samarth-blue-800 to-samarth-blue-700 p-5 text-white shadow-xl"
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-yellow-400" />
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="relative pl-3">
      
                  <h3 className="mt-2 text-xl font-extrabold tracking-wide text-yellow-300 sm:text-2xl">
                    Mrs. Tejashri Jadhav
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-white/95 sm:text-base">
                    Founder & Director
                  </p>
                  <div className="mt-3 h-px w-full bg-white/20" />
                  <p className="mt-3 text-sm leading-relaxed text-blue-50/90">
                    M.Sc Biotechnology, PGDM Bioinformatics, B.Ed
                  </p>
                </div>
              </motion.div>
            </div>
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
                  fostering academic excellence of each subject for students
                  from Class 6th to 12th. Our mission is to equip students with
                  the knowledge and skills necessary to excel in their academic
                  and professional pursuits, not only in the ﬁelds of
                  engineering and medicine but also various ﬁelds in which
                  students can do their best.
                </p>
                <p>
                  We specialize in comprehensive preparation for competitive
                  exams like JEE and NEET, while also ensuring a strong
                  foundation in board curriculum. Our approach goes beyond rote
                  learning; we focus on concept clarity, critical thinking, and
                  holistic development.
                </p>

                <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-samarth-blue-700 italic text-samarth-blue-900 mt-6">
                  "We feel, Empowerment is the key stone of Education and the
                  education is fulﬁlled, when the heart, the intellect and the
                  actions of a person are profound."
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
