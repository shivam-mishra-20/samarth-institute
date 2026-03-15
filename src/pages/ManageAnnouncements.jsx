import { useState, useEffect, useRef } from "react";
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
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { USER_ROLES } from "../constants/roles";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// ─── SVG Type Icons ───────────────────────────────────────────────────────────

export const TypeIcon = ({ type, className = "w-5 h-5" }) => {
  const icons = {
    exam_alert: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    holiday_notice: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    motivational: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    result_announcement: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    important_update: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };
  return icons[type] ?? icons.important_update;
};

// ─── Config ──────────────────────────────────────────────────────────────────

export const ANNOUNCEMENT_TYPES = {
  exam_alert: {
    label: "Exam Alert",
    iconColor: "text-red-600",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-300",
    badgeBg: "bg-red-100",
    accent: "#ef4444",
  },
  holiday_notice: {
    label: "Holiday Notice",
    iconColor: "text-green-600",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-300",
    badgeBg: "bg-green-100",
    accent: "#22c55e",
  },
  motivational: {
    label: "Motivational",
    iconColor: "text-yellow-600",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-300",
    badgeBg: "bg-yellow-100",
    accent: "#eab308",
  },
  result_announcement: {
    label: "Result Announcement",
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-300",
    badgeBg: "bg-blue-100",
    accent: "#3b82f6",
  },
  important_update: {
    label: "Important Update",
    iconColor: "text-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-300",
    badgeBg: "bg-purple-100",
    accent: "#a855f7",
  },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  medium: { label: "Medium", bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-400" },
  high: { label: "High", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const INITIAL_FORM = {
  title: "",
  content: "",
  type: "important_update",
  priority: "medium",
  targetingMode: "roles", // "roles" | "specific"
  targetRoles: ["student", "parent"],
  targetUserIds: [],
  isActive: true,
  expiresAt: "",
};

// ─── Custom Select Dropdown ───────────────────────────────────────────────────

const PRIORITY_OPTIONS = [
  { value: "low",    label: "Low Priority",                      dot: "bg-gray-400",   textClass: "text-gray-600"  },
  { value: "medium", label: "Medium Priority",                   dot: "bg-orange-400", textClass: "text-orange-700" },
  { value: "high",   label: "High Priority (requires interaction)", dot: "bg-red-500",   textClass: "text-red-700"   },
];

const CustomSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${selected.dot}`} />
          <span className={selected.textClass}>{selected.label}</span>
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition text-left ${value === opt.value ? "bg-indigo-50" : ""}`}
            >
              <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
              <span className={opt.textClass}>{opt.label}</span>
              {value === opt.value && (
                <svg className="ml-auto w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Generates a Firestore document ID in the pattern: type_slug_YYYYMMDD
const generateDocId = (type, title) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 35);
  return `${type}_${slug}_${date}`;
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Component ───────────────────────────────────────────────────────────────

const ManageAnnouncements = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // User targeting
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  // ── Guard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (userRole && userRole !== USER_ROLES.ADMIN) {
      navigate("/unauthorized");
    }
  }, [userRole, navigate]);

  // ── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        expiresAt: d.data().expiresAt?.toDate?.() ?? null,
      }));
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      showToast("error", "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Fetch all users for specific targeting ─────────────────────────────────
  const fetchAllUsers = async () => {
    if (allUsers.length > 0) return; // already loaded
    setUsersLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("role", "in", ["student", "parent", "teacher"])
      );
      const snap = await getDocs(q);
      const users = snap.docs
        .map((d) => ({
          uid: d.data().uid || d.id,
          name: d.data().name || d.data().email || "—",
          role: d.data().role,
          email: d.data().email || "",
        }))
        .sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name));
      setAllUsers(users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setFormError("");
    setUserSearch("");
    setShowModal(true);
    fetchAllUsers();
  };

  const openEditModal = (a) => {
    setEditingId(a.id);
    const hasSpecificUsers = a.targetUserIds?.length > 0;
    setForm({
      title: a.title,
      content: a.content,
      type: a.type,
      priority: a.priority || "medium",
      targetingMode: hasSpecificUsers ? "specific" : "roles",
      targetRoles: a.targetRoles || ["student", "parent"],
      targetUserIds: a.targetUserIds || [],
      isActive: a.isActive !== false,
      expiresAt: a.expiresAt ? a.expiresAt.toISOString().slice(0, 10) : "",
    });
    setFormError("");
    setUserSearch("");
    setShowModal(true);
    fetchAllUsers();
  };

  // ── Form change handlers ───────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    if (inputType === "checkbox" && name === "isActive") {
      setForm((p) => ({ ...p, isActive: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleRoleToggle = (role) => {
    setForm((p) => {
      const roles = p.targetRoles.includes(role)
        ? p.targetRoles.filter((r) => r !== role)
        : [...p.targetRoles, role];
      return { ...p, targetRoles: roles };
    });
  };

  const handleUserToggle = (uid) => {
    setForm((p) => {
      const ids = p.targetUserIds.includes(uid)
        ? p.targetUserIds.filter((id) => id !== uid)
        : [...p.targetUserIds, uid];
      return { ...p, targetUserIds: ids };
    });
  };

  const handleSelectAllRole = (role) => {
    const roleUids = allUsers.filter((u) => u.role === role).map((u) => u.uid);
    setForm((p) => {
      const allSelected = roleUids.every((uid) => p.targetUserIds.includes(uid));
      const ids = allSelected
        ? p.targetUserIds.filter((id) => !roleUids.includes(id))
        : [...new Set([...p.targetUserIds, ...roleUids])];
      return { ...p, targetUserIds: ids };
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError("Title is required."); return; }
    if (!form.content.trim()) { setFormError("Content is required."); return; }
    if (form.targetingMode === "roles" && form.targetRoles.length === 0) {
      setFormError("Select at least one target role."); return;
    }
    if (form.targetingMode === "specific" && form.targetUserIds.length === 0) {
      setFormError("Select at least one user to target."); return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        type: form.type,
        priority: form.priority,
        isActive: form.isActive,
        updatedAt: serverTimestamp(),
        expiresAt: form.expiresAt
          ? Timestamp.fromDate(new Date(form.expiresAt))
          : null,
      };

      if (form.targetingMode === "roles") {
        payload.targetRoles = form.targetRoles;
        payload.targetUserIds = [];
      } else {
        // Specific users: also derive roles for FCM filtering
        const selectedUsers = allUsers.filter((u) => form.targetUserIds.includes(u.uid));
        payload.targetRoles = [...new Set(selectedUsers.map((u) => u.role))];
        payload.targetUserIds = form.targetUserIds;
      }

      if (editingId) {
        await updateDoc(doc(db, "announcements", editingId), payload);
        showToast("success", "Announcement updated successfully.");
      } else {
        const docId = generateDocId(form.type, form.title);
        await setDoc(doc(db, "announcements", docId), {
          ...payload,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          fcmSent: false,
        });
        showToast(
          "success",
          "Announcement published! Push notifications are being sent to subscribers."
        );
      }

      setShowModal(false);
      await fetchAnnouncements();
    } catch (err) {
      console.error("Error saving announcement:", err);
      setFormError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggle = async (a) => {
    try {
      await updateDoc(doc(db, "announcements", a.id), {
        isActive: !a.isActive,
        updatedAt: serverTimestamp(),
      });
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === a.id ? { ...item, isActive: !a.isActive } : item
        )
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "announcements", id));
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirm(null);
      showToast("success", "Announcement deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const typeCounts = announcements.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  const filtered = announcements.filter((a) => {
    const matchType = activeFilter === "all" || a.type === activeFilter;
    const matchSearch =
      !searchTerm ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  // Users grouped by role, filtered by search
  const groupedUsers = ["student", "parent", "teacher"].reduce((acc, role) => {
    acc[role] = allUsers.filter(
      (u) =>
        u.role === role &&
        (!userSearch ||
          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email?.toLowerCase().includes(userSearch.toLowerCase()))
    );
    return acc;
  }, {});

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
        <Sidebar mobileTopBarMode="inline" />
        <div className="flex-1 pt-3 sm:pt-4 md:pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Announcements
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create, publish, and manage updates for students and parents.
                  Push notifications are sent automatically via FCM.
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-sm transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Announcement
              </button>
            </div>

            {/* ── Toast ── */}
            {toast && (
              <div
                className={`mb-5 flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
                  toast.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <span className="text-lg">
                  {toast.type === "success" ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                </span>
                {toast.msg}
              </div>
            )}

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {Object.entries(ANNOUNCEMENT_TYPES).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() =>
                    setActiveFilter(activeFilter === key ? "all" : key)
                  }
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    activeFilter === key
                      ? `${cfg.bg} ${cfg.border} shadow-md`
                      : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  }`}
                >
                  <div className={`mb-2 ${activeFilter === key ? cfg.iconColor : "text-gray-400"}`}>
                    <TypeIcon type={key} className="w-7 h-7" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {typeCounts[key] || 0}
                  </div>
                  <div className={`text-xs mt-1 font-medium ${activeFilter === key ? cfg.text : "text-gray-500"}`}>
                    {cfg.label}
                  </div>
                </button>
              ))}
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      activeFilter === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All ({announcements.length})
                  </button>
                  {Object.entries(ANNOUNCEMENT_TYPES).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() =>
                        setActiveFilter(activeFilter === key ? "all" : key)
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        activeFilter === key
                          ? `${cfg.badgeBg} ${cfg.text}`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <TypeIcon type={key} className="w-3.5 h-3.5" />
                      {cfg.label}
                    </button>
                  ))}
                </div>
                <div className="relative sm:ml-auto w-full sm:w-auto">
                  <svg
                    className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search announcements…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-full sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* ── List ── */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4" />
                <p className="text-gray-500 text-sm">Loading announcements…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {searchTerm || activeFilter !== "all"
                    ? "Try adjusting your search or filter."
                    : "Click ＋ New Announcement to get started."}
                </p>
                {!searchTerm && activeFilter === "all" && (
                  <button
                    onClick={openCreateModal}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
                  >
                    Create First Announcement
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((a) => {
                  const tCfg =
                    ANNOUNCEMENT_TYPES[a.type] ||
                    ANNOUNCEMENT_TYPES.important_update;
                  const pCfg = PRIORITY_CONFIG[a.priority] || PRIORITY_CONFIG.medium;
                  return (
                    <div
                      key={a.id}
                      className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 p-5 transition-shadow hover:shadow-md ${
                        !a.isActive ? "opacity-55" : ""
                      }`}
                      style={{ borderLeftColor: tCfg.accent }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Icon */}
                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${tCfg.bg} ${tCfg.iconColor}`}>
                          <TypeIcon type={a.type} className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {a.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tCfg.badgeBg} ${tCfg.text}`}>
                              {tCfg.label}
                            </span>
                            <span
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pCfg.bg} ${pCfg.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`}
                              />
                              {pCfg.label} Priority
                            </span>
                            {a.fcmSent && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                Notified
                              </span>
                            )}
                            {!a.isActive && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {a.content}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              {formatDate(a.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {a.targetUserIds?.length > 0
                                ? `${a.targetUserIds.length} specific user${a.targetUserIds.length !== 1 ? "s" : ""}`
                                : a.targetRoles?.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")}
                            </span>
                            {a.expiresAt && (
                              <span className="flex items-center gap-1 text-orange-400">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Expires {formatDate(a.expiresAt)}
                              </span>
                            )}
                            <span className="font-mono text-gray-300">{a.id}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggle(a)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              a.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {a.isActive ? (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Active
                              </>
                            ) : "Inactive"}
                          </button>
                          <button
                            onClick={() => openEditModal(a)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(a.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto flex-1 px-6 py-5 space-y-5"
            >
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {formError}
                </div>
              )}

              {/* Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Announcement Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(ANNOUNCEMENT_TYPES).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, type: key }))
                      }
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        form.type === key
                          ? `${cfg.bg} ${cfg.border}`
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <span className={form.type === key ? cfg.iconColor : "text-gray-400"}>
                        <TypeIcon type={key} className="w-5 h-5" />
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          form.type === key ? cfg.text : "text-gray-700"
                        }`}
                      >
                        {cfg.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Unit Test – Mathematics on 15 March"
                  maxLength={120}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {form.title.length} / 120
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message / Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleFormChange}
                  placeholder="Write the full announcement here…"
                  rows={5}
                  maxLength={2000}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {form.content.length} / 2000
                </p>
              </div>

              {/* Priority & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Priority
                  </label>
                  <CustomSelect
                    value={form.priority}
                    onChange={(v) => setForm((p) => ({ ...p, priority: v }))}
                    options={PRIORITY_OPTIONS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Expiry Date{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Audience <span className="text-red-500">*</span>
                </label>

                {/* Mode Toggle */}
                <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-3">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, targetingMode: "roles" }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
                      form.targetingMode === "roles"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    By Role (All in group)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, targetingMode: "specific" }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition border-l border-gray-200 ${
                      form.targetingMode === "specific"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Specific Users
                  </button>
                </div>

                {/* ── By Role checkboxes ── */}
                {form.targetingMode === "roles" && (
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "student", label: "All Students", d: "M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM12 11a4 4 0 110-8 4 4 0 010 8z" },
                      { value: "parent",  label: "All Parents",  d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
                      { value: "teacher", label: "All Teachers", d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
                    ].map(({ value, label, d }) => (
                      <label
                        key={value}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition select-none ${
                          form.targetRoles.includes(value)
                            ? "border-indigo-400 bg-indigo-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.targetRoles.includes(value)}
                          onChange={() => handleRoleToggle(value)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <svg className={`w-4 h-4 ${form.targetRoles.includes(value) ? "text-indigo-600" : "text-gray-400"}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                        </svg>
                        <span className={`text-sm font-medium ${form.targetRoles.includes(value) ? "text-indigo-700" : "text-gray-700"}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* ── Specific Users picker ── */}
                {form.targetingMode === "specific" && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Search */}
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <div className="relative">
                        <svg className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search users by name or email…"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                      </div>
                      {form.targetUserIds.length > 0 && (
                        <p className="text-xs text-indigo-600 font-medium mt-1.5">
                          {form.targetUserIds.length} user{form.targetUserIds.length !== 1 ? "s" : ""} selected
                        </p>
                      )}
                    </div>

                    {/* User list grouped by role */}
                    <div className="max-h-60 overflow-y-auto">
                      {usersLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
                        </div>
                      ) : (
                        ["student", "parent", "teacher"].map((role) => {
                          const users = groupedUsers[role];
                          if (!users || users.length === 0) return null;
                          const roleUids = allUsers.filter((u) => u.role === role).map((u) => u.uid);
                          const allRoleSelected = roleUids.length > 0 && roleUids.every((uid) => form.targetUserIds.includes(uid));
                          return (
                            <div key={role}>
                              {/* Role group header */}
                              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                  {role.charAt(0).toUpperCase() + role.slice(1)}s
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSelectAllRole(role)}
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full transition ${
                                    allRoleSelected
                                      ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                  }`}
                                >
                                  {allRoleSelected ? "Deselect All" : "Select All"}
                                </button>
                              </div>
                              {/* User rows */}
                              {users.map((u) => (
                                <label
                                  key={u.uid}
                                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${
                                    form.targetUserIds.includes(u.uid) ? "bg-indigo-50" : ""
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={form.targetUserIds.includes(u.uid)}
                                    onChange={() => handleUserToggle(u.uid)}
                                    className="w-4 h-4 text-indigo-600 rounded shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                                    {u.email && <p className="text-xs text-gray-400 truncate">{u.email}</p>}
                                  </div>
                                </label>
                              ))}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Publish toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                  className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Publish immediately (mark as active)
                </label>
              </div>

              {/* FCM info note (only for new announcements) */}
              {!editingId && (
                <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-xl text-sm text-indigo-700">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>
                    A push notification will be automatically sent to all
                    subscribed users matching the selected audience via Firebase
                    Cloud Messaging (FCM).
                  </span>
                </div>
              )}
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 transition"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving…
                  </>
                ) : editingId ? (
                  "Update"
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Announcement?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ManageAnnouncements;

