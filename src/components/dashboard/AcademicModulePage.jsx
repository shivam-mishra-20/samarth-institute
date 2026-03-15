import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Input, Select } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { db } from "../../config/firebase.config";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../constants/roles";
import { buildLogicalDocId, getClassBatchTag, getDateKey } from "../../utils/firestoreNaming";
import { isBatchRequiredForClass, normalizeBatchForClass } from "../../utils/classBatchPolicy";

const { TextArea } = Input;

const inputForField = (field, value, onChange) => {
  if (field.type === "select") {
    return (
      <Select
        value={value || undefined}
        onChange={(next) => onChange(field.name, next)}
        placeholder={field.placeholder || `Select ${field.label}`}
        options={field.options || []}
        size="large"
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <TextArea
        value={value || ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder || field.label}
        rows={4}
      />
    );
  }

  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(field.name, e.target.value)}
      type={field.type || "text"}
      placeholder={field.placeholder || field.label}
      size="large"
    />
  );
};

const formatRecordDate = (record) => {
  const dateLike =
    record.updatedAt?.toDate?.() ||
    record.createdAt?.toDate?.() ||
    record.updatedAt ||
    record.createdAt ||
    record.eventDate ||
    record.dueDate ||
    record.examDate;

  if (!dateLike) return "";
  return new Date(dateLike).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AcademicModulePage = ({
  pageTitle,
  pageSubtitle,
  collectionName,
  documentPrefix,
  primaryField,
  fields,
  managerLabel,
  filterableField,
  allowParents = true,
  themeColor = "blue",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    user,
    userRole,
    userData,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
  } = useAuth();

  const canManage = isAdmin || isTeacher;
  const canView = isStudent || isParent || canManage;
  const parentAllowed = !isParent || allowParents;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [viewerClass, setViewerClass] = useState("");
  const [viewerBatch, setViewerBatch] = useState("");

  const [form, setForm] = useState({});

  const filterValue = searchParams.get(filterableField || "") || "";
  const requiresBatchForSelectedClass = isBatchRequiredForClass(selectedClass);

  useEffect(() => {
    if (filterableField && filterValue) {
      setForm((prev) => ({ ...prev, [filterableField]: filterValue }));
    }
  }, [filterableField, filterValue]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");
      try {
        if (!canView || !parentAllowed) {
          setError("You are not authorized to view this module.");
          setLoading(false);
          return;
        }

        if (canManage) {
          const usersSnapshot = await getDocs(
            query(collection(db, "users"), where("role", "==", USER_ROLES.STUDENT)),
          );

          const students = usersSnapshot.docs.map((d) => d.data());
          const classOptions = [...new Set(students.map((s) => s.class).filter(Boolean))]
            .sort()
            .map((value) => ({ label: value, value }));

          setClasses(classOptions);
        }

        if (isStudent) {
          setViewerClass(userData?.class || "");
          setViewerBatch(normalizeBatchForClass(userData?.class, userData?.batch));
        }

        if (isParent && userData?.studentUid) {
          const studentSnapshot = await getDocs(
            query(collection(db, "users"), where("customUid", "==", userData.studentUid)),
          );

          if (!studentSnapshot.empty) {
            const linked = studentSnapshot.docs[0].data();
            setViewerClass(linked.class || "");
            setViewerBatch(normalizeBatchForClass(linked.class, linked.batch));
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load module settings");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [canManage, canView, isParent, isStudent, parentAllowed, userData]);

  useEffect(() => {
    if (!selectedClass || !canManage || !isBatchRequiredForClass(selectedClass)) {
      setBatches([]);
      setSelectedBatch("");
      return;
    }

    const loadBatches = async () => {
      const usersSnapshot = await getDocs(
        query(
          collection(db, "users"),
          where("role", "==", USER_ROLES.STUDENT),
          where("class", "==", selectedClass),
        ),
      );

      const batchOptions = [...new Set(usersSnapshot.docs.map((d) => d.data().batch).filter(Boolean))]
        .sort()
        .map((value) => ({ label: value, value }));

      setBatches(batchOptions);
    };

    loadBatches();
  }, [canManage, selectedClass]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const snapshot = await getDocs(collection(db, collectionName));

      let next = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (isStudent || isParent) {
        next = next.filter(
          (r) =>
            (!viewerClass || r.className === viewerClass || r.className === "all") &&
            (!viewerBatch || r.batchName === viewerBatch || r.batchName === "all"),
        );
      }

      if (selectedClass) {
        next = next.filter((r) => r.className === selectedClass || r.className === "all");
      }

      if (requiresBatchForSelectedClass && selectedBatch) {
        next = next.filter((r) => r.batchName === selectedBatch || r.batchName === "all");
      }

      if (filterableField && form[filterableField]) {
        next = next.filter((r) => r[filterableField] === form[filterableField]);
      }

      next.sort((a, b) => {
        const aTime = new Date(a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || b.createdAt || 0).getTime();
        return bTime - aTime;
      });

      setRecords(next);
    } catch (err) {
      setError(err.message || "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canView && parentAllowed) {
      fetchRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerClass, viewerBatch, selectedClass, selectedBatch, form[filterableField], requiresBatchForSelectedClass]);

  const clearForm = () => {
    setForm(filterableField && filterValue ? { [filterableField]: filterValue } : {});
  };

  const handleFieldChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (filterableField && name === filterableField) {
      if (value) {
        searchParams.set(filterableField, value);
      } else {
        searchParams.delete(filterableField);
      }
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const missingField = fields.find((field) => field.required && !form[field.name]);
      if (missingField) {
        setError(`${missingField.label} is required`);
        setSaving(false);
        return;
      }

      const className = selectedClass || "all";
      const batchName = requiresBatchForSelectedClass
        ? selectedBatch || "all"
        : "all";
      const idValue = form[primaryField] || managerLabel || pageTitle;

      const logicalDocId = buildLogicalDocId(
        documentPrefix,
        getClassBatchTag(className, batchName),
        idValue,
        getDateKey(form.eventDate || form.dueDate || form.examDate || new Date()),
      );

      const payload = {
        className,
        batchName,
        audience: className === "all" && batchName === "all" ? "all" : "targeted",
        createdByUid: user?.uid,
        createdByRole: userRole,
        updatedAt: serverTimestamp(),
        ...form,
      };

      const docRef = doc(db, collectionName, logicalDocId);
      await setDoc(docRef, { ...payload, createdAt: serverTimestamp() }, { merge: true });

      setSuccess(`${pageTitle} saved successfully.`);
      clearForm();
      await fetchRecords();
    } catch (err) {
      setError(err.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (recordId) => {
    try {
      await deleteDoc(doc(db, collectionName, recordId));
      setSuccess(`${pageTitle} entry deleted.`);
      await fetchRecords();
    } catch (err) {
      setError(err.message || "Failed to delete record");
    }
  };

  const classBatchInfo = useMemo(() => {
    if (isStudent || isParent) {
      const batchText = isBatchRequiredForClass(viewerClass)
        ? viewerBatch || "No batch"
        : "No batch (Class 5-10)";
      return `${viewerClass || "No class"} | ${batchText}`;
    }

    return selectedClass || selectedBatch
      ? `${selectedClass || "All Classes"} | ${requiresBatchForSelectedClass ? (selectedBatch || "All Batches") : "No batch (Class 5-10)"}`
      : "All Classes | All Batches";
  }, [
    isParent,
    isStudent,
    selectedBatch,
    selectedClass,
    viewerBatch,
    viewerClass,
    requiresBatchForSelectedClass,
  ]);

  const pageThemes = {
    blue:   { gradient: "from-blue-600 via-indigo-500 to-sky-500",      orb1: "bg-blue-400/25",   orb2: "bg-sky-300/20",    hb: "border-blue-500 bg-blue-50 text-blue-800",      rb: "border-l-blue-500",   rh: "hover:border-blue-200 hover:bg-blue-50/40"   },
    indigo: { gradient: "from-indigo-600 via-blue-600 to-violet-600",   orb1: "bg-violet-400/25", orb2: "bg-indigo-300/20", hb: "border-indigo-500 bg-indigo-50 text-indigo-800", rb: "border-l-indigo-500", rh: "hover:border-indigo-200 hover:bg-indigo-50/40" },
    teal:   { gradient: "from-teal-500 via-emerald-500 to-cyan-600",    orb1: "bg-teal-300/25",   orb2: "bg-emerald-300/20", hb: "border-teal-500 bg-teal-50 text-teal-800",      rb: "border-l-teal-500",   rh: "hover:border-teal-200 hover:bg-teal-50/40"   },
    orange: { gradient: "from-orange-500 via-amber-500 to-yellow-500",  orb1: "bg-amber-300/25",  orb2: "bg-orange-300/20", hb: "border-orange-500 bg-orange-50 text-orange-800", rb: "border-l-orange-500", rh: "hover:border-orange-200 hover:bg-orange-50/40" },
    violet: { gradient: "from-violet-600 via-purple-600 to-indigo-600", orb1: "bg-purple-400/25", orb2: "bg-violet-300/20", hb: "border-violet-500 bg-violet-50 text-violet-800", rb: "border-l-violet-500", rh: "hover:border-violet-200 hover:bg-violet-50/40" },
    cyan:   { gradient: "from-cyan-500 via-sky-500 to-blue-500",        orb1: "bg-sky-300/25",    orb2: "bg-cyan-300/20",   hb: "border-cyan-500 bg-cyan-50 text-cyan-800",      rb: "border-l-cyan-500",   rh: "hover:border-cyan-200 hover:bg-cyan-50/40"   },
    pink:   { gradient: "from-pink-500 via-rose-500 to-red-500",        orb1: "bg-rose-400/25",   orb2: "bg-pink-300/20",   hb: "border-pink-500 bg-pink-50 text-pink-800",      rb: "border-l-pink-500",   rh: "hover:border-pink-200 hover:bg-pink-50/40"   },
  };
  const tc = pageThemes[themeColor] || pageThemes.blue;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
        <Sidebar mobileTopBarMode="inline" />
        <main className="flex-1 pt-3 sm:pt-4 md:pt-28 px-3 sm:px-6 pb-12">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* ── Hero Banner ── */}
            <section className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl bg-linear-to-br ${tc.gradient}`}>
              <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${tc.orb1} blur-3xl`} />
              <div className={`pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full ${tc.orb2} blur-3xl`} />
              <p className="relative text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">{managerLabel}</p>
              <h1 className="relative mt-1 text-2xl font-extrabold tracking-tight drop-shadow sm:text-3xl">{pageTitle}</h1>
              <p className="relative mt-1.5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">{pageSubtitle}</p>
              <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 ring-1 ring-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-white/80" />
                Scope: {classBatchInfo}
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {success}
              </div>
            )}

            {canManage && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-l-4 text-sm font-bold mb-5 ${tc.hb}`}>
                  ✏️ Create / Update
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Class</label>
                    <Select
                      value={selectedClass || undefined}
                      onChange={setSelectedClass}
                      allowClear
                      size="large"
                      placeholder="Select class"
                      options={classes}
                      className="w-full"
                    />
                  </div>
                  {requiresBatchForSelectedClass && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Batch</label>
                      <Select
                        value={selectedBatch || undefined}
                        onChange={setSelectedBatch}
                        allowClear
                        size="large"
                        placeholder="Select batch"
                        options={batches}
                        className="w-full"
                      />
                    </div>
                  )}
                  {fields.map((field) => (
                    <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        {field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}
                      </label>
                      {inputForField(field, form[field.name], handleFieldChange)}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <Button type="primary" size="large" loading={saving} onClick={handleSave}>
                    Save Entry
                  </Button>
                  <Button size="large" onClick={clearForm}>Reset</Button>
                </div>
              </section>
            )}

            {(canManage || filterableField) && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-l-4 text-sm font-bold mb-5 ${tc.hb}`}>
                  🔍 Filters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {canManage && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Class</label>
                      <Select
                        value={selectedClass || undefined}
                        onChange={setSelectedClass}
                        allowClear
                        size="large"
                        placeholder="Filter by class"
                        options={classes}
                        className="w-full"
                      />
                    </div>
                  )}
                  {canManage && requiresBatchForSelectedClass && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Batch</label>
                      <Select
                        value={selectedBatch || undefined}
                        onChange={setSelectedBatch}
                        allowClear
                        size="large"
                        placeholder="Filter by batch"
                        options={batches}
                        className="w-full"
                      />
                    </div>
                  )}
                  {filterableField && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{filterableField}</label>
                      <Select
                        value={form[filterableField] || undefined}
                        onChange={(next) => handleFieldChange(filterableField, next)}
                        allowClear
                        size="large"
                        placeholder={`Filter by ${filterableField}`}
                        options={(fields.find((f) => f.name === filterableField)?.options) || []}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-l-4 text-sm font-bold mb-4 ${tc.hb}`}>
                📋 Recent Entries
              </div>
              {loading ? (
                <div className="flex items-center gap-3 py-8 text-slate-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                  Loading records…
                </div>
              ) : records.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">📭</div>
                  <p className="font-medium text-slate-500">No records found</p>
                  <p className="mt-1 text-sm text-slate-400">No entries match the current filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((record) => (
                    <article key={record.id} className={`group rounded-2xl border border-slate-200 border-l-4 ${tc.rb} bg-white p-4 shadow-sm transition-all duration-150 ${tc.rh}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base leading-snug">
                            {record[primaryField] || "Untitled"}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {record.className || "all"} · {record.batchName || "all"}
                            {formatRecordDate(record) ? ` · ${formatRecordDate(record)}` : ""}
                          </p>
                        </div>
                        {canManage && (
                          <Button danger size="small" onClick={() => handleDelete(record.id)} className="shrink-0">
                            Delete
                          </Button>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                        {fields
                          .filter((field) => field.name !== primaryField)
                          .map((field) => (
                            <p key={`${record.id}-${field.name}`} className="line-clamp-2 text-sm text-slate-600">
                              <span className="font-semibold text-slate-700">{field.label}:</span>{" "}
                              {record[field.name] || "—"}
                            </p>
                          ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AcademicModulePage;
