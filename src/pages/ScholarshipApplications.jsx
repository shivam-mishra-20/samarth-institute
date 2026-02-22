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
  FiBook,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";
import { Award, GraduationCap, Users } from "lucide-react";

const ScholarshipApplications = () => {
  const { userData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const classOptions = [
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11 - PCM",
    "Class 11 - PCB",
    "Class 12 - PCM",
    "Class 12 - PCB",
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
    {
      value: "test-scheduled",
      label: "Test Scheduled",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "test-completed",
      label: "Test Completed",
      color: "bg-cyan-100 text-cyan-800",
    },
    {
      value: "scholarship-awarded",
      label: "Scholarship Awarded",
      color: "bg-green-100 text-green-800",
    },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, classFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const applicationsQuery = query(
        collection(db, "scholarshipEnquiries"),
        orderBy("submittedAt", "desc")
      );
      const snapshot = await getDocs(applicationsQuery);
      const applicationsData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching scholarship applications:", error);
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
          app.parentName?.toLowerCase().includes(term) ||
          app.schoolName?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Class filter
    if (classFilter !== "all") {
      filtered = filtered.filter((app) => app.classSelected === classFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, classFilter]);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      const docRef = doc(db, "scholarshipEnquiries", applicationId);
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
          app.id === applicationId ? { ...app, ...statusChangeData } : app
        )
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
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
                    <Award className="w-8 h-8 text-blue-600" />
                    Scholarship Applications
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Review and manage scholarship test registrations
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500 opacity-50" />
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
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Test Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((a) => a.status === "test-scheduled").length}
                    </p>
                  </div>
                  <FiBook className="w-8 h-8 text-indigo-500 opacity-50" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Awarded</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((a) => a.status === "scholarship-awarded").length}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-green-500 opacity-50" />
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
                    placeholder="Search by name, email, phone, school..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                {/* Class Filter */}
                <div className="sm:w-48">
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="all">All Classes</option>
                      {classOptions.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
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
                Showing {paginatedApplications.length} of{" "}
                {filteredApplications.length} applications
                {filteredApplications.length !== applications.length && (
                  <span className="text-gray-400">
                    {" "}
                    (filtered from {applications.length} total)
                  </span>
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
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No applications found
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm || statusFilter !== "all" || classFilter !== "all"
                      ? "Try adjusting your filters"
                      : "New scholarship applications will appear here"}
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
                          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
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
                              <span className="flex items-center gap-1 text-blue-600 font-medium">
                                <GraduationCap className="w-4 h-4" />
                                {application.classSelected}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          {getStatusBadge(application.status)}
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1.5">
                            <FiCalendar className="w-4 h-4 text-blue-600" />
                            {formatDate(application.submittedAt)}
                          </span>
                          {expandedId === application.id ? (
                            <FiChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === application.id && (
                      <div className="px-4 sm:px-6 pb-6 border-t border-gray-100 pt-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Student Information */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              <FiUser className="w-4 h-4 text-blue-600" />
                              Student Information
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">
                                  Full Name
                                </span>
                                <span className="font-medium text-gray-800">
                                  {application.firstName} {application.lastName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">
                                  Email
                                </span>
                                <span className="font-medium text-gray-800">
                                  {application.email}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">
                                  Phone
                                </span>
                                <span className="font-medium text-gray-800">
                                  {application.phone}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">
                                  Class Applied
                                </span>
                                <span className="font-medium text-blue-600">
                                  {application.classSelected}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Additional Information */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              <FiHome className="w-4 h-4 text-blue-600" />
                              Additional Information
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">
                                  Parent Name
                                </span>
                                <span className="font-medium text-gray-800">
                                  {application.parentName || "Not provided"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">
                                  School
                                </span>
                                <span className="font-medium text-gray-800">
                                  {application.schoolName || "Not provided"}
                                </span>
                              </div>
                              {application.testDate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 text-sm">
                                    Test Date
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {application.testDate}
                                  </span>
                                </div>
                              )}
                              {application.branch && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500 text-sm">
                                    Branch
                                  </span>
                                  <span className="font-medium text-gray-800 capitalize">
                                    {application.branch}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">
                                  Applied On
                                </span>
                                <span className="font-medium text-gray-800">
                                  {formatDate(application.submittedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Update */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Status
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() =>
                                  updateApplicationStatus(
                                    application.id,
                                    opt.value
                                  )
                                }
                                disabled={
                                  updatingStatus === application.id ||
                                  application.status === opt.value
                                }
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  application.status === opt.value
                                    ? `${opt.color} ring-2 ring-offset-1 ring-blue-400`
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {updatingStatus === application.id &&
                                application.status !== opt.value ? (
                                  <span className="flex items-center gap-1">
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                  </span>
                                ) : (
                                  opt.label
                                )}
                              </button>
                            ))}
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

                        {/* Quick Actions */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          <a
                            href={`tel:${application.phone}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <FiPhone className="w-4 h-4" />
                            Call Student
                          </a>
                          <a
                            href={`mailto:${application.email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <FiMail className="w-4 h-4" />
                            Send Email
                          </a>
                          <a
                            href={`https://wa.me/91${application.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>
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
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronRight className="w-5 h-5" />
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

export default ScholarshipApplications;
