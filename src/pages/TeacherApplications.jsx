import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBook,
  FiBriefcase,
  FiFileText,
  FiCalendar,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { GraduationCap } from "lucide-react";

const TeacherApplications = () => {
  const { userData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const subjectOptions = [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "English",
    "Hindi",
    "Social Science",
    "Computer Science",
  ];

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "reviewed",
      label: "Reviewed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "contacted",
      label: "Contacted",
      color: "bg-purple-100 text-purple-800",
    },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
    { value: "hired", label: "Hired", color: "bg-green-100 text-green-800" },
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subjectFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const applicationsQuery = query(
        collection(db, "teacherEnquiries"),
        orderBy("appliedOn", "desc"),
      );
      const snapshot = await getDocs(applicationsQuery);
      const applicationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        appliedOn: doc.data().appliedOn?.toDate?.() || new Date(),
      }));
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = useCallback(() => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.firstName?.toLowerCase().includes(term) ||
          app.lastName?.toLowerCase().includes(term) ||
          app.email?.toLowerCase().includes(term) ||
          app.phone?.includes(term) ||
          app.subjects?.some((s) => s.toLowerCase().includes(term)),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((app) =>
        app.subjects?.includes(subjectFilter),
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, subjectFilter]);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      const docRef = doc(db, "teacherEnquiries", applicationId);
      const statusChangeData = {
        status: newStatus,
        lastStatusChange: {
          changedBy: userData?.name || userData?.email || 'Unknown',
          changedAt: Timestamp.now(),
          newStatus: newStatus
        }
      };
      await updateDoc(docRef, statusChangeData);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, ...statusChangeData } : app,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    const option =
      statusOptions.find((opt) => opt.value === status) || statusOptions[0];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${option.color}`}
      >
        {option.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                    Teacher Applications
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Review and manage teacher applications
                  </p>
                </div>
                <button
                  onClick={fetchApplications}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                  <FiUser className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((a) => a.status === "pending").length}
                    </p>
                  </div>
                  <FiCalendar className="w-8 h-8 text-yellow-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Contacted</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((a) => a.status === "contacted").length}
                    </p>
                  </div>
                  <FiPhone className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Hired</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((a) => a.status === "hired").length}
                    </p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((a) => a.status === "rejected").length}
                    </p>
                  </div>
                  <FiBriefcase className="w-8 h-8 text-red-500 opacity-50" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg mb-6 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                {/* Subject Filter */}
                <div className="sm:w-48">
                  <div className="relative">
                    <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="all">All Subjects</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="sm:w-48">
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="all">All Status</option>
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-3 text-sm text-gray-500">
                Showing {paginatedApplications.length} of {filteredApplications.length}{" "}
                applications
                {filteredApplications.length !== applications.length && (
                  <span className="text-gray-400"> (filtered from {applications.length} total)</span>
                )}
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No applications found
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "New applications will appear here"}
                  </p>
                </div>
              ) : (
                paginatedApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white shadow rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Card Header - Always Visible */}
                    <div
                      className="p-4 sm:p-6 cursor-pointer"
                      onClick={() => toggleExpand(application.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {application.firstName?.[0]?.toUpperCase()}
                            {application.lastName?.[0]?.toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {application.firstName} {application.lastName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiMail className="w-4 h-4" />
                                {application.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiPhone className="w-4 h-4" />
                                {application.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          {getStatusBadge(application.status)}
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1.5">
                            <FiCalendar className="w-4 h-4 text-blue-600" />
                            {formatDate(application.appliedOn)}
                          </span>
                          {expandedId === application.id ? (
                            <FiChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Quick Info Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {application.subjects
                          ?.slice(0, 3)
                          .map((subject, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                            >
                              {subject}
                            </span>
                          ))}
                        {application.subjects?.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            +{application.subjects.length - 3} more
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                          <FiBriefcase className="w-3 h-3 mr-1" />
                          {application.experience}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === application.id && (
                      <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Personal & Contact */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <FiUser className="w-4 h-4 text-blue-600" />
                              Contact Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center gap-2 text-gray-600">
                                <FiMail className="w-4 h-4 text-gray-400" />
                                {application.email}
                              </p>
                              <p className="flex items-center gap-2 text-gray-600">
                                <FiPhone className="w-4 h-4 text-gray-400" />
                                {application.phone}
                              </p>
                              {application.alternatePhone && (
                                <p className="flex items-center gap-2 text-gray-600">
                                  <FiPhone className="w-4 h-4 text-gray-400" />
                                  Alt: {application.alternatePhone}
                                </p>
                              )}
                              <p className="flex items-start gap-2 text-gray-600">
                                <FiMapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                                <span>
                                  {application.address}, {application.city}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Education */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-blue-600" />
                              Education
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">
                                  Qualification:
                                </span>{" "}
                                {application.qualification}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Specialization:
                                </span>{" "}
                                {application.specialization}
                              </p>
                            </div>
                          </div>

                          {/* Experience */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <FiBriefcase className="w-4 h-4 text-blue-600" />
                              Experience
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Experience:</span>{" "}
                                {application.experience}
                              </p>
                              {application.currentlyTeaching && (
                                <p>
                                  <span className="font-medium">
                                    Currently at:
                                  </span>{" "}
                                  {application.currentlyTeaching}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Subjects & Classes */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <FiBook className="w-4 h-4 text-blue-600" />
                              Teaching Preferences
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                  Subjects:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {application.subjects?.map((subject, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                    >
                                      {subject}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                  Preferred Classes:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {application.preferredClasses?.map(
                                    (cls, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs"
                                      >
                                        {cls}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* About */}
                          {application.aboutYourself && (
                            <div className="md:col-span-2">
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FiFileText className="w-4 h-4 text-blue-600" />
                                About
                              </h4>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                                {application.aboutYourself}
                              </p>
                            </div>
                          )}

                          {/* Resume Link */}
                          {application.resumeLink && (
                            <div className="md:col-span-2">
                              <a
                                href={application.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                <FiExternalLink className="w-4 h-4" />
                                View Resume/CV
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Status Update */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                              Update Status:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {statusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateApplicationStatus(
                                      application.id,
                                      option.value,
                                    );
                                  }}
                                  disabled={updatingStatus === application.id}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    application.status === option.value
                                      ? `${option.color} ring-2 ring-offset-1 ring-current`
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  } ${updatingStatus === application.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Last Status Change Log */}
                          {application.lastStatusChange && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <FiCalendar className="w-3 h-3" />
                                Last status change: <span className="font-medium text-gray-700">{application.lastStatusChange.changedBy}</span> → <span className="font-medium text-blue-600">{application.lastStatusChange.newStatus?.charAt(0).toUpperCase() + application.lastStatusChange.newStatus?.slice(1)}</span>
                                {application.lastStatusChange.changedAt && (
                                  <span className="text-gray-400 ml-1">
                                    ({formatDate(application.lastStatusChange.changedAt?.toDate ? application.lastStatusChange.changedAt.toDate() : application.lastStatusChange.changedAt)})
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 bg-white shadow rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        })
                        .map((page, idx, arr) => (
                          <span key={page} className="flex items-center">
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          </span>
                        ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TeacherApplications;
