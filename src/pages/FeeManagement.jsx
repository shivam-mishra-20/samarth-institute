import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { USER_ROLES, ROLE_NAMES } from "../constants/roles";
import { classOptions } from "../data/subjectsData";
import {
  getBatchLabelForClass,
  isBatchRequiredForClass,
  normalizeBatchForClass,
} from "../utils/classBatchPolicy";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import * as XLSX from "xlsx";

const FEE_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
  OVERDUE: "overdue",
};

const FEE_STATUS_LABELS = {
  [FEE_STATUS.PENDING]: "Pending",
  [FEE_STATUS.PARTIAL]: "Partial Payment",
  [FEE_STATUS.PAID]: "Paid",
  [FEE_STATUS.OVERDUE]: "Overdue",
};

const FEE_STATUS_COLORS = {
  [FEE_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [FEE_STATUS.PARTIAL]: "bg-blue-100 text-blue-800",
  [FEE_STATUS.PAID]: "bg-green-100 text-green-800",
  [FEE_STATUS.OVERDUE]: "bg-red-100 text-red-800",
};

const FeeManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [students, setStudents] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchName, setSearchName] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);

  // Modal states
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFeeRecord, setSelectedFeeRecord] = useState(null);

  // Form states
  const [feeForm, setFeeForm] = useState({
    totalAmount: "",
    dueDate: "",
    description: "Tuition Fee",
    academicYear: new Date().getFullYear().toString(),
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    receiptNumber: "",
    notes: "",
  });

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filterBatchRequired = isBatchRequiredForClass(filterClass);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
      return;
    }
    fetchData();
  }, [isAdmin]);

  useEffect(() => {
    const batches = [...new Set(students.map((s) => s.batch).filter(Boolean))];
    setAvailableBatches(batches.sort());
  }, [students]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterClass, filterBatch, filterStatus, searchName]);

  useEffect(() => {
    if (!isBatchRequiredForClass(filterClass)) {
      setFilterBatch("");
    }
  }, [filterClass]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all students
      const studentsQuery = query(
        collection(db, "users"),
        where("role", "==", USER_ROLES.STUDENT),
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsList = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);

      // Fetch all fee records
      const feeSnapshot = await getDocs(collection(db, "fees"));
      const feeList = feeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeeRecords(feeList);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get fee record for a student
  const getStudentFeeRecord = (studentId) => {
    return feeRecords.find((f) => f.studentId === studentId);
  };

  // Calculate fee status based on payments
  const calculateFeeStatus = (feeRecord) => {
    if (!feeRecord) return null;

    const totalPaid =
      feeRecord.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalDue = feeRecord.totalAmount || 0;
    const dueDate = new Date(feeRecord.dueDate);
    const today = new Date();

    if (totalPaid >= totalDue) return FEE_STATUS.PAID;
    if (totalPaid > 0) return FEE_STATUS.PARTIAL;
    if (dueDate < today) return FEE_STATUS.OVERDUE;
    return FEE_STATUS.PENDING;
  };

  // Get combined student data with fee info
  const getStudentsWithFeeInfo = () => {
    return students.map((student) => {
      const feeRecord = getStudentFeeRecord(student.id);
      const totalPaid =
        feeRecord?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const totalDue = feeRecord?.totalAmount || 0;
      const balance = totalDue - totalPaid;
      const status = calculateFeeStatus(feeRecord);

      return {
        ...student,
        feeRecord,
        totalDue,
        totalPaid,
        balance,
        feeStatus: status,
      };
    });
  };

  // Filter students
  const getFilteredStudents = () => {
    return getStudentsWithFeeInfo().filter((s) => {
      if (filterClass && s.class !== filterClass) return false;
      if (filterBatchRequired && filterBatch && s.batch !== filterBatch)
        return false;
      if (filterStatus && s.feeStatus !== filterStatus) return false;
      if (
        searchName &&
        !s.name?.toLowerCase().includes(searchName.toLowerCase())
      )
        return false;
      return true;
    });
  };

  // Handle creating/updating fee record
  const handleSaveFee = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedStudent) return;

    try {
      const existingRecord = getStudentFeeRecord(selectedStudent.id);
      const feeData = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        studentClass: selectedStudent.class,
        studentBatch: normalizeBatchForClass(
          selectedStudent.class,
          selectedStudent.batch,
        ),
        customUid: selectedStudent.customUid,
        totalAmount: parseFloat(feeForm.totalAmount),
        dueDate: feeForm.dueDate,
        description: feeForm.description,
        academicYear: feeForm.academicYear,
        payments: existingRecord?.payments || [],
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid,
      };

      if (existingRecord) {
        await updateDoc(doc(db, "fees", existingRecord.id), feeData);
        setSuccess("Fee record updated successfully!");
      } else {
        feeData.createdAt = new Date().toISOString();
        feeData.createdBy = user.uid;
        await addDoc(collection(db, "fees"), feeData);
        setSuccess("Fee record created successfully!");
      }

      setShowFeeModal(false);
      setSelectedStudent(null);
      setFeeForm({
        totalAmount: "",
        dueDate: "",
        description: "Tuition Fee",
        academicYear: new Date().getFullYear().toString(),
      });
      fetchData();
    } catch (err) {
      setError(err.message || "Failed to save fee record");
      console.error(err);
    }
  };

  // Handle adding payment
  const handleAddPayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFeeRecord) return;

    const paymentAmount = parseFloat(paymentForm.amount);
    const totalPaid =
      selectedFeeRecord.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const remaining = selectedFeeRecord.totalAmount - totalPaid;

    if (paymentAmount > remaining) {
      setError(
        `Payment amount exceeds remaining balance of ₹${remaining.toLocaleString()}`,
      );
      return;
    }

    try {
      const newPayment = {
        id: Date.now().toString(),
        amount: paymentAmount,
        paymentDate: paymentForm.paymentDate,
        paymentMethod: paymentForm.paymentMethod,
        receiptNumber: paymentForm.receiptNumber || `RCP-${Date.now()}`,
        notes: paymentForm.notes,
        recordedAt: new Date().toISOString(),
        recordedBy: user.uid,
      };

      const updatedPayments = [
        ...(selectedFeeRecord.payments || []),
        newPayment,
      ];

      await updateDoc(doc(db, "fees", selectedFeeRecord.id), {
        payments: updatedPayments,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid,
      });

      setSuccess("Payment recorded successfully!");
      setShowPaymentModal(false);
      setSelectedFeeRecord(null);
      setPaymentForm({
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        receiptNumber: "",
        notes: "",
      });
      fetchData();
    } catch (err) {
      setError(err.message || "Failed to record payment");
      console.error(err);
    }
  };

  // Handle updating status manually
  const handleUpdateStatus = async (feeId, newStatus) => {
    try {
      await updateDoc(doc(db, "fees", feeId), {
        manualStatus: newStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid,
      });
      setSuccess("Status updated successfully!");
      fetchData();
    } catch (err) {
      setError(err.message || "Failed to update status");
      console.error(err);
    }
  };

  // Handle deleting a payment
  const handleDeletePayment = async (feeRecord, paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment record?"))
      return;

    try {
      const updatedPayments = feeRecord.payments.filter(
        (p) => p.id !== paymentId,
      );
      await updateDoc(doc(db, "fees", feeRecord.id), {
        payments: updatedPayments,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid,
      });
      setSuccess("Payment deleted successfully!");

      // Update the selected fee record in history modal
      setSelectedFeeRecord({
        ...feeRecord,
        payments: updatedPayments,
      });
      fetchData();
    } catch (err) {
      setError(err.message || "Failed to delete payment");
      console.error(err);
    }
  };

  // Export to Excel
  const handleExportToExcel = () => {
    const filteredStudents = getFilteredStudents();

    const exportData = filteredStudents.map((s) => ({
      "Student UID": s.customUid || "N/A",
      Name: s.name || "N/A",
      Class: s.class || "N/A",
      Batch: isBatchRequiredForClass(s.class) ? s.batch || "N/A" : "No Batch",
      "Total Due (₹)": s.totalDue,
      "Total Paid (₹)": s.totalPaid,
      "Balance (₹)": s.balance,
      Status: FEE_STATUS_LABELS[s.feeStatus] || "No Record",
      "Due Date": s.feeRecord?.dueDate || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Records");

    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `fee_records_${timestamp}.xlsx`);

    setSuccess(`Exported ${exportData.length} records to Excel`);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    const studentsWithFees = getStudentsWithFeeInfo();
    const totalDue = studentsWithFees.reduce((sum, s) => sum + s.totalDue, 0);
    const totalPaid = studentsWithFees.reduce((sum, s) => sum + s.totalPaid, 0);
    const totalBalance = totalDue - totalPaid;
    const paidCount = studentsWithFees.filter(
      (s) => s.feeStatus === FEE_STATUS.PAID,
    ).length;
    const partialCount = studentsWithFees.filter(
      (s) => s.feeStatus === FEE_STATUS.PARTIAL,
    ).length;
    const pendingCount = studentsWithFees.filter(
      (s) => s.feeStatus === FEE_STATUS.PENDING,
    ).length;
    const overdueCount = studentsWithFees.filter(
      (s) => s.feeStatus === FEE_STATUS.OVERDUE,
    ).length;

    return {
      totalDue,
      totalPaid,
      totalBalance,
      paidCount,
      partialCount,
      pendingCount,
      overdueCount,
    };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
          <Sidebar mobileTopBarMode="inline" />
          <div className="flex-1 pt-3 sm:pt-4 md:pt-28 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-gray-600">Loading fee records...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const stats = getSummaryStats();
  const filteredStudents = getFilteredStudents();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
        <Sidebar mobileTopBarMode="inline" />
        <div className="flex-1 pt-3 sm:pt-4 md:pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Fee Management
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage student fees, payments, and part payment plans
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleExportToExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
                <button
                  onClick={() => setError("")}
                  className="float-right font-bold"
                >
                  ×
                </button>
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
                <button
                  onClick={() => setSuccess("")}
                  className="float-right font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-xs text-gray-500 uppercase">Total Due</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{stats.totalDue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-xs text-gray-500 uppercase">
                  Total Collected
                </p>
                <p className="text-xl font-bold text-green-600">
                  ₹{stats.totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-xs text-gray-500 uppercase">Outstanding</p>
                <p className="text-xl font-bold text-red-600">
                  ₹{stats.totalBalance.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
                <p className="text-xs text-green-600 uppercase">Paid</p>
                <p className="text-xl font-bold text-green-700">
                  {stats.paidCount}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
                <p className="text-xs text-blue-600 uppercase">Partial</p>
                <p className="text-xl font-bold text-blue-700">
                  {stats.partialCount}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
                <p className="text-xs text-yellow-600 uppercase">Pending</p>
                <p className="text-xl font-bold text-yellow-700">
                  {stats.pendingCount}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
                <p className="text-xs text-red-600 uppercase">Overdue</p>
                <p className="text-xl font-bold text-red-700">
                  {stats.overdueCount}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg mb-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Classes</option>
                    {classOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getBatchLabelForClass(filterClass)}
                  </label>
                  <select
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                    disabled={!filterBatchRequired}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">
                      {filterBatchRequired
                        ? "All Batches"
                        : "Not required for this class"}
                    </option>
                    {availableBatches.map((batch) => (
                      <option key={batch} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(FEE_STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Name
                  </label>
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              {(filterClass || filterBatch || filterStatus || searchName) && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setFilterClass("");
                      setFilterBatch("");
                      setFilterStatus("");
                      setSearchName("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Students Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Class/Batch
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Total Due
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Paid
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No students found matching the filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {student.customUid || "—"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.class} | {isBatchRequiredForClass(student.class) ? (student.batch || "N/A") : "No Batch"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                          {student.totalDue > 0
                            ? `₹${student.totalDue.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                          {student.totalPaid > 0
                            ? `₹${student.totalPaid.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                          {student.balance > 0 ? (
                            <span className="text-red-600">
                              ₹{student.balance.toLocaleString()}
                            </span>
                          ) : student.totalDue > 0 ? (
                            <span className="text-green-600">₹0</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          {student.feeStatus ? (
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${FEE_STATUS_COLORS[student.feeStatus]}`}
                            >
                              {FEE_STATUS_LABELS[student.feeStatus]}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Fee Record
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-sm">
                          <div className="flex flex-col sm:flex-row sm:justify-end gap-1 sm:gap-0">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              const feeRecord = student.feeRecord;
                              if (feeRecord) {
                                setFeeForm({
                                  totalAmount: feeRecord.totalAmount.toString(),
                                  dueDate: feeRecord.dueDate,
                                  description:
                                    feeRecord.description || "Tuition Fee",
                                  academicYear:
                                    feeRecord.academicYear ||
                                    new Date().getFullYear().toString(),
                                });
                              } else {
                                setFeeForm({
                                  totalAmount: "",
                                  dueDate: "",
                                  description: "Tuition Fee",
                                  academicYear: new Date()
                                    .getFullYear()
                                    .toString(),
                                });
                              }
                              setShowFeeModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 sm:mr-3 whitespace-nowrap"
                          >
                            {student.feeRecord ? "Edit Fee" : "Set Fee"}
                          </button>
                          {student.feeRecord && student.balance > 0 && (
                            <button
                              onClick={() => {
                                setSelectedFeeRecord(student.feeRecord);
                                setPaymentForm({
                                  amount: "",
                                  paymentDate: new Date()
                                    .toISOString()
                                    .split("T")[0],
                                  paymentMethod: "cash",
                                  receiptNumber: "",
                                  notes: "",
                                });
                                setShowPaymentModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 sm:mr-3 whitespace-nowrap"
                            >
                              + Payment
                            </button>
                          )}
                          {student.feeRecord?.payments?.length > 0 && (
                            <button
                              onClick={() => {
                                setSelectedFeeRecord(student.feeRecord);
                                setShowHistoryModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                            >
                              History
                            </button>
                          )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredStudents.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredStudents.length}
            />
          </div>
        </div>

        {/* Set/Edit Fee Modal */}
        {showFeeModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-4 sm:pt-10 animate-fadeIn">
            <div className="relative mx-4 p-5 sm:p-6 w-full max-w-md shadow-2xl rounded-2xl bg-white border border-gray-100 animate-slideUp mb-4">
              <button
                onClick={() => {
                  setShowFeeModal(false);
                  setSelectedStudent(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedStudent.feeRecord
                      ? "Edit Fee Record"
                      : "Set Fee Record"}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">
                    Student:{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedStudent.name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {selectedStudent.customUid}
                  </p>
                </div>

                <form onSubmit={handleSaveFee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Fee Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={feeForm.totalAmount}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, totalAmount: e.target.value })
                      }
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={feeForm.dueDate}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={feeForm.description}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, description: e.target.value })
                      }
                      placeholder="e.g., Tuition Fee, Lab Fee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={feeForm.academicYear}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, academicYear: e.target.value })
                      }
                      placeholder="e.g., 2026"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFeeModal(false);
                        setSelectedStudent(null);
                      }}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                    >
                      Save Fee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Payment Modal */}
        {showPaymentModal && selectedFeeRecord && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-4 sm:pt-10 animate-fadeIn">
            <div className="relative mx-4 p-5 sm:p-6 w-full max-w-md shadow-2xl rounded-2xl bg-white border border-gray-100 animate-slideUp mb-4">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedFeeRecord(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Record Payment
                  </h3>
                </div>
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-600">
                    Student: <strong>{selectedFeeRecord.studentName}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Due:{" "}
                    <strong>
                      ₹{selectedFeeRecord.totalAmount?.toLocaleString()}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Already Paid:{" "}
                    <strong>
                      ₹
                      {(
                        selectedFeeRecord.payments?.reduce(
                          (sum, p) => sum + p.amount,
                          0,
                        ) || 0
                      ).toLocaleString()}
                    </strong>
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    Remaining: ₹
                    {(
                      selectedFeeRecord.totalAmount -
                      (selectedFeeRecord.payments?.reduce(
                        (sum, p) => sum + p.amount,
                        0,
                      ) || 0)
                    ).toLocaleString()}
                  </p>
                </div>

                <form onSubmit={handleAddPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={paymentForm.amount}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          amount: e.target.value,
                        })
                      }
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={paymentForm.paymentDate}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          paymentDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={paymentForm.paymentMethod}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                      <option value="card">Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Receipt Number (Optional)
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={paymentForm.receiptNumber}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          receiptNumber: e.target.value,
                        })
                      }
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes (Optional)
                    </label>
                    <textarea
                      rows="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={paymentForm.notes}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Any additional notes..."
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentModal(false);
                        setSelectedFeeRecord(null);
                      }}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-lg shadow-green-200 hover:shadow-green-300"
                    >
                      Record Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Modal */}
        {showHistoryModal && selectedFeeRecord && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-4 sm:pt-6 animate-fadeIn">
            <div className="relative mx-2 sm:mx-4 p-4 sm:p-6 w-full max-w-2xl shadow-2xl rounded-2xl bg-white border border-gray-100 animate-slideUp mb-4">
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSelectedFeeRecord(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Payment History
                  </h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Student</p>
                      <p className="font-semibold">
                        {selectedFeeRecord.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Total Fee
                      </p>
                      <p className="font-semibold">
                        ₹{selectedFeeRecord.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Total Paid
                      </p>
                      <p className="font-semibold text-green-600">
                        ₹
                        {(
                          selectedFeeRecord.payments?.reduce(
                            (sum, p) => sum + p.amount,
                            0,
                          ) || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Balance</p>
                      <p className="font-semibold text-red-600">
                        ₹
                        {(
                          selectedFeeRecord.totalAmount -
                          (selectedFeeRecord.payments?.reduce(
                            (sum, p) => sum + p.amount,
                            0,
                          ) || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Method
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Receipt #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Notes
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedFeeRecord.payments
                        ?.sort(
                          (a, b) =>
                            new Date(b.paymentDate) - new Date(a.paymentDate),
                        )
                        .map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {new Date(
                                payment.paymentDate,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-green-600">
                              ₹{payment.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">
                              {payment.paymentMethod?.replace("_", " ")}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 font-mono">
                              {payment.receiptNumber}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                              {payment.notes || "—"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                              <button
                                onClick={() =>
                                  handleDeletePayment(
                                    selectedFeeRecord,
                                    payment.id,
                                  )
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowHistoryModal(false);
                      setSelectedFeeRecord(null);
                    }}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FeeManagement;

