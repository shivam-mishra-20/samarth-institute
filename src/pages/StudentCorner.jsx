import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FiFileText, 
  FiDownload, 
  FiExternalLink, 
  FiCalendar, 
  FiClock,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiUsers,
  FiVideo,
  FiBook,
  FiAward
} from 'react-icons/fi';

const StudentCorner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get('tab') || 'exam-papers';

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Sample exam papers data
  const examPapers = [
    {
      id: 1,
      title: 'JEE Main 2025 - Physics Mock Test',
      class: 'JEE',
      subject: 'Physics',
      date: 'January 15, 2026',
      downloads: 234,
      fileSize: '2.5 MB'
    },
    {
      id: 2,
      title: 'NEET 2025 - Biology Sample Paper',
      class: 'NEET',
      subject: 'Biology',
      date: 'January 10, 2026',
      downloads: 189,
      fileSize: '3.2 MB'
    },
    {
      id: 3,
      title: 'Class 12 Board - Mathematics',
      class: 'Class 12',
      subject: 'Mathematics',
      date: 'December 20, 2025',
      downloads: 456,
      fileSize: '1.8 MB'
    },
    {
      id: 4,
      title: 'Class 10 Board - Science',
      class: 'Class 10',
      subject: 'Science',
      date: 'December 15, 2025',
      downloads: 567,
      fileSize: '2.1 MB'
    },
    {
      id: 5,
      title: 'JEE Advanced - Chemistry',
      class: 'JEE',
      subject: 'Chemistry',
      date: 'January 8, 2026',
      downloads: 312,
      fileSize: '2.8 MB'
    },
    {
      id: 6,
      title: 'Foundation - Class 9 Mathematics',
      class: 'Class 9',
      subject: 'Mathematics',
      date: 'December 10, 2025',
      downloads: 423,
      fileSize: '1.5 MB'
    }
  ];

  // Sample news and circulars
  const newsCirculars = [
    {
      id: 1,
      type: 'Circular',
      title: 'Updated Exam Schedule for February 2026',
      date: 'February 10, 2026',
      description: 'Important changes in the examination schedule. Please review the updated timings.',
      isImportant: true
    },
    {
      id: 2,
      type: 'News',
      title: 'Outstanding Results in JEE Main 2025',
      date: 'February 8, 2026',
      description: '85% of our students scored above 95 percentile. Congratulations to all!',
      isImportant: false
    },
    {
      id: 3,
      type: 'Circular',
      title: 'Holiday Notice - Holi Celebration',
      date: 'February 5, 2026',
      description: 'Institute will remain closed from March 14-16, 2026 for Holi festival.',
      isImportant: false
    },
    {
      id: 4,
      type: 'News',
      title: 'New Faculty Joining - Physics Department',
      date: 'February 1, 2026',
      description: 'We are pleased to welcome Dr. Rajesh Kumar, IIT Delhi alumnus to our Physics department.',
      isImportant: false
    },
    {
      id: 5,
      type: 'Circular',
      title: 'Parent-Teacher Meeting - February 2026',
      date: 'January 28, 2026',
      description: 'Mandatory PTM scheduled for February 20, 2026. All parents requested to attend.',
      isImportant: true
    },
    {
      id: 6,
      type: 'News',
      title: 'Free Mock Test Series Announced',
      date: 'January 25, 2026',
      description: 'Free mock test series for JEE and NEET students starting from March 1, 2026.',
      isImportant: false
    }
  ];

  const tabs = [
    { id: 'results', label: 'Results Showcase', icon: FiAward, category: 'Achievements' },
    { id: 'apply-online', label: 'Apply Online', icon: FiExternalLink, category: 'Admission' },
    { id: 'brochure', label: 'Institute Brochure', icon: FiBook, category: 'Download' },
    { id: 'exam-papers', label: 'Exam Papers', icon: FiFileText, category: 'Download' },
    { id: 'news-circulars', label: 'News & Circulars', icon: FiInfo, category: 'Download' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <Navbar />
      
      <main className="grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30">
                  <FiFileText className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-purple-200">
                Student's Corner
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Access exam papers, apply for scholarships, and stay updated with latest news
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-6 bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
                    selectedTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Exam Papers Tab */}
            {selectedTab === 'exam-papers' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Exam Papers & Study Materials</h2>
                  <p className="text-gray-600">Download previous year papers, sample papers, and study materials</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
                    >
                      <div className="bg-linear-to-r from-blue-500 to-purple-600 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                            {paper.class}
                          </span>
                          <FiFileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold text-lg">{paper.title}</h3>
                      </div>
                      
                      <div className="p-5">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-600 text-sm">
                            <FiCalendar className="w-4 h-4 mr-2" />
                            {paper.date}
                          </div>
                          <div className="flex items-center justify-between text-gray-600 text-sm">
                            <span>Subject: {paper.subject}</span>
                            <span>{paper.fileSize}</span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <FiDownload className="w-4 h-4 mr-2" />
                            {paper.downloads} downloads
                          </div>
                        </div>
                        
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                          <FiDownload className="w-5 h-5" />
                          Download Paper
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Online Tab */}
            {selectedTab === 'apply-online' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Apply Online</h2>
                  <p className="text-gray-600">Apply for scholarship or make an enquiry</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Apply for Scholarship */}
                  <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white hover:scale-105 transition-transform duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-3">Apply for Scholarship</h3>
                        <p className="text-blue-100 mb-6">
                          Merit-based scholarships available. Up to 50% fee waiver for deserving students based on academic performance.
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                        <FiCheckCircle className="w-8 h-8" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-blue-100">
                        <FiCheckCircle className="w-5 h-5 shrink-0" />
                        <span>Merit-based evaluation</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <FiCheckCircle className="w-5 h-5 shrink-0" />
                        <span>Up to 50% fee concession</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <FiCheckCircle className="w-5 h-5 shrink-0" />
                        <span>Available for all courses</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <FiCheckCircle className="w-5 h-5 shrink-0" />
                        <span>Quick approval process</span>
                      </div>
                    </div>

                    <div className="flex items-center text-yellow-300 text-sm mb-6 bg-white/10 rounded-lg p-3">
                      <FiClock className="w-5 h-5 mr-2 shrink-0" />
                      <span>Scholarship applications open till February 28, 2026</span>
                    </div>
                    
                    <a
                      href="/register"
                      className="flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full"
                    >
                      Apply Now
                      <FiExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Enquire Now Form */}
                  <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiInfo className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Enquire Now</h3>
                        <p className="text-gray-600 text-sm">We'll get back to you shortly</p>
                      </div>
                    </div>

                    <form className="space-y-5">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Course Interested In *</label>
                        <select 
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select a course</option>
                          <option>Pre Foundation (Class 6-8)</option>
                          <option>Foundation Class 9</option>
                          <option>Foundation Class 10</option>
                          <option>Integrated JEE (Class 11-12)</option>
                          <option>Integrated NEET (Class 11-12)</option>
                          <option>Integrated NTSE (Class 6-10)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Your Message</label>
                        <textarea
                          rows="4"
                          placeholder="Tell us about your query or requirements..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <FiCheckCircle className="w-5 h-5" />
                        Submit Enquiry
                      </button>
                    </form>
                  </div>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900 mb-2">Important Information</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li>• For scholarship applications, ensure all required documents are ready</li>
                        <li>• Our team will contact you within 24-48 hours for enquiries</li>
                        <li>• For urgent queries, please call our admission office directly</li>
                        <li>• Keep your application/enquiry ID for future reference</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News & Circulars Tab */}
            {selectedTab === 'news-circulars' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">News & Circulars</h2>
                  <p className="text-gray-600">Stay updated with latest announcements and news from the institute</p>
                </div>

                <div className="space-y-4">
                  {newsCirculars.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 hover:translate-x-1 ${
                        item.isImportant 
                          ? 'border-red-500 bg-red-50' 
                          : item.type === 'Circular' 
                            ? 'border-blue-500' 
                            : 'border-green-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.type === 'Circular' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.type}
                          </span>
                          {item.isImportant && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 flex items-center gap-1">
                              <FiAlertCircle className="w-4 h-4" />
                              Important
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiCalendar className="w-4 h-4 mr-2" />
                          {item.date}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Showcase Tab */}
            {selectedTab === 'results' && (
              <div>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Outstanding Results & Achievements</h2>
                  <p className="text-gray-600">Celebrating our students' remarkable success stories</p>
                </div>

                <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8 border border-blue-100 mb-8">
                  <div className="text-center">
                    <FiAward className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">View Complete Results</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Explore our comprehensive results showcase featuring top achievers across all standards.
                      See detailed performance metrics and success stories.
                    </p>
                    <Link
                      to="/results-showcase"
                      className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FiExternalLink className="w-5 h-5" />
                      View Full Results Page
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">98.31%</div>
                    <div className="text-sm text-gray-600 mb-1">Jignyasa Patil</div>
                    <div className="text-xs text-gray-500">Class 10th - Top Scorer</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">98.05%</div>
                    <div className="text-sm text-gray-600 mb-1">Jinal Vasava</div>
                    <div className="text-xs text-gray-500">Outstanding Achievement</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">96.86%</div>
                    <div className="text-sm text-gray-600 mb-1">Jash Patel</div>
                    <div className="text-xs text-gray-500">Excellent Performance</div>
                  </div>
                </div>
              </div>
            )}

            {/* Institute Brochure Tab */}
            {selectedTab === 'brochure' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Institute Brochure</h2>
                  <p className="text-gray-600">Download our comprehensive institute brochure</p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white mb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                        <FiBook className="w-12 h-12" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">Samarth LMS Brochure 2026-27</h3>
                        <p className="text-blue-100 mb-4">Complete information about our courses, faculty, facilities, and achievements</p>
                        <div className="flex items-center gap-4 text-sm text-blue-100">
                          <span>PDF Format</span>
                          <span>•</span>
                          <span>8.5 MB</span>
                          <span>•</span>
                          <span>24 Pages</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl">
                    <FiDownload className="w-6 h-6" />
                    Download Brochure
                  </button>

                  <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                      <FiFileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800 mb-1">Course Details</h4>
                      <p className="text-sm text-gray-600">Complete curriculum information</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                      <FiUsers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800 mb-1">Faculty Info</h4>
                      <p className="text-sm text-gray-600">Meet our expert teachers</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                      <FiCheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800 mb-1">Success Stories</h4>
                      <p className="text-sm text-gray-600">Outstanding results</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16 bg-linear-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help or Have Questions?</h2>
            <p className="text-xl mb-8 text-blue-100">Our team is here to assist you with any queries</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
              <FiExternalLink className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudentCorner;
