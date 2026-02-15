import React from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiArrowRight,
  FiClock,
  FiBookOpen,
  FiStar,
  FiZap,
} from "react-icons/fi";

const ClassCard = ({ course }) => {
  const { title, slug, category, duration, grade, description, features } =
    course;

  // Generate a gradient based on category for visual variety
  const getCategoryGradient = (cat) => {
    const gradients = {
      foundation: "from-emerald-500 to-teal-600",
      integrated: "from-violet-500 to-purple-600",
      boards: "from-orange-500 to-red-500",
      default: "from-blue-500 to-indigo-600",
    };
    const key = Object.keys(gradients).find((k) =>
      cat?.toLowerCase().includes(k),
    );
    return gradients[key] || gradients.default;
  };

  const gradient = getCategoryGradient(category);

  return (
    <Link to={`/courses`} className="block group relative perspective-1000">
      {/* Glow effect behind card */}
      <div
        className={`absolute -inset-2 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 group-hover:animate-pulse`}
      ></div>

      <div className="relative bg-white rounded-2xl overflow-hidden h-full transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:rotate-[0.5deg]">
        {/* Animated gradient border effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift`}
        ></div>
        <div className="absolute inset-[2px] bg-white rounded-2xl"></div>

        {/* Shimmer overlay effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
        </div>

        {/* Decorative background elements with floating animation */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-15 group-hover:scale-150 transition-all duration-700 group-hover:animate-float`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${gradient} opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:opacity-15 group-hover:scale-150 transition-all duration-700 group-hover:animate-float-delayed`}
        ></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div
            className={`absolute w-2 h-2 bg-gradient-to-r ${gradient} rounded-full top-1/4 right-1/4 opacity-0 group-hover:opacity-60 group-hover:animate-float-particle`}
          ></div>
          <div
            className={`absolute w-1.5 h-1.5 bg-gradient-to-r ${gradient} rounded-full top-1/3 left-1/3 opacity-0 group-hover:opacity-40 group-hover:animate-float-particle-delayed`}
          ></div>
          <div
            className={`absolute w-1 h-1 bg-gradient-to-r ${gradient} rounded-full bottom-1/4 right-1/3 opacity-0 group-hover:opacity-50 group-hover:animate-float-particle-slow`}
          ></div>
        </div>

        {/* Shadow layers for depth */}
        <div className="absolute inset-0 rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500"></div>

        {/* Main content container */}
        <div className="relative z-10">
          {/* Gradient Top Banner with animated width */}
          <div className="relative overflow-hidden">
            <div
              className={`h-2 bg-gradient-to-r ${gradient} group-hover:h-3 transition-all duration-300`}
            ></div>
            {/* Animated shine on banner */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>

          {/* Card Header */}
          <div className="p-5 md:p-6">
            {/* Category Badge with icon and pulse animation */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r ${gradient} text-white rounded-full uppercase tracking-wide shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden`}
              >
                <FiStar className="w-3 h-3 group-hover:animate-spin-slow" />
                {category}
                {/* Badge shimmer */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
              </span>
              {/* Floating action indicator with bounce */}
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 group-hover:animate-bounce-subtle group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>

            {/* Title with gradient on hover and text reveal animation */}
            <h3 className="font-bold text-lg md:text-xl lg:text-2xl leading-tight mb-4 min-h-14 md:min-h-16 flex items-center text-gray-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 group-hover:tracking-wide">
              {title}
            </h3>

            {/* Meta Info Pills with staggered animations */}
            <div className="flex items-center flex-wrap gap-2 md:gap-3">
              {duration && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:-translate-y-0.5">
                  <FiClock className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 group-hover:text-blue-600 group-hover:animate-pulse" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-blue-700">
                    {duration}
                  </span>
                </div>
              )}
              {grade && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 group-hover:border-purple-300 group-hover:bg-purple-50 transition-all duration-500 delay-75 group-hover:scale-105 group-hover:shadow-md group-hover:-translate-y-0.5">
                  <FiBookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 group-hover:text-purple-600 group-hover:animate-wiggle" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-purple-700">
                    {grade}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Divider with gradient and animated width */}
          <div className="mx-5 md:mx-6 relative">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <div
              className={`absolute inset-0 h-px bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
            ></div>
          </div>

          {/* Expandable Card Body */}
          <div className="relative">
            <div className="md:max-h-100 lg:max-h-0 lg:group-hover:max-h-150 overflow-hidden transition-all duration-500 ease-in-out">
              <div className="p-5 md:p-6">
                {/* Description with fade-in effect */}
                {description && (
                  <p className="text-sm text-gray-600 mb-5 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    {description}
                  </p>
                )}

                {/* Features List with staggered reveal animation */}
                {features && features.length > 0 && (
                  <ul className="space-y-3 mb-5">
                    {features.slice(0, 3).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-700 group/item opacity-80 group-hover:opacity-100 transition-all duration-300"
                        style={{
                          transitionDelay: `${idx * 100}ms`,
                        }}
                      >
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center mr-3 mt-0.5 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}
                          style={{
                            transitionDelay: `${idx * 100 + 50}ms`,
                          }}
                        >
                          <FiCheck className="text-white w-3 h-3" />
                        </span>
                        <span className="leading-relaxed group-hover:translate-x-1 transition-transform duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button - Enhanced with ripple effect */}
                <div
                  className={`mt-4 py-3 px-4 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-between text-white font-semibold text-sm shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group-hover:scale-[1.02]`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FiZap className="w-4 h-4 animate-pulse" />
                    Explore Program
                  </span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                    <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  {/* Button shimmer */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* "Hover to view details" hint for desktop - Enhanced with wave animation */}
            <div className="hidden lg:flex lg:group-hover:hidden p-5 flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 font-medium animate-pulse">
                Hover to explore
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(50%, -50%) scale(1.5);
          }
          50% {
            transform: translate(50%, -55%) scale(1.6);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translate(-50%, 50%) scale(1.5);
          }
          50% {
            transform: translate(-50%, 45%) scale(1.6);
          }
        }
        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.3;
          }
        }
        @keyframes float-particle-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
            opacity: 0.2;
          }
        }
        @keyframes float-particle-slow {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-25px) scale(1.2);
            opacity: 0.25;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        .group:hover .group-hover\\:animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .group:hover .group-hover\\:animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
        .group:hover .group-hover\\:animate-float-particle {
          animation: float-particle 2s ease-in-out infinite;
        }
        .group:hover .group-hover\\:animate-float-particle-delayed {
          animation: float-particle-delayed 2.5s ease-in-out infinite 0.3s;
        }
        .group:hover .group-hover\\:animate-float-particle-slow {
          animation: float-particle-slow 3s ease-in-out infinite 0.6s;
        }
        .group:hover .group-hover\\:animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .group:hover .group-hover\\:animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
        .group:hover .group-hover\\:animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
      `}</style>
    </Link>
  );
};

export default ClassCard;
