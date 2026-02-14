import React from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiArrowRight, FiClock, FiBookOpen } from "react-icons/fi";

const ClassCard = ({ course }) => {
  const { title, slug, category, duration, grade, description, features } =
    course;

  return (
    <Link
      to={`/courses`}
      className="block group relative"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200 overflow-hidden h-full transform hover:-translate-y-2 hover:border-blue-500">
        {/* Blue Top Border */}
        <div className="h-1 bg-blue-600 group-hover:h-1.5 transition-all duration-300"></div>
        
        {/* Card Header - Always Visible */}
        <div className="p-5 md:p-6 border-b border-gray-100">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-md uppercase tracking-wide">
              {category}
            </span>
          </div>
          
          {/* Title - Always Visible */}
          <h3 className="text-gray-900 font-bold text-base md:text-lg lg:text-xl leading-tight mb-3 min-h-10 md:min-h-12 flex items-center group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
            {duration && (
              <div className="flex items-center gap-1.5">
                <FiClock className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                <span className="font-medium">{duration}</span>
              </div>
            )}
            {grade && (
              <div className="flex items-center gap-1.5">
                <FiBookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                <span className="font-medium">{grade}</span>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Card Body - Hidden on Desktop, Shows on Hover & Always Visible on Mobile */}
        <div className="relative">
          {/* On mobile (md and below): Always visible with auto height */}
          {/* On desktop (lg and above): Starts collapsed, expands on hover */}
          <div className="md:max-h-100 lg:max-h-0 lg:group-hover:max-h-150 overflow-hidden transition-all duration-500 ease-in-out">
            <div className="p-4 md:p-5 lg:p-6">
              {/* Description */}
              {description && (
                <p className="text-xs md:text-sm text-gray-600 mb-4 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Features List */}
              {features && features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {features.slice(0, 3).map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-xs md:text-sm text-gray-700"
                    >
                      <FiCheck
                        className="text-green-500 mr-2 mt-0.5 shrink-0"
                        size={16}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA Button */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-blue-600 group-hover:text-blue-700 font-semibold text-sm">
                  <span>Explore Program</span>
                  <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* "Hover to view details" hint for desktop */}
          <div className="hidden lg:block lg:group-hover:hidden p-4 text-center">
            <span className="text-xs text-gray-400 font-medium">Hover to view details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;
