import React from 'react';
import { FiTwitter, FiLinkedin, FiBookOpen } from 'react-icons/fi';

const FacultyCard = ({ faculty }) => {
  const { name, role, image, rating, courseCount } = faculty;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4">
        {/* Image with circle background */}
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex-shrink-0 p-1 bg-white border-2 border-dashed ${
            // Simple logic to rotate colors based on name length or something stable
            name.length % 3 === 0 ? 'border-yellow-400' : name.length % 3 === 1 ? 'border-red-400' : 'border-blue-400'
        }`}>
            <img 
                src={image} 
                alt={name} 
                className="w-full h-full rounded-full object-cover"
            />
        </div>

        <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500 mb-2">{role}</p>
            
            <div className="flex items-center text-sm font-medium text-gray-400 space-x-4">
                <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span> {rating}
                </div>
                <div className="flex items-center">
                    <span className="mr-1">▶</span> {courseCount} courses
                </div>
            </div>
        </div>
    </div>
  );
};

export default FacultyCard;
