import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { USER_ROLES } from "../constants/roles";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

const Attendance = () => {
  const { user, userRole, userData, isAdmin, isTeacher, isStudent, isParent } =
    useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [currentStudentData, setCurrentStudentData] = useState(null);
  const [currentDateAttendance, setCurrentDateAttendance] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Spreadsheet upload state
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' or 'spreadsheet'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  // Search and filter state for teacher/admin
  const [searchClass, setSearchClass] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [searchBatches, setSearchBatches] = useState([]); // Separate state for search batches
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState(""); // "" | "present" | "absent"
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Search and filter state for student
  const [studentSearchDate, setStudentSearchDate] = useState("");
  const [studentSearchStatus, setStudentSearchStatus] = useState(""); // "" | "present" | "absent"

  // Pagination state
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (isStudent) {
        // Fetch only current student's attendance
        await fetchStudentAttendance();
      } else if (isParent) {
        // Fetch linked student's attendance for parent
        await fetchParentLinkedStudentAttendance();
      } else {
        // Fetch all students for admin/teacher
        await fetchAllStudents();
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentLinkedStudentAttendance = async () => {
    try {
      // Check if parent has a linked student
      if (!userData?.studentUid) {
        setError(
          "No student linked to your account. Please contact the administrator.",
        );
        return;
      }

      // Fetch the linked student's data from users collection by customUid
      const usersRef = collection(db, "users");
      const studentQuery = query(
        usersRef,
        where("customUid", "==", userData.studentUid),
      );
      const studentSnapshot = await getDocs(studentQuery);

      if (studentSnapshot.empty) {
        setError(
          "Linked student account not found. Please contact the administrator.",
        );
        return;
      }

      const studentData = studentSnapshot.docs[0].data();
      setCurrentStudentData(studentData);

      if (!studentData.class || !studentData.name || !studentData.batch) {
        setError(
          "Student data is incomplete. Please contact the administrator.",
        );
        return;
      }

      // Fetch all attendance documents for the linked student
      const attendanceRef = collection(db, "attendance");
      const q = query(
        attendanceRef,
        where("studentName", "==", studentData.name),
        where("class", "==", studentData.class),
        where("batch", "==", studentData.batch),
      );
      const snapshot = await getDocs(q);

      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date descending
      records.sort((a, b) => b.date.localeCompare(a.date));
      setAttendanceRecords(records);

      if (records.length === 0) {
        setError("No attendance records found for your child.");
      }
    } catch (err) {
      console.error("Error fetching parent linked student attendance:", err);
      setError(`Failed to load attendance records: ${err.message}`);
    }
  };

  const fetchStudentAttendance = async () => {
    try {
      // First fetch current student's data to get their class
      const usersQuery = query(
        collection(db, "users"),
        where("uid", "==", user.uid),
      );
      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.empty) {
        setError("Student data not found");
        return;
      }

      const studentData = usersSnapshot.docs[0].data();
      setCurrentStudentData(studentData);

      if (!studentData.class || !studentData.name) {
        setError("No class or name assigned to your account");
        return;
      }

      if (!studentData.batch) {
        setError("No batch assigned to your account");
        return;
      }

      // Fetch all attendance documents for this student
      const attendanceRef = collection(db, "attendance");
      const q = query(
        attendanceRef,
        where("studentName", "==", studentData.name),
        where("class", "==", studentData.class),
        where("batch", "==", studentData.batch),
      );
      const snapshot = await getDocs(q);

      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date descending
      records.sort((a, b) => b.date.localeCompare(a.date));
      setAttendanceRecords(records);

      if (records.length === 0) {
        setError("No attendance records found for your account");
      }
    } catch (err) {
      console.error("Error fetching student attendance:", err);
      setError(`Failed to load attendance records: ${err.message}`);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("role", "==", USER_ROLES.STUDENT),
      );
      const snapshot = await getDocs(usersQuery);
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);

      // Extract unique classes
      const uniqueClasses = [
        ...new Set(studentList.map((s) => s.class).filter(Boolean)),
      ];
      setClasses(uniqueClasses.sort());
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Fetch batches when class is selected
  useEffect(() => {
    if (selectedClass) {
      const classBatches = [
        ...new Set(
          students
            .filter((s) => s.class === selectedClass)
            .map((s) => s.batch)
            .filter(Boolean),
        ),
      ];
      setBatches(classBatches.sort());
      setSelectedBatch(""); // Reset batch when class changes
    } else {
      setBatches([]);
      setSelectedBatch("");
    }
  }, [selectedClass, students]);

  // Update search batches when searchClass changes
  useEffect(() => {
    if (searchClass) {
      const classBatches = [
        ...new Set(
          students
            .filter((s) => s.class === searchClass)
            .map((s) => s.batch)
            .filter(Boolean),
        ),
      ];
      setSearchBatches(classBatches.sort());
      setSearchBatch(""); // Reset batch when class changes
    } else {
      // Show all batches if no class selected
      const allBatches = [
        ...new Set(students.map((s) => s.batch).filter(Boolean)),
      ];
      setSearchBatches(allBatches.sort());
    }
  }, [searchClass, students]);

  const fetchAttendanceForDate = async (classValue, date) => {
    if (!classValue || !date || !selectedBatch) return;

    try {
      const attendanceRef = collection(db, "attendance");
      const q = query(
        attendanceRef,
        where("class", "==", classValue),
        where("batch", "==", selectedBatch),
        where("date", "==", date),
      );
      const snapshot = await getDocs(q);

      const attendanceMap = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        // Create a map indexed by student UID for quick lookup
        const student = students.find(
          (s) =>
            s.name === data.studentName &&
            s.class === data.class &&
            s.batch === data.batch,
        );
        if (student) {
          attendanceMap[student.uid] = {
            status: data.status,
            markedAt: data.markedAt,
            markedBy: data.markedBy,
            timeIn: data.timeIn,
            timeOut: data.timeOut,
          };
        }
      });

      setCurrentDateAttendance(attendanceMap);
    } catch (err) {
      console.error("Error fetching attendance for date:", err);
    }
  };

  useEffect(() => {
    if (
      (isTeacher || isAdmin) &&
      selectedClass &&
      selectedBatch &&
      selectedDate
    ) {
      fetchAttendanceForDate(selectedClass, selectedDate);
      setPendingChanges({}); // Clear pending changes when filters change
    }
  }, [selectedClass, selectedBatch, selectedDate, isTeacher, isAdmin]);

  const handleMarkAttendance = (studentId, status) => {
    if (!isAdmin && !isTeacher) {
      setError("Only admins and teachers can mark attendance");
      return;
    }

    const student = students.find((s) => s.id === studentId);
    if (!student || !student.class) {
      setError("Student class information not found");
      return;
    }

    // Add to pending changes
    setPendingChanges((prev) => ({
      ...prev,
      [student.uid]: {
        studentId: studentId,
        studentName: student.name,
        batch: student.batch,
        status: status,
      },
    }));

    // Update local display immediately
    setCurrentDateAttendance((prev) => ({
      ...prev,
      [student.uid]: {
        studentId: studentId,
        studentName: student.name,
        batch: student.batch,
        status: status,
        markedBy: user.uid,
        markedAt: new Date().toISOString(),
      },
    }));

    // Clear any existing messages
    setError("");
    setSuccess("");
  };

  const handleSaveAttendance = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      setError("No changes to save");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const dayOfWeek = new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const sanitize = (str) =>
        str.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");

      // Save each pending change as a separate document
      const savePromises = Object.keys(pendingChanges).map(
        async (studentUid) => {
          const change = pendingChanges[studentUid];

          // Create document ID: studentname_class_batch_day_date
          const docId = `${sanitize(change.studentName)}_${sanitize(selectedClass)}_${sanitize(selectedBatch)}_${sanitize(dayOfWeek)}_${selectedDate}`;

          const attendanceData = {
            studentName: change.studentName,
            class: selectedClass,
            batch: change.batch,
            date: selectedDate,
            dayOfWeek: dayOfWeek,
            status: change.status,
            markedBy: user.uid,
            markedAt: new Date().toISOString(),
          };

          await setDoc(doc(db, "attendance", docId), attendanceData);
        },
      );

      await Promise.all(savePromises);

      setSuccess(
        `Attendance saved successfully for ${Object.keys(pendingChanges).length} student(s)!`,
      );
      setPendingChanges({});

      // Refresh the attendance for the current date
      await fetchAttendanceForDate(selectedClass, selectedDate);

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Failed to save attendance. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setError("");
    setUploadErrors([]);
    setParsedData([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        parseCSV(text);
      } catch (err) {
        setError("Failed to read file. Please upload a valid CSV file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      setError("File is empty or invalid");
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().toUpperCase());
    const expectedHeaders = [
      "STUDENT_NAME",
      "CLASS",
      "BATCH",
      "DATE",
      "TIME IN",
      "TIME OUT",
    ];

    // Validate headers
    const hasAllHeaders = expectedHeaders.every((h) => headers.includes(h));
    if (!hasAllHeaders) {
      setError(
        `Invalid CSV format. Expected columns: ${expectedHeaders.join(", ")}`,
      );
      return;
    }

    const data = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Invalid number of columns`);
        continue;
      }

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      // Validate required fields
      if (
        !row["STUDENT_NAME"] ||
        !row["CLASS"] ||
        !row["BATCH"] ||
        !row["DATE"]
      ) {
        errors.push(
          `Row ${i + 1}: Missing required fields (STUDENT_NAME, CLASS, BATCH, or DATE)`,
        );
        continue;
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(row["DATE"])) {
        errors.push(
          `Row ${i + 1}: Invalid date format. Use YYYY-MM-DD (e.g., 2026-02-08)`,
        );
        continue;
      }

      data.push({
        studentName: row["STUDENT_NAME"],
        class: row["CLASS"],
        batch: row["BATCH"],
        date: row["DATE"],
        timeIn: row["TIME IN"] || "",
        timeOut: row["TIME OUT"] || "",
        rowNumber: i + 1,
      });
    }

    setUploadErrors(errors);
    setParsedData(data);

    if (data.length === 0) {
      setError("No valid data found in the file");
    } else {
      setSuccess(`Successfully parsed ${data.length} record(s)`);
    }
  };

  const handleSaveSpreadsheetData = async () => {
    if (parsedData.length === 0) {
      setError("No data to save");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let successCount = 0;
      let errorCount = 0;
      const sanitize = (str) =>
        str.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");

      for (const record of parsedData) {
        try {
          // Find matching student by name, class, and batch
          const matchingStudent = students.find(
            (s) =>
              s.name === record.studentName &&
              s.class === record.class &&
              s.batch === record.batch,
          );

          if (!matchingStudent) {
            errorCount++;
            continue;
          }

          const dayOfWeek = new Date(record.date).toLocaleDateString("en-US", {
            weekday: "long",
          });

          // Create document ID: studentname_class_batch_day_date
          const docId = `${sanitize(record.studentName)}_${sanitize(record.class)}_${sanitize(record.batch)}_${sanitize(dayOfWeek)}_${record.date}`;

          const attendanceData = {
            studentName: matchingStudent.name,
            class: record.class,
            batch: matchingStudent.batch,
            date: record.date,
            dayOfWeek: dayOfWeek,
            status: "present",
            timeIn: record.timeIn || "",
            timeOut: record.timeOut || "",
            markedBy: user.uid,
            markedAt: new Date().toISOString(),
          };

          await setDoc(doc(db, "attendance", docId), attendanceData);
          successCount++;
        } catch (err) {
          console.error("Error saving record:", err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setSuccess(
          `Successfully saved ${successCount} attendance record(s)${errorCount > 0 ? `. ${errorCount} record(s) failed.` : ""}`,
        );
        setParsedData([]);
        setUploadedFile(null);
      } else {
        setError("Failed to save attendance records. Please check the data.");
      }
    } catch (err) {
      setError("Failed to save attendance. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSearchAttendance = async () => {
    if (!searchClass && !searchBatch && !searchDate) {
      setError("Please select at least one search criteria");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const attendanceRef = collection(db, "attendance");
      let conditions = [];

      if (searchClass) {
        conditions.push(where("class", "==", searchClass));
      }
      if (searchBatch) {
        conditions.push(where("batch", "==", searchBatch));
      }
      if (searchDate) {
        conditions.push(where("date", "==", searchDate));
      }
      if (searchStatus) {
        conditions.push(where("status", "==", searchStatus));
      }

      const q = query(attendanceRef, ...conditions);
      const snapshot = await getDocs(q);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date descending
      results.sort((a, b) => b.date.localeCompare(a.date));
      setSearchResults(results);

      if (results.length === 0) {
        setError("No attendance records found for the selected criteria");
      }
    } catch (err) {
      console.error("Error searching attendance:", err);
      setError(`Failed to search attendance: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord({ ...record });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    setSaving(true);
    setError("");

    try {
      await setDoc(doc(db, "attendance", editingRecord.id), {
        ...editingRecord,
        updatedAt: new Date().toISOString(),
      });

      setSuccess("Attendance record updated successfully!");
      setEditModalOpen(false);
      setEditingRecord(null);

      // Refresh search results
      if (searchResults.length > 0) {
        await handleSearchAttendance();
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating record:", err);
      setError("Failed to update record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (
      !window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "attendance", recordId));

      setSuccess("Attendance record deleted successfully!");

      // Refresh search results
      if (searchResults.length > 0) {
        await handleSearchAttendance();
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting record:", err);
      setError("Failed to delete record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getFilteredStudentRecords = () => {
    let filtered = [...attendanceRecords];

    if (studentSearchDate) {
      filtered = filtered.filter((record) => record.date === studentSearchDate);
    }

    if (studentSearchStatus) {
      filtered = filtered.filter(
        (record) => record.status === studentSearchStatus,
      );
    }

    return filtered;
  };

  const filteredStudents =
    selectedClass && selectedBatch
      ? students.filter(
          (s) => s.class === selectedClass && s.batch === selectedBatch,
        )
      : [];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-gray-600">Loading attendance data...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Attendance
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {isStudent || isParent
                    ? isParent
                      ? "View your child's attendance records"
                      : "View your attendance records"
                    : "Mark and manage student attendance"}
                </p>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Student/Parent View */}
            {(isStudent || isParent) && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    {isParent
                      ? "My Child's Attendance Records"
                      : "My Attendance Records"}
                  </h2>
                </div>

                {/* Student Search Filters */}
                <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Date
                      </label>
                      <input
                        type="date"
                        value={studentSearchDate}
                        onChange={(e) => setStudentSearchDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Status
                      </label>
                      <select
                        value={studentSearchStatus}
                        onChange={(e) => setStudentSearchStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">All</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setStudentSearchDate("");
                          setStudentSearchStatus("");
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marked At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const filteredRecords = getFilteredStudentRecords();
                        const startIndex =
                          (studentCurrentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedRecords = filteredRecords.slice(
                          startIndex,
                          endIndex,
                        );

                        if (filteredRecords.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan="6"
                                className="px-6 py-4 text-center text-gray-500"
                              >
                                No attendance records found
                              </td>
                            </tr>
                          );
                        }

                        return paginatedRecords.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {record.dayOfWeek || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  record.status === "present"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {record.status
                                  ? record.status.toUpperCase()
                                  : "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.timeIn || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.timeOut || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.markedAt).toLocaleString()}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={studentCurrentPage}
                  totalPages={Math.ceil(
                    getFilteredStudentRecords().length / itemsPerPage,
                  )}
                  onPageChange={setStudentCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={getFilteredStudentRecords().length}
                />
              </div>
            )}

            {/* Teacher/Admin View */}
            {(isTeacher || isAdmin) && (
              <>
                {/* Search Section */}
                <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-900">
                      Search Attendance Records
                    </h3>
                  </div>
                  <div className="px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class
                        </label>
                        <select
                          value={searchClass}
                          onChange={(e) => setSearchClass(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">All Classes</option>
                          {classes.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Batch
                        </label>
                        <select
                          value={searchBatch}
                          onChange={(e) => setSearchBatch(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">All Batches</option>
                          {searchBatches.map((batch) => (
                            <option key={batch} value={batch}>
                              {batch}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={searchDate}
                          onChange={(e) => setSearchDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={searchStatus}
                          onChange={(e) => setSearchStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">All Status</option>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSearchAttendance}
                        disabled={isSearching}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSearching ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Searching...
                          </>
                        ) : (
                          <>
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
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            Search
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSearchClass("");
                          setSearchBatch("");
                          setSearchDate("");
                          setSearchStatus("");
                          setSearchResults([]);
                        }}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-md font-medium text-gray-900">
                            Search Results ({searchResults.length} records)
                          </h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Student Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Class
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Batch
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Day
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Time In
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Time Out
                                </th>
                                {isAdmin && (
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(() => {
                                const startIndex =
                                  (searchCurrentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const paginatedResults = searchResults.slice(
                                  startIndex,
                                  endIndex,
                                );

                                return paginatedResults.map((record) => (
                                  <tr key={record.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      {record.studentName}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                      {record.class}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                      {record.batch}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      {new Date(
                                        record.date,
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                      {record.dayOfWeek || "-"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          record.status === "present"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {record.status
                                          ? record.status.toUpperCase()
                                          : "N/A"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {record.timeIn || "-"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {record.timeOut || "-"}
                                    </td>
                                    {isAdmin && (
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                        <button
                                          onClick={() =>
                                            handleEditRecord(record)
                                          }
                                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                                          title="Edit"
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
                                          onClick={() =>
                                            handleDeleteRecord(record.id)
                                          }
                                          className="text-red-600 hover:text-red-900"
                                          title="Delete"
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
                                      </td>
                                    )}
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                        </div>
                        <Pagination
                          currentPage={searchCurrentPage}
                          totalPages={Math.ceil(
                            searchResults.length / itemsPerPage,
                          )}
                          onPageChange={setSearchCurrentPage}
                          itemsPerPage={itemsPerPage}
                          totalItems={searchResults.length}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white shadow rounded-lg mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                      <button
                        onClick={() => setActiveTab("manual")}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                          activeTab === "manual"
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <svg
                          className="inline-block w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        Manual Entry
                      </button>
                      <button
                        onClick={() => setActiveTab("spreadsheet")}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                          activeTab === "spreadsheet"
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <svg
                          className="inline-block w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        Upload Spreadsheet
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Manual Entry Tab */}
                {activeTab === "manual" && (
                  <>
                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg mb-6 p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Select Class, Batch & Date
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Batch <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            disabled={!selectedClass}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                              <option key={batch} value={batch}>
                                {batch}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Students List */}
                    {selectedClass && selectedBatch ? (
                      <>
                        {/* Save Button */}
                        {Object.keys(pendingChanges).length > 0 && (
                          <div className="bg-white shadow rounded-lg mb-6 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="h-5 w-5 text-yellow-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">
                                  You have {Object.keys(pendingChanges).length}{" "}
                                  unsaved change(s)
                                </span>
                              </div>
                              <button
                                onClick={handleSaveAttendance}
                                disabled={saving}
                                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {saving ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="-ml-1 mr-2 h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                      />
                                    </svg>
                                    Save Attendance
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="bg-white shadow rounded-lg overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 bg-gray-50">
                            <h2 className="text-lg font-medium text-gray-900">
                              Mark Attendance - {selectedClass} {selectedBatch}{" "}
                              - {new Date(selectedDate).toLocaleDateString()}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                              {filteredStudents.length} student(s)
                            </p>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Attendance
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="px-6 py-8 text-center text-gray-500"
                                    >
                                      No students found in {selectedClass}{" "}
                                      {selectedBatch}
                                    </td>
                                  </tr>
                                ) : (
                                  filteredStudents.map((student, index) => {
                                    const studentAttendance =
                                      currentDateAttendance[student.uid];
                                    const isPresent =
                                      studentAttendance?.status === "present";
                                    const isAbsent =
                                      studentAttendance?.status === "absent";

                                    return (
                                      <tr
                                        key={student.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm font-medium text-gray-900">
                                            {student.name}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {student.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              onClick={() =>
                                                handleMarkAttendance(
                                                  student.id,
                                                  "present",
                                                )
                                              }
                                              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                                                isPresent
                                                  ? "bg-green-600 text-white shadow-lg scale-110"
                                                  : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                                              }`}
                                              title="Mark Present"
                                            >
                                              P
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleMarkAttendance(
                                                  student.id,
                                                  "absent",
                                                )
                                              }
                                              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                                                isAbsent
                                                  ? "bg-red-600 text-white shadow-lg scale-110"
                                                  : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
                                              }`}
                                              title="Mark Absent"
                                            >
                                              A
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white shadow rounded-lg p-8 text-center">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          Select Class and Batch
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Please select a class and batch to view and mark
                          attendance.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Spreadsheet Upload Tab */}
                {activeTab === "spreadsheet" && (
                  <>
                    <div className="bg-white shadow rounded-lg mb-6 p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Upload Attendance Spreadsheet
                      </h2>
                      <div className="space-y-4">
                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                          <h3 className="text-sm font-medium text-blue-900 mb-2">
                            CSV Format Requirements:
                          </h3>
                          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>
                              Columns: STUDENT_NAME, CLASS, BATCH, DATE, TIME
                              IN, TIME OUT
                            </li>
                            <li>Date format: YYYY-MM-DD (e.g., 2026-02-08)</li>
                            <li>
                              Student name must match exactly with registered
                              students
                            </li>
                            <li>TIME IN and TIME OUT are optional</li>
                          </ul>
                          <p className="text-sm text-blue-700 mt-2">
                            Example: John Doe,Class
                            10,2024A,2026-02-08,09:00,15:30
                          </p>
                        </div>

                        {/* File Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select CSV File
                          </label>
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>

                        {/* Upload Errors */}
                        {uploadErrors.length > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <h3 className="text-sm font-medium text-yellow-900 mb-2">
                              {uploadErrors.length} Warning(s):
                            </h3>
                            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside max-h-40 overflow-y-auto">
                              {uploadErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Preview Data */}
                        {parsedData.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-900">
                                Preview ({parsedData.length} records)
                              </h3>
                              <button
                                onClick={handleSaveSpreadsheetData}
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {saving ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="-ml-1 mr-2 h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                      />
                                    </svg>
                                    Save All Records
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                      #
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                      Student Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                      Class
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                      Batch
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                      Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                      Time In
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                      Time Out
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {parsedData.map((record, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-4 py-3 text-sm text-gray-500">
                                        {index + 1}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {record.studentName}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {record.class}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {record.batch}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {new Date(
                                          record.date,
                                        ).toLocaleDateString()}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {record.timeIn || "-"}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {record.timeOut || "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {!uploadedFile && parsedData.length === 0 && (
                          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
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
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                              Upload a CSV file to import attendance records
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && editingRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Attendance Record
              </h3>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingRecord(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
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
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={editingRecord.studentName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <input
                    type="text"
                    value={editingRecord.class}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={editingRecord.batch}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingRecord.date}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingRecord.status}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time In
                  </label>
                  <input
                    type="time"
                    value={editingRecord.timeIn || ""}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        timeIn: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Out
                  </label>
                  <input
                    type="time"
                    value={editingRecord.timeOut || ""}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        timeOut: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingRecord(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Attendance;
