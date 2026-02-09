import React from "react";
import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

const ClassCard = ({ course }) => {
  const { title, slug, category, duration, grade, description, features } =
    course;

  return (
    <Link
      to={`/courses`}
      className="block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200 overflow-hidden group"
    >
      {/* Card Content - Expands on Hover */}
      <div className="bg-gradient-to-br from-blue-50 to-white p-4">
        {/* Category Badge - Hidden by default, shown on hover */}
        <div className="max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
          {category && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Title - Always Visible, changes alignment on hover */}
        <h3 className="text-sm md:text-base lg:text-lg font-bold text-blue-700 group-hover:text-blue-900 transition-all leading-tight text-center group-hover:text-left mb-2 min-h-[3.5rem] flex items-center justify-center group-hover:justify-start">
          {title}
        </h3>

        {/* Expandable Details - Hidden by default */}
        <div className="max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
          {/* Duration & Grade */}
          <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
            {duration && <span className="font-medium">⏱ {duration}</span>}
            {grade && <span className="font-medium">📚 {grade}</span>}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs md:text-sm text-gray-700 mb-3 leading-relaxed">
              {description}
            </p>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {features.slice(0, 3).map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-xs text-gray-700"
                >
                  <FiCheck
                    className="text-green-600 mr-1.5 mt-0.5 flex-shrink-0"
                    size={14}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* View Details Button */}
          <div className="mt-2">
            <span className="inline-block w-full text-center px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;
