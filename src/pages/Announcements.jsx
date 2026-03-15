import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useFCMToken } from "../hooks/useFCMToken";
import { ANNOUNCEMENT_TYPES, TypeIcon } from "./ManageAnnouncements";

// ─── Config ───────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  low: { label: "Low", dot: "bg-gray-400", text: "text-gray-600" },
  medium: { label: "Medium", dot: "bg-orange-400", text: "text-orange-600" },
  high: { label: "High", dot: "bg-red-500", text: "text-red-600" },
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
};

// ─── In-App Notification Toast ────────────────────────────────────────────────

const ForegroundToast = ({ notification, onDismiss, onView }) => {
  if (!notification) return null;
  return (
    <div className="fixed top-24 right-4 z-50 max-w-sm w-full animate-slide-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 p-4 pr-10 relative">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">
              {notification.title}
            </p>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
              {notification.body}
            </p>
            <button
              onClick={onView}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View Announcement →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const Announcements = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(null);

  const {
    permission,
    foregroundNotification,
    clearForegroundNotification,
    requestPermissionAndGetToken,
  } = useFCMToken();

  // ── One-time fetch (avoids Firestore watch-stream assertion errors) ─────────
  useEffect(() => {
    let cancelled = false;
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const q = query(
          collection(db, "announcements"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        if (cancelled) return;
        const data = snapshot.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
            expiresAt: d.data().expiresAt?.toDate?.() ?? null,
          }))
          .filter((a) => a.isActive !== false)
          .filter((a) => !a.expiresAt || a.expiresAt > now)
          .filter((a) => {
            // Admins see every announcement (preview all targeting modes)
            if (userRole === "admin") return true;
            // Specific-user targeting takes precedence
            if (a.targetUserIds?.length > 0) {
              return a.targetUserIds.includes(user?.uid);
            }
            return (
              !a.targetRoles ||
              a.targetRoles.includes(userRole) ||
              a.targetRoles.includes("all")
            );
          });
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAnnouncements();
    return () => { cancelled = true; };
  }, [userRole, refreshKey, user?.uid]);

  // Refresh when a foreground push notification arrives
  useEffect(() => {
    if (foregroundNotification) {
      setRefreshKey((k) => k + 1);
    }
  }, [foregroundNotification]);

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

  // Group by date for display
  const grouped = filtered.reduce((acc, a) => {
    const day = new Date(a.createdAt).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(a);
    return acc;
  }, {});

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
        <Sidebar mobileTopBarMode="inline" />
        <div className="flex-1 pt-3 sm:pt-4 md:pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">

            {/* ── Header ── */}
            <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-purple-600 mb-8">
              <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-fuchsia-300/30 blur-2xl" />
              <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 ring-1 ring-white/25 text-xs font-semibold uppercase tracking-wide">
                    Live Updates
                  </div>
                  <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight flex items-center gap-2">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    Announcements
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-white/90 max-w-2xl">
                    Stay up-to-date with exam alerts, holidays, results, and more.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {permission !== "granted" && (
                    <button
                      onClick={requestPermissionAndGetToken}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Enable Push Notifications
                    </button>
                  )}
                  {permission === "granted" && (
                    <div className="flex items-center gap-2 text-sm text-white bg-white/15 px-3 py-2 rounded-xl ring-1 ring-white/25">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Push Notifications Active
                    </div>
                  )}
                  <button
                    onClick={() => setRefreshKey((k) => k + 1)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-white/15 ring-1 ring-white/25 text-white hover:bg-white/25 disabled:opacity-50 transition-all"
                    title="Refresh announcements"
                  >
                    <svg
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </section>

            {/* ── Type Summary Strip ── */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {Object.entries(ANNOUNCEMENT_TYPES).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() =>
                    setActiveFilter(activeFilter === key ? "all" : key)
                  }
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                    activeFilter === key
                      ? `${cfg.bg} ${cfg.border} shadow-sm`
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className={`${activeFilter === key ? cfg.iconColor : "text-gray-400"}`}>
                    <TypeIcon type={key} className="w-7 h-7" />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      activeFilter === key ? cfg.text : "text-gray-500"
                    }`}
                  >
                    {cfg.label}
                  </span>
                  {typeCounts[key] > 0 && (
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.text}`}
                    >
                      {typeCounts[key]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-5 flex flex-col sm:flex-row gap-3 items-center">
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
                {Object.entries(ANNOUNCEMENT_TYPES).map(([key, cfg]) =>
                  (typeCounts[key] || 0) > 0 ? (
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
                      {cfg.label} ({typeCounts[key]})
                    </button>
                  ) : null
                )}
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
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-full sm:w-56"
                />
              </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4" />
                <p className="text-gray-500 text-sm">Loading announcements…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No announcements yet
                </h3>
                <p className="text-gray-500 text-sm">
                  {searchTerm || activeFilter !== "all"
                    ? "Try a different filter or search term."
                    : "Check back later for updates from your institute."}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(grouped).map(([day, items]) => (
                  <div key={day}>
                    {/* Date separator */}
                    <div className="flex items-center gap-3 mb-4">
                      <hr className="flex-1 border-gray-200" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {day}
                      </span>
                      <hr className="flex-1 border-gray-200" />
                    </div>

                    <div className="space-y-3">
                      {items.map((a) => {
                        const tCfg =
                          ANNOUNCEMENT_TYPES[a.type] ||
                          ANNOUNCEMENT_TYPES.important_update;
                        const pCfg =
                          PRIORITY_CONFIG[a.priority] || PRIORITY_CONFIG.medium;
                        const isOpen = expanded === a.id;

                        return (
                          <div
                            key={a.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 overflow-hidden transition-shadow hover:shadow-md"
                            style={{ borderLeftColor: tCfg.accent }}
                          >
                            {/* Card Header – always visible */}
                            <button
                              className="w-full text-left p-5"
                              onClick={() =>
                                setExpanded(isOpen ? null : a.id)
                              }
                            >
                              <div className="flex items-start gap-4">
                                <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${tCfg.bg} ${tCfg.iconColor}`}>
                                  <TypeIcon type={a.type} className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tCfg.badgeBg} ${tCfg.text}`}
                                    >
                                      {tCfg.label}
                                    </span>
                                    <span
                                      className={`flex items-center gap-1 text-xs font-medium ${pCfg.text}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`}
                                      />
                                      {pCfg.label}
                                    </span>
                                    {a.expiresAt && (
                                      <span className="flex items-center gap-1 text-orange-500 font-medium text-xs">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Expires {formatDate(a.expiresAt)}
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-gray-900 text-base">
                                    {a.title}
                                  </h3>
                                  {!isOpen && (
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                      {a.content}
                                    </p>
                                  )}
                                </div>
                                {/* Expand / Collapse caret */}
                                <div className="shrink-0 flex flex-col items-end gap-1 ml-2">
                                  <span className="text-xs text-gray-400">
                                    {timeAgo(a.createdAt)}
                                  </span>
                                  <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform ${
                                      isOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    viewO="0 0 24 24"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </button>

                            {/* Expanded body */}
                            {isOpen && (
                              <div
                                className={`px-5 pb-5 pt-0 border-t ${tCfg.border}`}
                              >
                                <div
                                  className={`rounded-xl p-4 mt-3 ${tCfg.bg}`}
                                >
                                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                    {a.content}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Posted {formatDate(a.createdAt)}
                                  </span>
                                  {(a.targetUserIds?.length > 0 || a.targetRoles?.length > 0) && (
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                      {a.targetUserIds?.length > 0
                                        ? `${a.targetUserIds.length} specific user${a.targetUserIds.length !== 1 ? "s" : ""}`
                                        : a.targetRoles?.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Foreground Push Notification Toast ── */}
      <ForegroundToast
        notification={foregroundNotification}
        onDismiss={clearForegroundNotification}
        onView={() => {
          clearForegroundNotification();
          navigate("/announcements");
        }}
      />

      <Footer />
    </>
  );
};

export default Announcements;

