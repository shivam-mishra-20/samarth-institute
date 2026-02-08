import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

const BlogCard = ({ blog }) => {
  const { title, excerpt, date, cover, slug } = blog;

  return (
    <article className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-samarth-gray-200 overflow-hidden h-full">
      <div className="h-48 overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-sm text-samarth-gray-600 mb-3">
          <FiCalendar className="mr-2" />
          {date}
        </div>
        <h3 className="text-xl font-bold text-samarth-blue-900 mb-3 hover:text-samarth-blue-700 transition-colors cursor-pointer">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h3>
        <p className="text-samarth-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {excerpt}
        </p>
        <div className="mt-auto">
          <Link
            to={`/blog/${slug}`}
            className="inline-flex items-center font-semibold text-samarth-blue-700 hover:text-samarth-blue-900 transition-colors"
          >
            Read More <FiArrowRight className="ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
