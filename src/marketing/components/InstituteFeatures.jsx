import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookText,
  ClipboardCheck,
  Heart,
  MonitorPlay,
  ShieldCheck,
  FileText,
  Target,
  MessageCircle,
  Lightbulb,
  Cctv,
  Flame,
  DoorOpen,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Faculties",
    description:
      "Learn from experienced mentors who are passionate about teaching.",
    color: "bg-red-100 text-red-600",
    accentColor: "bg-red-200",
  },
  {
    icon: BookText,
    title: "Structured Study Material & Worksheets",
    description: "Comprehensive resources designed for exam success.",
    color: "bg-blue-100 text-blue-600",
    accentColor: "bg-blue-200",
    bulletPoints: [
      "Concept-wise printed notes",
      "Exam-oriented question banks",
      "Weekly practice worksheets",
      "JEE/NEET/Olympiad pattern exposure",
      "Previous years' questions practice",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Regular Tests & Performance Analysis",
    description: "Continuous assessment to track and improve performance.",
    color: "bg-green-100 text-green-600",
    accentColor: "bg-green-200",
    bulletPoints: [
      "Weekly & Monthly tests",
      "Board pattern mock exams",
      "Competitive foundation tests",
      "Detailed result discussion",
      "Parent performance meetings",
    ],
  },
  {
    icon: Heart,
    title: "Personal Attention & Mentorship",
    description: "Individual care and guidance for every student.",
    color: "bg-purple-100 text-purple-600",
    accentColor: "bg-purple-200",
    bulletPoints: [
      "Direct involvement of Director in academics",
      "Small batch monitoring",
      "Doubt-solving sessions",
      "Motivation & discipline training",
    ],
  },
  {
    icon: MonitorPlay,
    title: "Interactive Classes",
    description: "Modern teaching methods in a conducive learning environment.",
    color: "bg-orange-100 text-orange-600",
    accentColor: "bg-orange-200",
    bulletPoints: [
      "Digital board & projector-based teaching",
      "Limited batch size for personal attention",
      "Airy, well-lit classrooms",
      "Distraction-free academic environment",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Student Security",
    description: "Safe and secure learning environment for all students.",
    color: "bg-teal-100 text-teal-600",
    accentColor: "bg-teal-200",
    bulletPoints: [
      "CCTV surveillance",
      "Fire safety measures",
      "Emergency exits",
    ],
    bulletIcons: [Cctv, Flame, DoorOpen],
  },
];

const InstituteFeatures = () => {
  return (
    <section className="py-16 bg-samarth-bg">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold bg-linear-to-r from-orange-600 via-orange-500 to-pink-400 bg-clip-text text-transparent mb-3"
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
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative accent circle */}
                <div
                  className={`absolute -right-8 -bottom-8 w-32 h-32 ${feature.accentColor} rounded-full opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500`}
                ></div>

                {/* Icon container */}
                <div
                  className={`relative z-10 w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-7 h-7" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-gray-600 text-sm leading-relaxed mb-3">
                  {feature.description}
                </p>

                {/* Bullet Points */}
                {feature.bulletPoints && feature.bulletPoints.length > 0 && (
                  <ul className="relative z-10 space-y-2 mt-4">
                    {feature.bulletPoints.map((point, idx) => {
                      const BulletIcon = feature.bulletIcons?.[idx];
                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors"
                        >
                          {BulletIcon ? (
                            <BulletIcon
                              className="w-4 h-4 mt-0.5 text-gray-500 shrink-0"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${feature.color.split(" ")[0]} mt-2 shrink-0`}
                            ></span>
                          )}
                          <span>{point}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InstituteFeatures;
