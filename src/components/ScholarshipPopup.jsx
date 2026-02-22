import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Users,
  Star,
  Trophy,
  Sparkles,
  Target,
  CheckCircle,
  Info,
  GraduationCap,
  AlertCircle,
  Ticket,
  User,
  Phone,
  Mail,
  School,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { db } from "../config/firebase.config";
import { collection, doc, setDoc } from "firebase/firestore";

const ScholarshipPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    classSelected: "",
    parentName: "",
    schoolName: "",
  });
  const [errors, setErrors] = useState({});

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter valid email address";
    }
    if (!formData.classSelected) newErrors.classSelected = "Please select a class";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Create document ID: fname_lname_yy-mm-dd_classSelected
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const classForId = formData.classSelected.replace(/\s+/g, "-").toLowerCase();
      const docId = `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}_${yy}-${mm}-${dd}_${classForId}`;

      const enquiryData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        classSelected: formData.classSelected,
        parentName: formData.parentName.trim(),
        schoolName: formData.schoolName.trim(),
        submittedAt: now.toISOString(),
        status: "pending",
      };

      await setDoc(doc(collection(db, "scholarshipEnquiries"), docId), enquiryData);
      
      setIsSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        classSelected: "",
        parentName: "",
        schoolName: "",
      });
    } catch (error) {
      console.error("Error submitting scholarship enquiry:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test dates - simple without early bird
  const testDates = [
    { date: "22nd February", day: "Sunday" },
    { date: "1st March", day: "Sunday" },
    { date: "8th March", day: "Sunday" },
    { date: "15th March", day: "Sunday" },
    { date: "22nd March", day: "Sunday" },
    { date: "29th March", day: "Sunday" },
  ];

  // Seat availability per class
  const seatData = [
    { class: "7th", total: 20, left: 15 },
    { class: "8th", total: 30, left: 24 },
    { class: "9th", total: 40, left: 36 },
    { class: "10th", total: 50, left: 42 },
    { class: "11th", stream: "Sci", total: 30, left: 28 },
    { class: "11th", stream: "Com", total: 30, left: 30 },
    { class: "12th", stream: "Sci", total: 30, left: 29 },
    { class: "12th", stream: "Com", total: 30, left: 30 },
  ];

  const totalSeatsLeft = seatData.reduce((acc, item) => acc + item.left, 0);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto no-scrollbar"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={22} />
            </button>

            {/* ===== HEADER SECTION - BLUE THEME ===== */}
            <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 pb-8 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-500/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                {/* Scholarship Badge */}
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500 text-white font-bold text-xs rounded-full shadow-lg animate-pulse">
                    <Star className="w-4 h-4 fill-current" />
                    ADMISSIONS OPEN 2026-27
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>

                {/* Main Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
                  Scholarship Test cum Admission
                </h2>

                {/* Main Discount Banner */}
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-700 font-black text-3xl md:text-4xl rounded-2xl shadow-xl">
                    <Trophy className="w-8 h-8 text-red-500" />
                    UP TO 90% OFF
                    <Trophy className="w-8 h-8 text-red-500" />
                  </div>
                </div>

                {/* Scholarship Pool */}
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-900/40 border-2 border-blue-300/50 rounded-full backdrop-blur-sm">
                    <GraduationCap className="w-5 h-5 text-blue-200" />
                    <span className="font-bold text-blue-100 text-lg">
                      ₹50 Lakh Scholarship Pool
                    </span>
                  </div>
                </div>

                {/* Sub info */}
                <p className="text-center text-blue-100 text-sm">
                  For Classes 6th to 12th | Merit-Based Scholarships
                </p>
              </div>
            </div>

            {/* ===== BODY SECTION ===== */}
            <div className="p-5 md:p-6 space-y-6">
              {/* ===== TEST DATES - HORIZONTAL SCROLL ===== */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Upcoming Test Dates
                </h3>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {testDates.map((item, i) => (
                    <div
                      key={i}
                      className={`shrink-0 w-36 p-4 rounded-xl border-2 text-center transition-all hover:shadow-lg hover:-translate-y-1 ${i === 0 ? "border-red-400 bg-red-50" : "border-blue-200 bg-blue-50/50"}`}
                    >
                      {i === 0 && (
                        <div className="text-[10px] font-bold text-red-600 mb-1 uppercase tracking-wide">
                          Next Test
                        </div>
                      )}
                      <Calendar
                        className={`w-5 h-5 mx-auto mb-2 ${i === 0 ? "text-red-500" : "text-blue-600"}`}
                      />
                      <p className="font-bold text-gray-800 text-sm">
                        {item.date}
                      </p>
                      <p className="text-xs text-gray-500">{item.day}</p>
                      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-blue-600">
                        <Clock className="w-3 h-3" /> 10 AM
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== TWO COLUMN LAYOUT: SEATS + SCHOLARSHIP ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left: Available Seats */}
                <div className="p-4 rounded-2xl border-2 border-blue-100 bg-blue-50/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-blue-600" />
                      Seats Available
                    </h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white font-bold text-xs rounded-full">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      {totalSeatsLeft} left
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {seatData.map((item, i) => {
                      const percentage =
                        ((item.total - item.left) / item.total) * 100;
                      return (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-white border border-blue-100 text-center"
                        >
                          <p className="font-bold text-gray-800 text-xs">
                            {item.class}
                            {item.stream ? ` ${item.stream}` : ""}
                          </p>
                          <p className="text-xl font-black text-blue-600 my-0.5">
                            {item.left}
                          </p>
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
                              style={{ width: `${100 - percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Scholarship Benefits */}
                <div className="p-4 rounded-2xl border-2 border-red-100 bg-red-50/30">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-red-500" />
                    Scholarship Benefits
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-100">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          Merit Scholarship
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-bold text-red-600">
                            Up to 90% OFF
                          </span>{" "}
                          on tuition fees
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-100">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          Priority Batch Selection
                        </p>
                        <p className="text-xs text-gray-600">
                          Choose your preferred batch timing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-red-100">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          Free Study Material
                        </p>
                        <p className="text-xs text-gray-600">
                          For top 10 scorers in each test
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== PREMIUM FEATURES - HORIZONTAL ===== */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      🧑‍🏫
                    </div>
                    <div>
                      <h4 className="font-bold">1:1 Mentoring</h4>
                      <p className="text-xs text-blue-100">
                        Personal guidance from expert faculty
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 rounded-xl bg-linear-to-r from-red-500 to-red-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      🎯
                    </div>
                    <div>
                      <h4 className="font-bold">Small Batches</h4>
                      <p className="text-xs text-red-100">
                        Only 20-25 students per batch
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== INFO NOTICE ===== */}
              <div className="p-4 rounded-xl bg-blue-50 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-blue-700">📢 Note:</span> Test
                  will be conducted offline at our center. Bring valid ID proof.
                  Results within 3 days.
                </p>
              </div>

              {/* ===== REGISTRATION FORM ===== */}
              <div className="p-5 rounded-2xl border-2 border-blue-100 bg-linear-to-br from-blue-50/50 to-indigo-50/50">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  Register for Scholarship Test
                </h3>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      Registration Successful!
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      We&apos;ll contact you soon with test details.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Register Another Student
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-colors ${
                              errors.firstName
                                ? "border-red-400 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
                            }`}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-colors ${
                              errors.lastName
                                ? "border-red-400 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
                            }`}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            maxLength={10}
                            className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-colors ${
                              errors.phone
                                ? "border-red-400 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-colors ${
                              errors.email
                                ? "border-red-400 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Class Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Select Class *
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="classSelected"
                          value={formData.classSelected}
                          onChange={handleInputChange}
                          className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-colors appearance-none bg-white ${
                            errors.classSelected
                              ? "border-red-400 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        >
                          <option value="">-- Select Class --</option>
                          {classOptions.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.classSelected && (
                        <p className="text-xs text-red-500 mt-1">{errors.classSelected}</p>
                      )}
                    </div>

                    {/* Optional Fields Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Parent&apos;s Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                            placeholder="Optional"
                            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          School Name
                        </label>
                        <div className="relative">
                          <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleInputChange}
                            placeholder="Optional"
                            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Register for Scholarship Test
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* ===== TERMS ===== */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-blue-600" />
                  Terms & Conditions
                </h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>
                    • Scholarship based on test performance (min 70% marks
                    required)
                  </li>
                  <li>• ₹50L pool distributed among deserving students</li>
                  <li>• 3-hour test (10 AM - 1 PM). No negative marking</li>
                  <li>
                    • Subject to seat availability and document verification
                  </li>
                </ul>
              </div>

              {/* ===== FOOTER ===== */}
              <div className="text-center py-2">
                <p className="text-sm font-semibold text-gray-800">
                  <span className="text-red-600">Limited Seats!</span> Register
                  today and secure your spot.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScholarshipPopup;
