import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const RecordedLectures = () => {
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    instructor: "",
    isFeatured: false,
    isPublic: true,
  });

  const subjects = [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "English",
    "Hindi",
    "Social Science",
  ];

  const classes = [
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const lecturesQuery = query(
        collection(db, "recordedLectures"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(lecturesQuery);
      const lecturesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLectures(lecturesData);
    } catch (err) {
      console.error("Error fetching lectures:", err);
      setError("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.videoUrl || !formData.subject) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (editingLecture) {
        await updateDoc(doc(db, "recordedLectures", editingLecture.id), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        setSuccess("Lecture updated successfully!");
      } else {
        await addDoc(collection(db, "recordedLectures"), {
          ...formData,
          createdAt: new Date().toISOString(),
          views: 0,
        });
        setSuccess("Lecture added successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchLectures();
    } catch (err) {
      console.error("Error saving lecture:", err);
      setError("Failed to save lecture");
    }
  };

  const handleDelete = async (lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await deleteDoc(doc(db, "recordedLectures", lectureId));
        setSuccess("Lecture deleted successfully!");
        fetchLectures();
      } catch (err) {
        console.error("Error deleting lecture:", err);
        setError("Failed to delete lecture");
      }
    }
  };

  const handleCopy = async (lecture) => {
    try {
      await addDoc(collection(db, "recordedLectures"), {
        title: `${lecture.title} (Copy)`,
        description: lecture.description || "",
        subject: lecture.subject || "",
        class: lecture.class || "",
        videoUrl: lecture.videoUrl || "",
        thumbnailUrl: lecture.thumbnailUrl || "",
        duration: lecture.duration || "",
        instructor: lecture.instructor || "",
        isFeatured: false, // Don't duplicate featured status
        isPublic: lecture.isPublic !== false,
        createdAt: new Date().toISOString(),
        views: 0,
      });
      setSuccess("Lecture duplicated successfully!");
      fetchLectures();
    } catch (err) {
      console.error("Error copying lecture:", err);
      setError("Failed to duplicate lecture");
    }
  };

  const handleEdit = (lecture) => {
    setEditingLecture(lecture);
    setFormData({
      title: lecture.title || "",
      description: lecture.description || "",
      subject: lecture.subject || "",
      class: lecture.class || "",
      videoUrl: lecture.videoUrl || "",
      thumbnailUrl: lecture.thumbnailUrl || "",
      duration: lecture.duration || "",
      instructor: lecture.instructor || "",
      isFeatured: lecture.isFeatured || false,
      isPublic: lecture.isPublic !== false,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      class: "",
      videoUrl: "",
      thumbnailUrl: "",
      duration: "",
      instructor: "",
      isFeatured: false,
      isPublic: true,
    });
    setEditingLecture(null);
  };

  const getFilteredLectures = () => {
    return lectures.filter((lecture) => {
      if (filterSubject && lecture.subject !== filterSubject) return false;
      if (filterClass && lecture.class !== filterClass) return false;
      return true;
    });
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return "";
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return videoId
      ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
      : "";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex-1 pt-28 py-6 px-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                    Recorded Lectures
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage video lectures for students
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    ← Back
                  </button>
                  {(isAdmin || isTeacher) && (
                    <button
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      + Add Lecture
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

            {/* Filters */}
            <div className="bg-white shadow rounded-lg mb-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Subject
                  </label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
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
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  {(filterSubject || filterClass) && (
                    <button
                      onClick={() => {
                        setFilterSubject("");
                        setFilterClass("");
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Lectures Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredLectures().map((lecture, index) => (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={
                        lecture.thumbnailUrl ||
                        getYouTubeThumbnail(lecture.videoUrl) ||
                        "/Images/default-video-thumbnail.jpg"
                      }
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/Images/default-video-thumbnail.jpg";
                      }}
                    />
                    {lecture.isFeatured && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                        Featured
                      </span>
                    )}
                    {lecture.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {lecture.duration}
                      </span>
                    )}
                    {!lecture.isPublic && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                        Private
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                        {lecture.subject}
                      </span>
                      {lecture.class && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {lecture.class}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {lecture.title}
                    </h3>
                    {lecture.instructor && (
                      <p className="text-sm text-gray-500 mb-2">
                        By {lecture.instructor}
                      </p>
                    )}
                    {lecture.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {lecture.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{lecture.views || 0} views</span>
                      <span>
                        {new Date(lecture.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    {(isAdmin || isTeacher) && (
                      <div className="flex gap-2 mt-4 pt-4 border-t flex-wrap">
                        <a
                          href={lecture.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md text-center text-sm hover:bg-indigo-200 transition-colors"
                        >
                          Preview
                        </a>
                        <button
                          onClick={() => handleCopy(lecture)}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                          title="Duplicate this lecture"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleEdit(lecture)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lecture.id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {getFilteredLectures().length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No lectures found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterSubject || filterClass
                    ? "Try adjusting your filters"
                    : "Get started by adding a new lecture"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative mx-4 p-6 w-full max-w-lg shadow-2xl rounded-2xl bg-white border border-gray-100"
              >
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
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

                <div className="flex items-center gap-3 mb-6">
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
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingLecture ? "Edit Lecture" : "Add New Lecture"}
                  </h3>
                </div>

                {/* Copy from previous lecture - only show when adding new */}
                {!editingLecture && lectures.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy from previous lecture
                      </span>
                    </label>
                    <select
                      onChange={(e) => {
                        const selectedLecture = lectures.find(l => l.id === e.target.value);
                        if (selectedLecture) {
                          setFormData({
                            ...formData,
                            subject: selectedLecture.subject || "",
                            class: selectedLecture.class || "",
                            instructor: selectedLecture.instructor || "",
                            isFeatured: selectedLecture.isFeatured || false,
                            isPublic: selectedLecture.isPublic !== false,
                          });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      defaultValue=""
                    >
                      <option value="">-- Select a lecture to copy settings --</option>
                      {lectures.map((lecture) => (
                        <option key={lecture.id} value={lecture.id}>
                          {lecture.title} ({lecture.subject} - {lecture.class || "All Classes"})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Copies: Subject, Class, Instructor, Featured & Public settings
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Introduction to Calculus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL * (YouTube or direct link)
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <select
                        value={formData.class}
                        onChange={(e) =>
                          setFormData({ ...formData, class: e.target.value })
                        }
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructor
                      </label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instructor: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Dr. Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="45:30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Thumbnail URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thumbnailUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Leave empty to use YouTube thumbnail"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Brief description of the lecture..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        Featured (show on homepage)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPublic: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        Public (visible to all)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                    >
                      {editingLecture ? "Update Lecture" : "Add Lecture"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default RecordedLectures;
