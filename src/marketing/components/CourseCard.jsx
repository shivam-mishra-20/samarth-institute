import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiStar } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  const { title, instructor, cover, duration, slug, rating, students } = course;

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-samarth-gray-200 overflow-hidden group flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-samarth-blue-700 flex items-center shadow-sm">
          <FiStar className="mr-1 fill-current" /> {rating} <span className="mx-1 text-samarth-gray-400">|</span> <span className="font-normal">{students}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-samarth-blue-900 mb-2 line-clamp-2 group-hover:text-samarth-blue-700 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center text-sm text-samarth-gray-600 mb-4 mt-auto pt-2">
          <FiUser className="mr-2 text-samarth-blue-500" />
          <span className="truncate">{instructor}</span>
        </div>

        <div className="border-t border-samarth-gray-100 pt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-samarth-gray-600">
            <FiClock className="mr-1.5" />
            {duration}
          </div>
          <Link
            to={`/courses/${slug}`}
            className="text-samarth-blue-700 font-semibold hover:text-samarth-blue-900 transition-colors"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader Component
export const CourseCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-samarth-gray-200 overflow-hidden h-full animate-pulse">
    <div className="h-48 bg-samarth-gray-200"></div>
    <div className="p-5">
      <div className="h-6 bg-samarth-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-samarth-gray-200 rounded w-1/2 mb-6"></div>
      <div className="flex justify-between pt-4 border-t border-samarth-gray-100">
        <div className="h-4 bg-samarth-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-samarth-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default CourseCard;
