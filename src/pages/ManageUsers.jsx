import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, secondaryAuth } from "../config/firebase.config";
import { USER_ROLES, ROLE_NAMES } from "../constants/roles";
import { classOptions } from "../data/subjectsData";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import * as XLSX from "xlsx";

const ManageUsers = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: USER_ROLES.STUDENT,
    name: "",
    class: "",
    batch: "",
  });

  const [editForm, setEditForm] = useState({
    class: "",
    batch: "",
  });

  // Filter and search states
  const [filterClass, setFilterClass] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [searchName, setSearchName] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update available batches when users list changes
  useEffect(() => {
    const batches = [...new Set(users.map((u) => u.batch).filter(Boolean))];
    setAvailableBatches(batches.sort());
  }, [users]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterClass, filterRole, filterBatch, searchName]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on selected filters
  const getFilteredUsers = () => {
    return users.filter((u) => {
      // Filter by class
      if (filterClass && u.class !== filterClass) return false;

      // Filter by role
      if (filterRole && u.role !== filterRole) return false;

      // Filter by batch
      if (filterBatch && u.batch !== filterBatch) return false;

      // Search by name
      if (
        searchName &&
        !u.name?.toLowerCase().includes(searchName.toLowerCase())
      )
        return false;

      return true;
    });
  };

  // Export filtered users to Excel
  const handleExportToExcel = () => {
    const filteredUsers = getFilteredUsers();

    // Prepare data for export
    const exportData = filteredUsers.map((u) => ({
      Name: u.name || "N/A",
      Email: u.email || "N/A",
      Role: ROLE_NAMES[u.role] || u.role,
      Class: u.class || "N/A",
      Batch: u.batch || "N/A",
      "Created Date": u.createdAt
        ? new Date(u.createdAt).toLocaleDateString()
        : "N/A",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Role
      { wch: 15 }, // Class
      { wch: 15 }, // Batch
      { wch: 15 }, // Created Date
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `users_export_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);

    setSuccess(`Successfully exported ${exportData.length} users to Excel`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isAdmin) {
      setError("Only admins can create users");
      return;
    }

    // Validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newUser.role === USER_ROLES.STUDENT) {
      if (!newUser.class || !newUser.batch) {
        setError("Please select class and batch for student accounts");
        return;
      }
    }

    try {
      // WARNING: Firebase client SDK will sign in the newly created user
      // This will log out the current admin user
      // In production, use Firebase Admin SDK on the backend

      const currentUser = auth.currentUser;
      const creationDate = new Date().toISOString();
      const dateStamp = new Date()
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "");

      // Check if a user with this email already exists in Firestore
      const allUsersSnapshot = await getDocs(collection(db, "users"));
      const existingUser = allUsersSnapshot.docs.find(
        (doc) => doc.data().email === newUser.email,
      );

      if (existingUser) {
        setError("A user with this email already exists in the system.");
        return;
      }

      // Create user in Firebase Auth using secondary auth instance
      // This prevents logging out the current admin user
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          newUser.email,
          newUser.password,
        );
      } catch (authError) {
        if (authError.code === "auth/email-already-in-use") {
          setError(
            "This email is already registered in Firebase Authentication but has no profile. " +
              "The user was likely deleted. Please contact support to resolve this issue, " +
              "or the user can reset their password and sign in to create a new profile.",
          );
          return;
        }
        throw authError; // Re-throw other errors to be caught by outer catch
      }

      // Generate custom document ID: role_name_Class_Batch_Date
      const sanitizedName = newUser.name.replace(/\s+/g, "").toLowerCase();
      let customDocId = `${newUser.role}_${sanitizedName}`;
      if (newUser.role === USER_ROLES.STUDENT && newUser.class) {
        customDocId += `_${newUser.class.replace(/\s+/g, "")}`;
      }
      if (newUser.role === USER_ROLES.STUDENT && newUser.batch) {
        customDocId += `_${newUser.batch.replace(/\s+/g, "")}`;
      }
      customDocId += `_${dateStamp}`;

      // Store user data in Firestore with custom document ID
      await setDoc(doc(db, "users", customDocId), {
        uid: userCredential.user.uid,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        ...(newUser.role === USER_ROLES.STUDENT && {
          class: newUser.class,
          batch: newUser.batch,
        }),
        createdAt: creationDate,
        createdBy: currentUser?.uid,
      });

      // Sign out the newly created user from secondary auth
      // This doesn't affect the current admin's session
      await secondaryAuth.signOut();

      setSuccess("User created successfully!");
      setShowCreateModal(false);
      setNewUser({
        email: "",
        password: "",
        role: USER_ROLES.STUDENT,
        name: "",
        class: "",
        batch: "",
      });

      // Wait a bit before refreshing to allow auth state to settle
      setTimeout(() => {
        window.location.href = "/login?role=admin";
      }, 2000);
    } catch (err) {
      console.error("Create user error:", err);

      // Handle specific Firebase errors
      let errorMessage = "Failed to create user";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Use at least 6 characters";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMessage =
          "Email/password accounts are not enabled. Check Firebase Console";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!isAdmin) {
      setError("Only admins can change roles");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
      setSuccess("Role updated successfully!");
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update role");
      console.error("Update role error:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!isAdmin) {
      setError("Only admins can delete users");
      return;
    }

    if (userId === user.uid) {
      setError("You cannot delete your own account");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to permanently delete this user? This action cannot be undone.",
      )
    ) {
      try {
        // Permanently delete user from Firestore
        await deleteDoc(doc(db, "users", userId));

        setSuccess(
          "User permanently deleted! Note: The user's authentication account remains active. They can create a new profile if they sign in again.",
        );
        fetchUsers();
      } catch (err) {
        setError(err.message || "Failed to delete user");
        console.error("Delete error:", err);
      }
    }
  };

  const handleResetPassword = async (userId) => {
    if (!isAdmin) {
      setError("Only admins can reset passwords");
      return;
    }

    try {
      // Note: This requires Firebase Admin SDK for production
      // For now, we'll just update the Firestore document
      await updateDoc(doc(db, "users", userId), {
        passwordResetRequired: true,
        updatedAt: new Date().toISOString(),
      });
      setSuccess(
        "Password reset initiated. User will be prompted to change password on next login.",
      );
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to reset password");
      console.error("Password reset error:", err);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("Only admins can update student information");
      return;
    }

    try {
      await updateDoc(doc(db, "users", selectedUser.id), {
        class: editForm.class,
        batch: editForm.batch,
        updatedAt: new Date().toISOString(),
      });
      setSuccess("Student information updated successfully!");
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update student information");
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex-1 pt-28 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-gray-600">Loading users...</p>
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
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Manage Users
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {isAdmin
                      ? "Create, edit, and manage user accounts"
                      : "View user accounts"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    ← Back
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      + Create User
                    </button>
                  )}
                </div>
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

            {/* Info about user management */}
            {isAdmin && (
              <div className="mb-4 bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded">
                <p className="font-medium">ℹ️ Note:</p>
                <ul className="text-sm mt-1 list-disc list-inside space-y-1">
                  <li>
                    Deleting a user removes their profile from the system
                    permanently.
                  </li>
                  <li>
                    The user's authentication account remains active and they
                    can sign in to create a new profile.
                  </li>
                </ul>
              </div>
            )}

            {/* Filters & Search */}
            <div className="bg-white shadow rounded-lg mb-6 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filters & Export
                </h3>
                <button
                  onClick={handleExportToExcel}
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
                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Class
                  </label>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Classes</option>
                    {classOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Role
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Roles</option>
                    <option value={USER_ROLES.STUDENT}>
                      {ROLE_NAMES[USER_ROLES.STUDENT]}
                    </option>
                    <option value={USER_ROLES.TEACHER}>
                      {ROLE_NAMES[USER_ROLES.TEACHER]}
                    </option>
                    <option value={USER_ROLES.ADMIN}>
                      {ROLE_NAMES[USER_ROLES.ADMIN]}
                    </option>
                  </select>
                </div>

                {/* Batch Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Batch
                  </label>
                  <select
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Batches</option>
                    {availableBatches.map((batch) => (
                      <option key={batch} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search by Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Search by name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
                  </div>
                </div>
              </div>

              {/* Reset Filters Button */}
              {(filterClass || filterRole || filterBatch || searchName) && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setFilterClass("");
                      setFilterRole("");
                      setFilterBatch("");
                      setSearchName("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name / Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class / Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    const filteredUsers = getFilteredUsers();
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedUsers = filteredUsers.slice(
                      startIndex,
                      endIndex,
                    );

                    if (filteredUsers.length === 0) {
                      return (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No users found matching the selected filters.
                          </td>
                        </tr>
                      );
                    }

                    return paginatedUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {u.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isAdmin ? (
                            <select
                              value={u.role}
                              onChange={(e) =>
                                handleUpdateRole(u.id, e.target.value)
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                              disabled={u.id === user.uid}
                            >
                              <option value={USER_ROLES.STUDENT}>
                                {ROLE_NAMES[USER_ROLES.STUDENT]}
                              </option>
                              <option value={USER_ROLES.TEACHER}>
                                {ROLE_NAMES[USER_ROLES.TEACHER]}
                              </option>
                              <option value={USER_ROLES.ADMIN}>
                                {ROLE_NAMES[USER_ROLES.ADMIN]}
                              </option>
                            </select>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {ROLE_NAMES[u.role]}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.role === USER_ROLES.STUDENT ? (
                            <div>
                              <div className="text-sm text-gray-900">
                                {u.class || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {u.batch || "N/A"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {u.role === USER_ROLES.STUDENT && (
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setEditForm({
                                    class: u.class || "",
                                    batch: u.batch || "",
                                  });
                                  setShowEditModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setShowResetPasswordModal(true);
                              }}
                              className="text-orange-600 hover:text-orange-900 mr-4"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={u.id === user.uid}
                            >
                              Delete
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
              currentPage={currentPage}
              totalPages={Math.ceil(getFilteredUsers().length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={getFilteredUsers().length}
            />
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Create New User
                </h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value={USER_ROLES.STUDENT}>
                        {ROLE_NAMES[USER_ROLES.STUDENT]}
                      </option>
                      <option value={USER_ROLES.TEACHER}>
                        {ROLE_NAMES[USER_ROLES.TEACHER]}
                      </option>
                      <option value={USER_ROLES.ADMIN}>
                        {ROLE_NAMES[USER_ROLES.ADMIN]}
                      </option>
                    </select>
                  </div>
                  {newUser.role === USER_ROLES.STUDENT && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Class
                        </label>
                        <select
                          required={newUser.role === USER_ROLES.STUDENT}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={newUser.class}
                          onChange={(e) =>
                            setNewUser({ ...newUser, class: e.target.value })
                          }
                        >
                          <option value="">Select Class</option>
                          <option value="Class 5">Class 5</option>
                          <option value="Class 6">Class 6</option>
                          <option value="Class 7">Class 7</option>
                          <option value="Class 8">Class 8</option>
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                          <option value="Class 11">Class 11</option>
                          <option value="Class 12">Class 12</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Batch
                        </label>
                        <select
                          required={newUser.role === USER_ROLES.STUDENT}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={newUser.batch}
                          onChange={(e) =>
                            setNewUser({ ...newUser, batch: e.target.value })
                          }
                        >
                          <option value="">Select Batch</option>
                          <option value="Batch A">Batch A</option>
                          <option value="Batch B">Batch B</option>
                          <option value="Batch C">Batch C</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewUser({
                          email: "",
                          password: "",
                          role: USER_ROLES.STUDENT,
                          name: "",
                        });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Edit Student Information
                </h3>

                <form onSubmit={handleUpdateStudent}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Email: <strong>{selectedUser.email}</strong>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Class
                    </label>
                    <select
                      value={editForm.class}
                      onChange={(e) =>
                        setEditForm({ ...editForm, class: e.target.value })
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="">Select Class</option>
                      {[5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                        <option key={cls} value={`Class ${cls}`}>
                          Class {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Batch
                    </label>
                    <select
                      value={editForm.batch}
                      onChange={(e) =>
                        setEditForm({ ...editForm, batch: e.target.value })
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="">Select Batch</option>
                      <option value="Batch A">Batch A</option>
                      <option value="Batch B">Batch B</option>
                      <option value="Batch C">Batch C</option>
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {showResetPasswordModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Reset Password
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Reset password for: <strong>{selectedUser.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  The user will be prompted to change their password on next
                  login.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowResetPasswordModal(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleResetPassword(selectedUser.id)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    Confirm Reset
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

export default ManageUsers;
