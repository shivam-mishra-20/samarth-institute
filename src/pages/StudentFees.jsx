import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { USER_ROLES } from "../constants/roles";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

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
  [FEE_STATUS.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-300",
  [FEE_STATUS.PARTIAL]: "bg-blue-100 text-blue-800 border-blue-300",
  [FEE_STATUS.PAID]: "bg-green-100 text-green-800 border-green-300",
  [FEE_STATUS.OVERDUE]: "bg-red-100 text-red-800 border-red-300",
};

const StudentFees = () => {
  const { user, userData, isParent, isStudent } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [feeRecord, setFeeRecord] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isParent && !isStudent) {
      navigate("/unauthorized");
      return;
    }
    fetchFeeData();
  }, [isParent, isStudent, userData, user]);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      setError("");

      let studentsSnapshot;

      if (isStudent) {
        const ownStudentQuery = query(
          collection(db, "users"),
          where("uid", "==", user.uid),
          where("role", "==", USER_ROLES.STUDENT),
        );
        studentsSnapshot = await getDocs(ownStudentQuery);
      } else {
        if (!userData?.studentUid) {
          setError("No linked student found. Please contact administrator.");
          setLoading(false);
          return;
        }

        const linkedStudentQuery = query(
          collection(db, "users"),
          where("customUid", "==", userData.studentUid),
          where("role", "==", USER_ROLES.STUDENT),
        );
        studentsSnapshot = await getDocs(linkedStudentQuery);
      }

      if (studentsSnapshot.empty) {
        setError(
          isStudent
            ? "Student profile not found. Please contact administrator."
            : "Linked student not found. Please contact administrator.",
        );
        setLoading(false);
        return;
      }

      const studentDoc = studentsSnapshot.docs[0];
      const student = { id: studentDoc.id, ...studentDoc.data() };
      setStudentInfo(student);

      // Fetch fee record for this student
      const feesQuery = query(
        collection(db, "fees"),
        where("studentId", "==", student.id),
      );
      const feesSnapshot = await getDocs(feesQuery);

      if (!feesSnapshot.empty) {
        const feeData = {
          id: feesSnapshot.docs[0].id,
          ...feesSnapshot.docs[0].data(),
        };
        setFeeRecord(feeData);
      }
    } catch (err) {
      setError("Failed to fetch fee information");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate fee status
  const calculateFeeStatus = (record) => {
    if (!record) return null;

    const totalPaid =
      record.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalDue = record.totalAmount || 0;
    const dueDate = new Date(record.dueDate);
    const today = new Date();

    if (totalPaid >= totalDue) return FEE_STATUS.PAID;
    if (totalPaid > 0) return FEE_STATUS.PARTIAL;
    if (dueDate < today) return FEE_STATUS.OVERDUE;
    return FEE_STATUS.PENDING;
  };

  const totalPaid =
    feeRecord?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const totalDue = feeRecord?.totalAmount || 0;
  const balance = totalDue - totalPaid;
  const status = calculateFeeStatus(feeRecord);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
          <Sidebar mobileTopBarMode="inline" />
          <div className="flex-1 pt-3 sm:pt-4 md:pt-28 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-gray-600">Loading fee information...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
        <Sidebar mobileTopBarMode="inline" />
        <div className="flex-1 pt-3 sm:pt-4 md:pt-28 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl bg-linear-to-br from-yellow-500 via-amber-500 to-orange-500 mb-8">
              <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-amber-100/30 blur-2xl" />
              <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 ring-1 ring-white/25 text-xs font-semibold uppercase tracking-wide">
                    Fee Snapshot
                  </div>
                  <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight">
                    My Child's Fees
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-white/90">
                    View fee status and payment history in one place.
                  </p>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-lg bg-white/15 text-white ring-1 ring-white/35 hover:bg-white/25 transition-colors self-start"
                >
                  ← Back
                </button>
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Student Info */}
            {studentInfo && (
              <div className="bg-white shadow rounded-lg mb-6 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Student Information
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Name</p>
                    <p className="font-semibold text-gray-900">
                      {studentInfo.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Student UID
                    </p>
                    <p className="font-mono font-semibold text-gray-900">
                      {studentInfo.customUid}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Class</p>
                    <p className="font-semibold text-gray-900">
                      {studentInfo.class || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Batch</p>
                    <p className="font-semibold text-gray-900">
                      {studentInfo.batch || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Fee Summary */}
            {feeRecord ? (
              <>
                <div className="bg-white shadow rounded-lg mb-6 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Fee Summary
                  </h2>

                  {/* Status Badge */}
                  <div className="mb-6">
                    <span
                      className={`px-4 py-2 text-sm font-semibold rounded-full border ${FEE_STATUS_COLORS[status]}`}
                    >
                      {FEE_STATUS_LABELS[status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">
                        Total Fee
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{totalDue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs text-green-600 uppercase">
                        Amount Paid
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{totalPaid.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${balance > 0 ? "bg-red-50" : "bg-green-50"}`}
                    >
                      <p
                        className={`text-xs uppercase ${balance > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        Balance Due
                      </p>
                      <p
                        className={`text-2xl font-bold ${balance > 0 ? "text-red-700" : "text-green-700"}`}
                      >
                        ₹{balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">
                        Due Date
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(feeRecord.dueDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Description:</span>{" "}
                        <span className="font-medium">
                          {feeRecord.description || "Tuition Fee"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Academic Year:</span>{" "}
                        <span className="font-medium">
                          {feeRecord.academicYear || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                {feeRecord.payments && feeRecord.payments.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Payment History
                    </h2>
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
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {feeRecord.payments
                            .sort(
                              (a, b) =>
                                new Date(b.paymentDate) -
                                new Date(a.paymentDate),
                            )
                            .map((payment, index) => (
                              <tr key={payment.id || index}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(
                                    payment.paymentDate,
                                  ).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-green-600">
                                  ₹{payment.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                                  {payment.paymentMethod?.replace("_", " ") ||
                                    "Cash"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 font-mono">
                                  {payment.receiptNumber || "—"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No Fee Record
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fee information for your child has not been set up yet. Please
                  contact the administrator.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentFees;

