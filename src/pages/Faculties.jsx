import React from 'react';

const Faculties = () => {
  const faculties = [
    { name: 'Dr. Jane Smith', role: 'Head of Computer Science', bio: 'Expert in AI and Machine Learning.' },
    { name: 'Prof. John Doe', role: 'Senior Lecturer', bio: 'Specialist in Web Technologies.' },
    { name: 'Sarah Lee', role: 'Instructor', bio: 'Professional Digital Marketer.' },
  ];

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold text-samarth-blue-900 mb-8 text-center">Meet Our Faculty</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {faculties.map((faculty, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-samarth-gray-200 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-24 h-24 bg-samarth-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold">
              {faculty.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold text-samarth-blue-900">{faculty.name}</h2>
            <p className="text-sm text-samarth-blue-500 font-medium mb-2">{faculty.role}</p>
            <p className="text-samarth-gray-600">{faculty.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faculties;
