import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CategoryCard = ({ category }) => {
  const {
    title,
    subtitle,
    tags,
    subjects,
    description,
    link,
    icon: IconComponent,
    bgColor,
    accentColor,
  } = category;

  // Background color classes - slightly darker for better visibility
  const getBgClass = (color) => {
    const colors = {
      blue: "bg-blue-100/80",
      indigo: "bg-indigo-100/80",
      orange: "bg-orange-100/80",
      red: "bg-red-100/80",
      green: "bg-emerald-100/80",
      emerald: "bg-emerald-100/80",
      teal: "bg-teal-100/80",
      cyan: "bg-cyan-100/80",
      purple: "bg-purple-100/80",
      pink: "bg-pink-100/80",
      yellow: "bg-yellow-100/80",
      amber: "bg-amber-100/80",
      default: "bg-gray-100/80",
    };
    return colors[color] || colors.default;
  };

  // Accent circle color classes - more visible
  const getAccentClass = (color) => {
    const colors = {
      blue: "bg-blue-200",
      indigo: "bg-indigo-200",
      orange: "bg-orange-200",
      red: "bg-red-200",
      green: "bg-emerald-200",
      emerald: "bg-emerald-200",
      teal: "bg-teal-200",
      cyan: "bg-cyan-200",
      purple: "bg-purple-200",
      pink: "bg-pink-200",
      yellow: "bg-yellow-200",
      amber: "bg-amber-200",
      default: "bg-gray-200",
    };
    return colors[color] || colors.default;
  };

  // Icon color classes
  const getIconColorClass = (color) => {
    const colors = {
      blue: "text-blue-600",
      indigo: "text-indigo-600",
      orange: "text-orange-500",
      red: "text-red-500",
      green: "text-emerald-600",
      emerald: "text-emerald-600",
      teal: "text-teal-600",
      cyan: "text-cyan-600",
      purple: "text-purple-600",
      pink: "text-pink-500",
      yellow: "text-yellow-500",
      amber: "text-amber-500",
      default: "text-gray-600",
    };
    return colors[color] || colors.default;
  };

  // Tag hover colors
  const getTagHoverClass = (color) => {
    const colors = {
      blue: "group-hover:border-blue-400 group-hover:bg-blue-100",
      indigo: "group-hover:border-indigo-400 group-hover:bg-indigo-100",
      orange: "group-hover:border-orange-400 group-hover:bg-orange-100",
      red: "group-hover:border-red-400 group-hover:bg-red-100",
      green: "group-hover:border-emerald-400 group-hover:bg-emerald-100",
      emerald: "group-hover:border-emerald-400 group-hover:bg-emerald-100",
      teal: "group-hover:border-teal-400 group-hover:bg-teal-100",
      cyan: "group-hover:border-cyan-400 group-hover:bg-cyan-100",
      purple: "group-hover:border-purple-400 group-hover:bg-purple-100",
      pink: "group-hover:border-pink-400 group-hover:bg-pink-100",
      yellow: "group-hover:border-yellow-400 group-hover:bg-yellow-100",
      amber: "group-hover:border-amber-400 group-hover:bg-amber-100",
      default: "group-hover:border-gray-400 group-hover:bg-gray-100",
    };
    return colors[color] || colors.default;
  };

  // Border color on hover
  const getBorderHoverClass = (color) => {
    const colors = {
      blue: "group-hover:border-blue-300",
      indigo: "group-hover:border-indigo-300",
      orange: "group-hover:border-orange-300",
      red: "group-hover:border-red-300",
      green: "group-hover:border-emerald-300",
      emerald: "group-hover:border-emerald-300",
      teal: "group-hover:border-teal-300",
      cyan: "group-hover:border-cyan-300",
      purple: "group-hover:border-purple-300",
      pink: "group-hover:border-pink-300",
      yellow: "group-hover:border-yellow-300",
      amber: "group-hover:border-amber-300",
      default: "group-hover:border-gray-300",
    };
    return colors[color] || colors.default;
  };

  const bgClass = getBgClass(bgColor);
  const accentClass = getAccentClass(accentColor || bgColor);
  const iconColorClass = getIconColorClass(accentColor || bgColor);
  const tagHoverClass = getTagHoverClass(accentColor || bgColor);
  const borderHoverClass = getBorderHoverClass(accentColor || bgColor);

  return (
    <Link to={link || "/courses"} className="block group relative">
      {/* Glow effect */}
      <div
        className={`absolute -inset-2 ${bgClass} rounded-3xl opacity-0 group-hover:opacity-80 blur-xl transition-all duration-500`}
      ></div>

      <div
        className={`relative ${bgClass} rounded-2xl p-5 md:p-6 h-full transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 overflow-hidden border border-transparent ${borderHoverClass} group-hover:shadow-2xl`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/60 to-transparent skew-x-12"></div>
        </div>

        {/* Decorative accent circles with animation */}
        <div
          className={`absolute -right-6 -bottom-6 w-32 h-32 ${accentClass} rounded-full opacity-60 group-hover:opacity-90 group-hover:scale-125 transition-all duration-700`}
        ></div>
        <div
          className={`absolute -right-2 -bottom-2 w-24 h-24 ${accentClass} rounded-full opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500 delay-100`}
        ></div>
        <div
          className={`absolute right-8 bottom-8 w-12 h-12 ${accentClass} rounded-full opacity-30 group-hover:opacity-50 group-hover:scale-150 transition-all duration-600 delay-200`}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full min-h-55">
          {/* Header with title and icon */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-xl md:text-2xl text-gray-800 group-hover:text-gray-900 transition-colors duration-300 mb-1">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
              )}
            </div>
            {/* Icon from Lucide */}
            {IconComponent && (
              <div
                className={`w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${iconColorClass} shrink-0 ml-3`}
              >
                <IconComponent className="w-6 h-6" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">
              {description}
            </p>
          )}

          {/* Tags with staggered animation */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags &&
              tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-white/90 border border-gray-200 rounded-full transition-all duration-300 ${tagHoverClass} group-hover:shadow-sm group-hover:-translate-y-0.5`}
                  style={{
                    transitionDelay: `${idx * 50}ms`,
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* Subjects */}
          {subjects && subjects.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 mb-1.5">
                Subjects Covered:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 text-xs text-gray-600 bg-white/70 rounded-md"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Explore link with enhanced animation */}
          <div className="flex items-center gap-2 text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-300 mt-auto">
            <span className="text-sm md:text-base">Explore Category</span>
            <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
            {/* Sparkle on hover */}
            <Sparkles className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
          </div>
        </div>

        {/* Floating particles on hover */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div
            className={`absolute w-3 h-3 ${accentClass} rounded-full top-1/4 right-1/4 opacity-0 group-hover:opacity-80 transition-all duration-500`}
            style={{ animation: "float-up 2s ease-in-out infinite" }}
          ></div>
          <div
            className={`absolute w-2 h-2 ${accentClass} rounded-full top-1/2 right-1/3 opacity-0 group-hover:opacity-60 transition-all duration-700`}
            style={{ animation: "float-up 2.5s ease-in-out infinite 0.3s" }}
          ></div>
          <div
            className={`absolute w-2.5 h-2.5 ${accentClass} rounded-full top-1/3 left-1/4 opacity-0 group-hover:opacity-70 transition-all duration-600`}
            style={{ animation: "float-up 3s ease-in-out infinite 0.6s" }}
          ></div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes float-up {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px) scale(1.3);
            opacity: 0.3;
          }
        }
      `}</style>
    </Link>
  );
};

export default CategoryCard;
