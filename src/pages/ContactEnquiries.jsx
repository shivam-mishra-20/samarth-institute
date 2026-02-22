import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { 
  FiMail, FiPhone, FiUser, FiBook, FiMessageSquare, FiCalendar,
  FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiCheck, FiClock,
  FiCheckCircle, FiXCircle, FiLoader, FiInbox, FiMessageCircle
} from 'react-icons/fi';

const ContactEnquiries = () => {
  const { userData } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const itemsPerPage = 10;

  // Fetch enquiries from Firebase
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const enquiriesRef = collection(db, 'contactEnquiries');
        const q = query(enquiriesRef, orderBy('submittedAt', 'desc'));
        const snapshot = await getDocs(q);
        const enquiriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEnquiries(enquiriesData);
        setFilteredEnquiries(enquiriesData);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Filter enquiries
  useEffect(() => {
    let filtered = [...enquiries];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(enq => 
        `${enq.firstName} ${enq.lastName}`.toLowerCase().includes(term) ||
        enq.email?.toLowerCase().includes(term) ||
        enq.phone?.includes(term) ||
        enq.course?.toLowerCase().includes(term) ||
        enq.message?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(enq => enq.status === statusFilter);
    }

    // Course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(enq => enq.course === courseFilter);
    }

    setFilteredEnquiries(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, courseFilter, enquiries]);

  // Update enquiry status
  const updateStatus = async (enquiryId, newStatus) => {
    setUpdatingStatus(enquiryId);
    try {
      const enquiryRef = doc(db, 'contactEnquiries', enquiryId);
      const statusChangeData = {
        status: newStatus,
        lastStatusChange: {
          changedBy: userData?.name || userData?.email || 'Unknown',
          changedAt: Timestamp.now(),
          newStatus: newStatus
        }
      };
      await updateDoc(enquiryRef, statusChangeData);
      
      setEnquiries(prev => prev.map(enq => 
        enq.id === enquiryId ? { ...enq, ...statusChangeData } : enq
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Get unique courses for filter
  const uniqueCourses = [...new Set(enquiries.map(enq => enq.course).filter(Boolean))];

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    resolved: enquiries.filter(e => e.status === 'resolved').length,
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
    };
    const icons = {
      new: <FiInbox className="w-3 h-3" />,
      contacted: <FiMessageCircle className="w-3 h-3" />,
      resolved: <FiCheckCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.new}`}>
        {icons[status] || icons.new}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'New'}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FiMail className="w-8 h-8 text-blue-600" />
                  Contact Enquiries
                </h1>
                <p className="mt-1 text-sm text-gray-500">View and manage enquiries from the contact form</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <FiMail className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">New</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                  </div>
                  <FiInbox className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Contacted</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
                  </div>
                  <FiMessageCircle className="w-8 h-8 text-yellow-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  </div>
                  <FiCheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </div>
            </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Course Filter */}
              <div className="relative">
                <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
                >
                  <option value="all">All Interests</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Enquiries List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FiLoader className="animate-spin text-4xl text-blue-600" />
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <FiInbox className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enquiries Found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || courseFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No contact enquiries have been submitted yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
                {paginatedEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div 
                      className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedCard(expandedCard === enquiry.id ? null : enquiry.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {enquiry.firstName?.[0]}{enquiry.lastName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-semibold text-gray-900">
                                {enquiry.firstName} {enquiry.lastName}
                              </h3>
                              {getStatusBadge(enquiry.status)}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <FiMail className="text-gray-400" />
                                {enquiry.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiPhone className="text-gray-400" />
                                {enquiry.phone}
                              </span>
                              {enquiry.course && (
                                <span className="flex items-center gap-1">
                                  <FiBook className="text-gray-400" />
                                  {enquiry.course}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 hidden sm:block">
                            {formatDate(enquiry.submittedAt)}
                          </span>
                          {expandedCard === enquiry.id ? (
                            <FiChevronUp className="text-gray-400" />
                          ) : (
                            <FiChevronDown className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                      {expandedCard === enquiry.id && (
                        <div className="overflow-hidden">
                          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Contact Details */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Details</h4>
                                <div className="space-y-2 text-sm">
                                  <p className="flex items-center gap-2">
                                    <FiUser className="text-gray-400" />
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">{enquiry.firstName} {enquiry.lastName}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <FiMail className="text-gray-400" />
                                    <span className="text-gray-600">Email:</span>
                                    <a href={`mailto:${enquiry.email}`} className="font-medium text-blue-600 hover:underline">{enquiry.email}</a>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <FiPhone className="text-gray-400" />
                                    <span className="text-gray-600">Phone:</span>
                                    <a href={`tel:${enquiry.phone}`} className="font-medium text-blue-600 hover:underline">{enquiry.phone}</a>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <FiBook className="text-gray-400" />
                                    <span className="text-gray-600">Interest:</span>
                                    <span className="font-medium">{enquiry.course || 'Not specified'}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <FiCalendar className="text-gray-400" />
                                    <span className="text-gray-600">Submitted:</span>
                                    <span className="font-medium">{formatDate(enquiry.submittedAt)}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Message */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Message</h4>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                  {enquiry.message || <span className="text-gray-400 italic">No message provided</span>}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm text-gray-600 font-medium">Update Status:</span>
                                <button
                                  onClick={() => updateStatus(enquiry.id, 'new')}
                                  disabled={updatingStatus === enquiry.id || enquiry.status === 'new'}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                    enquiry.status === 'new'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                  } disabled:opacity-50`}
                                >
                                  <FiInbox className="w-4 h-4" />
                                  New
                                </button>
                                <button
                                  onClick={() => updateStatus(enquiry.id, 'contacted')}
                                  disabled={updatingStatus === enquiry.id || enquiry.status === 'contacted'}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                    enquiry.status === 'contacted'
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                  } disabled:opacity-50`}
                                >
                                  <FiMessageCircle className="w-4 h-4" />
                                  Contacted
                                </button>
                                <button
                                  onClick={() => updateStatus(enquiry.id, 'resolved')}
                                  disabled={updatingStatus === enquiry.id || enquiry.status === 'resolved'}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                    enquiry.status === 'resolved'
                                      ? 'bg-green-600 text-white'
                                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                                  } disabled:opacity-50`}
                                >
                                  <FiCheckCircle className="w-4 h-4" />
                                  Resolved
                                </button>
                                {updatingStatus === enquiry.id && (
                                  <FiLoader className="animate-spin text-gray-400" />
                                )}
                              </div>
                              {/* Last Status Change Log */}
                              {enquiry.lastStatusChange && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <FiClock className="w-3 h-3" />
                                    Last status change: <span className="font-medium text-gray-700">{enquiry.lastStatusChange.changedBy}</span> → <span className="font-medium text-blue-600">{enquiry.lastStatusChange.newStatus?.charAt(0).toUpperCase() + enquiry.lastStatusChange.newStatus?.slice(1)}</span>
                                    {enquiry.lastStatusChange.changedAt && (
                                      <span className="text-gray-400 ml-1">
                                        ({formatDate(enquiry.lastStatusChange.changedAt)})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {/* Results count */}
          {filteredEnquiries.length > 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
            </p>
          )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ContactEnquiries;
