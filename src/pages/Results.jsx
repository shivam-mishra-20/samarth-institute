import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { USER_ROLES } from "../constants/roles";
import { subjectsByClass, classOptions, examTypes } from "../data/subjectsData";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import * as XLSX from "xlsx";

const Results = () => {
  const { user, userData, isAdmin, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState("single"); // 'single', 'bulk', or 'view'

  // Form state - Single Upload
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [examDate, setExamDate] = useState("");

  // Form state - Bulk Upload
  const [bulkClass, setBulkClass] = useState("");
  const [bulkBatch, setBulkBatch] = useState("");
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkExamType, setBulkExamType] = useState("");
  const [bulkMaxMarks, setBulkMaxMarks] = useState("100");
  const [bulkExamDate, setBulkExamDate] = useState("");
  const [bulkStudents, setBulkStudents] = useState([]);
  const [bulkMarks, setBulkMarks] = useState({});

  // Form state - View Results
  const [searchClass, setSearchClass] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [searchBatches, setSearchBatches] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [editMarks, setEditMarks] = useState("");
  const [editMaxMarks, setEditMaxMarks] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Student-specific state
  const [studentResults, setStudentResults] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentFilterDate, setStudentFilterDate] = useState("");
  const [studentFilterExamType, setStudentFilterExamType] = useState("");
  const [studentFilterSubject, setStudentFilterSubject] = useState("");

  // Data state
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination state
  const [studentResultsPage, setStudentResultsPage] = useState(1);
  const [searchResultsPage, setSearchResultsPage] = useState(1);
  const [recentResultsPage, setRecentResultsPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all unique classes and batches from student records
  useEffect(() => {
    // Only fetch for teachers/admins
    if (isStudent) return;

    const fetchClassesAndBatches = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", USER_ROLES.STUDENT));
        const snapshot = await getDocs(q);

        const classesSet = new Set();
        const batchesSet = new Set();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.class) classesSet.add(data.class);
          if (data.batch) batchesSet.add(data.batch);
        });

        // Convert class values to label format
        const classesArray = Array.from(classesSet).map((classValue) => {
          const classOption = classOptions.find(
            (opt) => opt.value === classValue,
          );
          return {
            value: classValue,
            label: classOption ? classOption.label : classValue,
          };
        });

        setAvailableClasses(
          classesArray.sort((a, b) => a.label.localeCompare(b.label)),
        );
        setAvailableBatches(Array.from(batchesSet).sort());
      } catch (err) {
        console.error("Error fetching classes and batches:", err);
      }
    };

    fetchClassesAndBatches();
  }, []);

  // Authorization check
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin && !isTeacher && !isStudent) {
      navigate("/unauthorized");
    }
  }, [user, isAdmin, isTeacher, isStudent, navigate]);

  // Fetch student's own results
  useEffect(() => {
    if (!isStudent || !user || !userData) return;

    const fetchStudentResults = async () => {
      setStudentLoading(true);
      try {
        const resultsRef = collection(db, "results");
        const q = query(
          resultsRef,
          where("studentName", "==", userData.name),
          where("class", "==", userData.class),
          where("batch", "==", userData.batch),
        );
        const snapshot = await getDocs(q);

        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by exam date (most recent first), then by subject
        results.sort((a, b) => {
          const dateCompare = new Date(b.examDate) - new Date(a.examDate);
          if (dateCompare !== 0) return dateCompare;
          return a.subject.localeCompare(b.subject);
        });

        setStudentResults(results);
      } catch (error) {
        console.error("Error fetching student results:", error);
        setError("Failed to load your results. Please try again.");
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudentResults();
  }, [isStudent, user, userData]);

  // Fetch batches for selected class
  useEffect(() => {
    if (selectedClass) {
      fetchBatchesForClass(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (bulkClass) {
      fetchBatchesForClass(bulkClass, true);
    }
  }, [bulkClass]);

  useEffect(() => {
    if (searchClass) {
      fetchBatchesForClass(searchClass, false, true);
    }
  }, [searchClass]);

  // Fetch students for selected class and batch
  useEffect(() => {
    if (selectedClass && selectedBatch) {
      fetchStudents(selectedClass, selectedBatch);
    }
  }, [selectedClass, selectedBatch]);

  useEffect(() => {
    if (bulkClass && bulkBatch) {
      fetchStudents(bulkClass, bulkBatch, true);
    }
  }, [bulkClass, bulkBatch]);

  // Fetch recent results on mount
  useEffect(() => {
    fetchRecentResults();
  }, []);

  const fetchBatchesForClass = async (
    classValue,
    isBulk = false,
    isSearch = false,
  ) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("role", "==", USER_ROLES.STUDENT),
        where("class", "==", classValue),
      );
      const snapshot = await getDocs(q);

      const uniqueBatches = [
        ...new Set(
          snapshot.docs.map((doc) => doc.data().batch).filter(Boolean),
        ),
      ];

      if (isSearch) {
        setSearchBatches(uniqueBatches.sort());
      } else if (isBulk) {
        setBatches(uniqueBatches.sort());
      } else {
        setBatches(uniqueBatches.sort());
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to fetch batches");
    }
  };

  const fetchStudents = async (classValue, batch, isBulk = false) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("role", "==", USER_ROLES.STUDENT),
        where("class", "==", classValue),
        where("batch", "==", batch),
      );
      const snapshot = await getDocs(q);

      const studentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || doc.data().email,
        email: doc.data().email,
        ...doc.data(),
      }));

      if (isBulk) {
        setBulkStudents(studentsList);
        // Initialize bulk marks object
        const initialMarks = {};
        studentsList.forEach((student) => {
          initialMarks[student.id] = "";
        });
        setBulkMarks(initialMarks);
      } else {
        setStudents(studentsList);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students");
    }
  };

  const fetchRecentResults = async () => {
    try {
      const resultsRef = collection(db, "results");
      const q = query(resultsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const results = snapshot.docs.slice(0, 10).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecentResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !selectedClass ||
      !selectedBatch ||
      !selectedStudent ||
      !selectedSubject ||
      !examType ||
      !marks ||
      !maxMarks ||
      !examDate
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (parseFloat(marks) > parseFloat(maxMarks)) {
      setError("Marks cannot exceed maximum marks");
      return;
    }

    setLoading(true);

    try {
      const student = students.find((s) => s.id === selectedStudent);

      // Create custom document ID: name_class_batch_subject_date_examtype
      const sanitize = (str) =>
        str.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
      const customDocId = `${sanitize(student.name)}_${sanitize(selectedClass)}_${sanitize(selectedBatch)}_${sanitize(selectedSubject)}_${examDate}_${sanitize(examType)}`;

      const resultData = {
        studentName: student.name,
        studentEmail: student.email,
        class: selectedClass,
        batch: selectedBatch,
        subject: selectedSubject,
        examType: examType,
        marks: parseFloat(marks),
        maxMarks: parseFloat(maxMarks),
        percentage: ((parseFloat(marks) / parseFloat(maxMarks)) * 100).toFixed(
          2,
        ),
        examDate: examDate,
        uploadedBy: user.uid,
        uploadedByName: userData?.name || userData?.email || user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "results", customDocId), resultData);

      setSuccess("Result uploaded successfully!");

      // Reset form
      setSelectedStudent("");
      setSelectedSubject("");
      setExamType("");
      setMarks("");
      setExamDate("");

      // Refresh recent results
      fetchRecentResults();
    } catch (err) {
      console.error("Error uploading result:", err);
      setError("Failed to upload result. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !bulkClass ||
      !bulkBatch ||
      !bulkSubject ||
      !bulkExamType ||
      !bulkMaxMarks ||
      !bulkExamDate
    ) {
      setError("Please fill all required fields");
      return;
    }

    // Check if at least one student has marks entered
    const hasMarks = Object.values(bulkMarks).some((mark) => mark !== "");
    if (!hasMarks) {
      setError("Please enter marks for at least one student");
      return;
    }

    // Validate marks don't exceed max marks
    const invalidMarks = Object.values(bulkMarks).some(
      (mark) => mark !== "" && parseFloat(mark) > parseFloat(bulkMaxMarks),
    );
    if (invalidMarks) {
      setError("Some marks exceed the maximum marks");
      return;
    }

    setLoading(true);

    try {
      const resultsToUpload = [];
      const sanitize = (str) =>
        str.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");

      for (const student of bulkStudents) {
        const studentMarks = bulkMarks[student.id];

        if (studentMarks !== "" && studentMarks !== null) {
          // Create custom document ID: name_class_batch_subject_date_examtype
          const customDocId = `${sanitize(student.name)}_${sanitize(bulkClass)}_${sanitize(bulkBatch)}_${sanitize(bulkSubject)}_${bulkExamDate}_${sanitize(bulkExamType)}`;

          const resultData = {
            studentName: student.name,
            studentEmail: student.email,
            class: bulkClass,
            batch: bulkBatch,
            subject: bulkSubject,
            examType: bulkExamType,
            marks: parseFloat(studentMarks),
            maxMarks: parseFloat(bulkMaxMarks),
            percentage: (
              (parseFloat(studentMarks) / parseFloat(bulkMaxMarks)) *
              100
            ).toFixed(2),
            examDate: bulkExamDate,
            uploadedBy: user.uid,
            uploadedByName: userData?.name || userData?.email || user.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          resultsToUpload.push({ docId: customDocId, data: resultData });
        }
      }

      // Upload all results
      for (const result of resultsToUpload) {
        await setDoc(doc(db, "results", result.docId), result.data);
      }

      setSuccess(
        `Successfully uploaded results for ${resultsToUpload.length} student(s)!`,
      );

      // Reset bulk form
      setBulkSubject("");
      setBulkExamType("");
      setBulkExamDate("");
      const initialMarks = {};
      bulkStudents.forEach((student) => {
        initialMarks[student.id] = "";
      });
      setBulkMarks(initialMarks);

      // Refresh recent results
      fetchRecentResults();
    } catch (err) {
      console.error("Error uploading bulk results:", err);
      setError("Failed to upload results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMarkChange = (studentId, value) => {
    setBulkMarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSearchResults = async () => {
    if (!searchClass || !searchBatch) {
      setError("Please select both class and batch to search");
      return;
    }

    setSearchLoading(true);
    setError("");

    try {
      const resultsRef = collection(db, "results");
      const q = query(
        resultsRef,
        where("class", "==", searchClass),
        where("batch", "==", searchBatch),
      );
      const snapshot = await getDocs(q);

      let results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply additional filters
      if (searchStudent) {
        results = results.filter((r) =>
          r.studentName.toLowerCase().includes(searchStudent.toLowerCase()),
        );
      }

      if (searchSubject) {
        results = results.filter((r) => r.subject === searchSubject);
      }

      // Sort by subject, then by examType
      results.sort((a, b) => {
        if (a.subject !== b.subject) {
          return a.subject.localeCompare(b.subject);
        }
        return a.examType.localeCompare(b.examType);
      });

      setSearchResults(results);
    } catch (err) {
      console.error("Error searching results:", err);
      setError("Failed to search results. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEditResult = (result) => {
    setEditingResult(result);
    setEditMarks(result.marks.toString());
    setEditMaxMarks(result.maxMarks.toString());
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editMarks || !editMaxMarks) {
      setError("Please enter both marks and maximum marks");
      return;
    }

    if (parseFloat(editMarks) > parseFloat(editMaxMarks)) {
      setError("Marks cannot exceed maximum marks");
      return;
    }

    setEditLoading(true);
    setError("");

    try {
      const resultRef = doc(db, "results", editingResult.id);
      const updatedData = {
        marks: parseFloat(editMarks),
        maxMarks: parseFloat(editMaxMarks),
        percentage: (
          (parseFloat(editMarks) / parseFloat(editMaxMarks)) *
          100
        ).toFixed(2),
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user.uid,
        lastUpdatedByName: userData?.name || userData?.email || user.email,
      };

      await updateDoc(resultRef, updatedData);

      // Update local state
      setSearchResults((prev) =>
        prev.map((r) =>
          r.id === editingResult.id ? { ...r, ...updatedData } : r,
        ),
      );

      setSuccess(
        `Result updated successfully for ${editingResult.studentName}!`,
      );
      setEditModalOpen(false);
      setEditingResult(null);
    } catch (err) {
      console.error("Error updating result:", err);
      setError("Failed to update result. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditingResult(null);
    setEditMarks("");
    setEditMaxMarks("");
    setError("");
  };

  const handleDeleteResult = async (result) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the result for ${result.studentName} in ${result.subject} (${result.examType})?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "results", result.id));

      // Update local state
      setSearchResults((prev) => prev.filter((r) => r.id !== result.id));

      setSuccess(`Result deleted successfully for ${result.studentName}!`);
    } catch (err) {
      console.error("Error deleting result:", err);
      setError("Failed to delete result. Please try again.");
    }
  };

  if (!user || (!isAdmin && !isTeacher && !isStudent)) {
    return null;
  }

  // Filter student results based on selected filters
  const getFilteredStudentResults = () => {
    let filtered = [...studentResults];

    if (studentFilterDate) {
      filtered = filtered.filter(
        (result) => result.examDate === studentFilterDate,
      );
    }

    if (studentFilterExamType) {
      filtered = filtered.filter(
        (result) => result.examType === studentFilterExamType,
      );
    }

    if (studentFilterSubject) {
      filtered = filtered.filter(
        (result) => result.subject === studentFilterSubject,
      );
    }

    return filtered;
  };

  const filteredStudentResults = getFilteredStudentResults();

  // Get unique values for filter dropdowns
  const studentSubjects = [
    ...new Set(studentResults.map((r) => r.subject)),
  ].sort();
  const studentExamTypes = [
    ...new Set(studentResults.map((r) => r.examType)),
  ].sort();

  // Export student results to Excel
  const handleExportStudentResults = () => {
    const dataToExport = filteredStudentResults;

    // Prepare data for export
    const exportData = dataToExport.map((result) => ({
      "Exam Date": new Date(result.examDate).toLocaleDateString(),
      "Subject": result.subject,
      "Exam Type": result.examType,
      "Marks Obtained": result.marks,
      "Total Marks": result.maxMarks,
      "Percentage": `${((result.marks / result.maxMarks) * 100).toFixed(2)}%`,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Exam Date
      { wch: 20 }, // Subject
      { wch: 15 }, // Exam Type
      { wch: 15 }, // Marks Obtained
      { wch: 15 }, // Total Marks
      { wch: 12 }, // Percentage
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Results");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `my_results_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  };

  // Export search results to Excel (for admin/teacher)
  const handleExportSearchResults = () => {
    const dataToExport = searchResults;

    // Prepare data for export
    const exportData = dataToExport.map((result) => ({
      "Student Name": result.studentName,
      "Class": result.class,
      "Batch": result.batch,
      "Subject": result.subject,
      "Exam Type": result.examType,
      "Exam Date": new Date(result.examDate).toLocaleDateString(),
      "Marks Obtained": result.marks,
      "Total Marks": result.maxMarks,
      "Percentage": `${((result.marks / result.maxMarks) * 100).toFixed(2)}%`,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
      { wch: 20 }, // Student Name
      { wch: 12 }, // Class
      { wch: 12 }, // Batch
      { wch: 20 }, // Subject
      { wch: 15 }, // Exam Type
      { wch: 15 }, // Exam Date
      { wch: 15 }, // Marks Obtained
      { wch: 15 }, // Total Marks
      { wch: 12 }, // Percentage
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `results_export_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  };

  // Student View
  if (isStudent) {
    return (
      <>
        <Navbar />
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
                <p className="mt-2 text-sm text-gray-700">
                  View all your examination results
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Filter section */}
              {!studentLoading && studentResults.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Filter Results
                    </h2>
                    <button
                      onClick={handleExportStudentResults}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
                      Export to Excel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Date Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Date
                      </label>
                      <input
                        type="date"
                        value={studentFilterDate}
                        onChange={(e) => setStudentFilterDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Exam Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Type
                      </label>
                      <select
                        value={studentFilterExamType}
                        onChange={(e) =>
                          setStudentFilterExamType(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All Types</option>
                        {studentExamTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        value={studentFilterSubject}
                        onChange={(e) =>
                          setStudentFilterSubject(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All Subjects</option>
                        {studentSubjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setStudentFilterDate("");
                          setStudentFilterExamType("");
                          setStudentFilterSubject("");
                        }}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(studentFilterDate ||
                    studentFilterExamType ||
                    studentFilterSubject) && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Active filters:</span>
                      {studentFilterDate && (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          Date:{" "}
                          {new Date(studentFilterDate).toLocaleDateString()}
                        </span>
                      )}
                      {studentFilterExamType && (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          Type: {studentFilterExamType}
                        </span>
                      )}
                      {studentFilterSubject && (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          Subject: {studentFilterSubject}
                        </span>
                      )}
                      <span className="text-gray-500">
                        ({filteredStudentResults.length} of{" "}
                        {studentResults.length} results)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Results Card */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {studentLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">
                      Loading your results...
                    </p>
                  </div>
                ) : studentResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No results available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your examination results will appear here once they are
                      uploaded by your teacher.
                    </p>
                  </div>
                ) : filteredStudentResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No results match your filters
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your filters to see more results.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Exam Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marks Obtained
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Maximum Marks
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(() => {
                          const startIndex = (studentResultsPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const paginatedResults = filteredStudentResults.slice(startIndex, endIndex);
                          
                          return paginatedResults.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.examType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(result.examDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.marks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.maxMarks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  result.percentage >= 75
                                    ? "bg-green-100 text-green-800"
                                    : result.percentage >= 50
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {result.percentage}%
                              </span>
                            </td>
                          </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}
                {filteredStudentResults.length > 0 && (
                  <Pagination
                    currentPage={studentResultsPage}
                    totalPages={Math.ceil(filteredStudentResults.length / itemsPerPage)}
                    onPageChange={setStudentResultsPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredStudentResults.length}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Teacher/Admin View
  return (
    <>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Results Management
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Upload and manage student results
              </p>
            </div>

            {/* Success/Error Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("single")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "single"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Single Student Upload
                  </button>
                  <button
                    onClick={() => setActiveTab("bulk")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "bulk"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Bulk Upload
                  </button>
                  <button
                    onClick={() => setActiveTab("view")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "view"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    View Results
                  </button>
                </nav>
              </div>

              {/* Single Upload Form */}
              {activeTab === "single" && (
                <div className="p-6">
                  <form onSubmit={handleSingleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Class Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedClass}
                          onChange={(e) => {
                            setSelectedClass(e.target.value);
                            setSelectedBatch("");
                            setSelectedStudent("");
                            setSelectedSubject("");
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Select Class</option>
                          {availableClasses.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Batch Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batch <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedBatch}
                          onChange={(e) => {
                            setSelectedBatch(e.target.value);
                            setSelectedStudent("");
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!selectedClass}
                          required
                        >
                          <option value="">Select Batch</option>
                          {batches.map((batch) => (
                            <option key={batch} value={batch}>
                              {batch}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Student Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedStudent}
                          onChange={(e) => setSelectedStudent(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!selectedBatch}
                          required
                        >
                          <option value="">Select Student</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!selectedClass}
                          required
                        >
                          <option value="">Select Subject</option>
                          {selectedClass &&
                            subjectsByClass[selectedClass]?.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Exam Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Exam Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={examType}
                          onChange={(e) => setExamType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Select Exam Type</option>
                          {examTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Exam Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Exam Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={examDate}
                          onChange={(e) => setExamDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      {/* Marks */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marks Obtained <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={marks}
                          onChange={(e) => setMarks(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter marks"
                          required
                        />
                      </div>

                      {/* Max Marks */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Marks <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxMarks}
                          onChange={(e) => setMaxMarks(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter maximum marks"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Uploading..." : "Upload Result"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Bulk Upload Form */}
              {activeTab === "bulk" && (
                <div className="p-6">
                  <form onSubmit={handleBulkSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Class Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bulkClass}
                          onChange={(e) => {
                            setBulkClass(e.target.value);
                            setBulkBatch("");
                            setBulkSubject("");
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Select Class</option>
                          {availableClasses.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Batch Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batch <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bulkBatch}
                          onChange={(e) => setBulkBatch(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!bulkClass}
                          required
                        >
                          <option value="">Select Batch</option>
                          {batches.map((batch) => (
                            <option key={batch} value={batch}>
                              {batch}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bulkSubject}
                          onChange={(e) => setBulkSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!bulkClass}
                          required
                        >
                          <option value="">Select Subject</option>
                          {bulkClass &&
                            subjectsByClass[bulkClass]?.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Exam Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Exam Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bulkExamType}
                          onChange={(e) => setBulkExamType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Select Exam Type</option>
                          {examTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Exam Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Exam Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={bulkExamDate}
                          onChange={(e) => setBulkExamDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      {/* Max Marks */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Marks <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={bulkMaxMarks}
                          onChange={(e) => setBulkMaxMarks(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter maximum marks"
                          required
                        />
                      </div>
                    </div>

                    {/* Students List */}
                    {bulkStudents.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Enter Marks for Students
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  S.No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Student Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Marks Obtained
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {bulkStudents.map((student, index) => (
                                <tr
                                  key={student.id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {index + 1}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {student.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      max={bulkMaxMarks}
                                      value={bulkMarks[student.id] || ""}
                                      onChange={(e) =>
                                        handleBulkMarkChange(
                                          student.id,
                                          e.target.value,
                                        )
                                      }
                                      className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      placeholder="0"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {bulkStudents.length === 0 && bulkBatch && (
                      <div className="text-center py-8 text-gray-500">
                        No students found for the selected class and batch.
                      </div>
                    )}

                    {bulkStudents.length > 0 && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Uploading..." : "Upload Results"}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* View Results Tab */}
              {activeTab === "view" && (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Search Results
                      </h3>
                      {searchResults.length > 0 && (
                        <button
                          onClick={handleExportSearchResults}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
                          Export to Excel
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Class Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Class <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={searchClass}
                          onChange={(e) => {
                            setSearchClass(e.target.value);
                            setSearchBatch("");
                            setSearchBatches([]);
                            setSearchResults([]);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Class</option>
                          {availableClasses.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Batch Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batch <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={searchBatch}
                          onChange={(e) => {
                            setSearchBatch(e.target.value);
                            setSearchResults([]);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!searchClass}
                        >
                          <option value="">Select Batch</option>
                          {searchBatches.map((batch) => (
                            <option key={batch} value={batch}>
                              {batch}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Student Name Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student Name
                        </label>
                        <input
                          type="text"
                          value={searchStudent}
                          onChange={(e) => setSearchStudent(e.target.value)}
                          placeholder="Search by name..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {/* Subject Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <select
                          value={searchSubject}
                          onChange={(e) => setSearchSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={!searchClass}
                        >
                          <option value="">All Subjects</option>
                          {searchClass &&
                            subjectsByClass[searchClass]?.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Search Button */}
                      <div className="flex items-end gap-2">
                        <button
                          onClick={handleSearchResults}
                          disabled={
                            searchLoading || !searchClass || !searchBatch
                          }
                          className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {searchLoading ? "Searching..." : "Search"}
                        </button>
                        {searchResults.length > 0 && (
                          <button
                            onClick={() => {
                              setSearchResults([]);
                              setSearchStudent("");
                              setSearchSubject("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            title="Clear results"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Search Results Table */}
                  {searchResults.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <div className="mb-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Results for {searchClass} - {searchBatch} (
                            {searchResults.length} records)
                          </h3>
                        {(searchStudent || searchSubject) && (
                          <p className="text-sm text-gray-600 mt-1">
                            Filters applied:
                            {searchStudent && (
                              <span className="ml-1 font-medium">
                                Student: "{searchStudent}"
                              </span>
                            )}
                            {searchStudent && searchSubject && <span>, </span>}
                            {searchSubject && (
                              <span className="ml-1 font-medium">
                                Subject: {searchSubject}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Exam Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Exam Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Marks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Percentage
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Uploaded By
                            </th>
                            {isAdmin && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(() => {
                            const startIndex = (searchResultsPage - 1) * itemsPerPage;
                            const endIndex = startIndex + itemsPerPage;
                            const paginatedResults = searchResults.slice(startIndex, endIndex);
                            
                            return paginatedResults.map((result) => (
                            <tr key={result.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {result.studentName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.subject}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.examType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.examDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.marks} / {result.maxMarks}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    parseFloat(result.percentage) >= 75
                                      ? "bg-green-100 text-green-800"
                                      : parseFloat(result.percentage) >= 50
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {result.percentage}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.uploadedByName}
                              </td>
                              {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditResult(result)}
                                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                      title="Edit result"
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
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteResult(result)}
                                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                      title="Delete result"
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
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                      <Pagination
                        currentPage={searchResultsPage}
                        totalPages={Math.ceil(searchResults.length / itemsPerPage)}
                        onPageChange={setSearchResultsPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={searchResults.length}
                      />
                    </div>
                    </>
                  ) : searchClass && searchBatch && !searchLoading ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No results found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No results have been uploaded for {searchClass} -{" "}
                        {searchBatch}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Search for results
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Select a class and batch to view results
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recent Results */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Results
              </h2>
              {recentResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const startIndex = (recentResultsPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedResults = recentResults.slice(startIndex, endIndex);
                        
                        return paginatedResults.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {classOptions.find((c) => c.value === result.class)
                              ?.label || result.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.examType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.marks} / {result.maxMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.percentage}%
                          </td>
                        </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={recentResultsPage}
                    totalPages={Math.ceil(recentResults.length / itemsPerPage)}
                    onPageChange={setRecentResultsPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={recentResults.length}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No results uploaded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Result Modal */}
      {editModalOpen && editingResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Result</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <p className="text-sm text-gray-600 py-2 px-3 bg-gray-50 rounded-md">
                    {editingResult.studentName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <p className="text-sm text-gray-600 py-2 px-3 bg-gray-50 rounded-md">
                      {editingResult.subject}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Type
                    </label>
                    <p className="text-sm text-gray-600 py-2 px-3 bg-gray-50 rounded-md">
                      {editingResult.examType}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks Obtained <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editMarks}
                    onChange={(e) => setEditMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter marks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editMaxMarks}
                    onChange={(e) => setEditMaxMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter maximum marks"
                  />
                </div>
                {editMarks && editMaxMarks && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      Percentage:{" "}
                      <span className="font-medium">
                        {(
                          (parseFloat(editMarks) / parseFloat(editMaxMarks)) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                disabled={editLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Results;
