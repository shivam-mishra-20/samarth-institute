import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiBriefcase,
  FiMapPin,
  FiFileText,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { GraduationCap } from "lucide-react";
import { db } from "../config/firebase.config";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const TeacherRegistration = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    qualification: "",
    specialization: "",
    experience: "",
    currentlyTeaching: "",
    subjects: [],
    preferredClasses: [],
    resumeLink: "",
    aboutYourself: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const subjectOptions = [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "English",
    "Hindi",
    "Social Science",
    "Computer Science",
  ];
  const classOptions = [
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create document ID: fname_lastname_yy-mm-dd
      const now = new Date();
      const dateStr = `${String(now.getFullYear()).slice(-2)}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const docId = `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}_${dateStr}`;

      // Prepare data for Firestore
      const enquiryData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone || null,
        address: formData.address,
        city: formData.city,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: formData.experience,
        currentlyTeaching: formData.currentlyTeaching,
        subjects: formData.subjects,
        preferredClasses: formData.preferredClasses,
        resumeLink: formData.resumeLink || null,
        aboutYourself: formData.aboutYourself,
        appliedOn: serverTimestamp(),
        status: "pending", // pending, reviewed, contacted, rejected, hired
      };

      // Save to Firestore
      const enquiryRef = doc(collection(db, "teacherEnquiries"), docId);
      await setDoc(enquiryRef, enquiryData);

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        address: "",
        city: "",
        qualification: "",
        specialization: "",
        experience: "",
        currentlyTeaching: "",
        subjects: [],
        preferredClasses: [],
        resumeLink: "",
        aboutYourself: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <Navbar />

      <main className="grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-linear-to-r from-blue-600 via-blue-500 to-orange-400 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          {/* Decorative circles */}
          <div className="absolute -left-10 top-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute right-1/4 bottom-10 w-32 h-32 bg-orange-300/20 rounded-full blur-lg"></div>
          <div className="absolute -right-10 top-1/3 w-36 h-36 bg-blue-300/20 rounded-full blur-xl"></div>

          <div className="container-custom relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <GraduationCap className="w-4 h-4" />
                Join Our Team
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]">
                Teach at Samarth Institute
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Be a part of our mission to shape the future. Join our team of
                dedicated educators and make a difference in students' lives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-20 bg-white relative -mt-12 z-10">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12"
            >
              {/* Success Message */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-4"
                >
                  <FiCheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-800 mb-1">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-green-700 text-sm">
                      Thank you for your interest in joining Samarth Institute.
                      Our team will review your application and get back to you
                      within 3-5 business days.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4"
                >
                  <FiAlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-800 mb-1">
                      Submission Failed
                    </h3>
                    <p className="text-red-700 text-sm">
                      Something went wrong while submitting your application.
                      Please try again or contact us directly.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiPhone className="text-blue-600" />
                    Contact Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternate Phone
                      </label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Your city"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Enter your complete address"
                      />
                    </div>
                  </div>
                </div>

                {/* Educational Background */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Educational Background
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Highest Qualification *
                      </label>
                      <select
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none bg-white"
                      >
                        <option value="">Select Qualification</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="M.Sc">M.Sc</option>
                        <option value="B.Ed">B.Ed</option>
                        <option value="M.Ed">M.Ed</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization *
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="e.g., Physics, Organic Chemistry"
                      />
                    </div>
                  </div>
                </div>

                {/* Teaching Experience */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiBriefcase className="text-blue-600" />
                    Teaching Experience
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none bg-white"
                      >
                        <option value="">Select Experience</option>
                        <option value="Fresher">Fresher (0-1 years)</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currently Teaching At
                      </label>
                      <input
                        type="text"
                        name="currentlyTeaching"
                        value={formData.currentlyTeaching}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Institute/School name (if any)"
                      />
                    </div>
                  </div>
                </div>

                {/* Subjects & Classes */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiBook className="text-blue-600" />
                    Subjects & Classes
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Subjects You Can Teach *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {subjectOptions.map((subject) => (
                        <label
                          key={subject}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${
                            formData.subjects.includes(subject)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.subjects.includes(subject)}
                            onChange={() =>
                              handleCheckboxChange("subjects", subject)
                            }
                            className="sr-only"
                          />
                          {subject}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Classes *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {classOptions.map((cls) => (
                        <label
                          key={cls}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${
                            formData.preferredClasses.includes(cls)
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferredClasses.includes(cls)}
                            onChange={() =>
                              handleCheckboxChange("preferredClasses", cls)
                            }
                            className="sr-only"
                          />
                          {cls}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiFileText className="text-blue-600" />
                    Additional Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume/CV Link
                      </label>
                      <input
                        type="url"
                        name="resumeLink"
                        value={formData.resumeLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Google Drive or Dropbox link to your resume"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload your resume to Google Drive or Dropbox and paste
                        the shareable link
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tell Us About Yourself *
                      </label>
                      <textarea
                        name="aboutYourself"
                        value={formData.aboutYourself}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                        placeholder="Share your teaching philosophy, achievements, and why you want to join Samarth Institute..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      formData.subjects.length === 0 ||
                      formData.preferredClasses.length === 0
                    }
                    className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    By submitting this form, you agree to be contacted by
                    Samarth Institute regarding your application.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Join Samarth Institute?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Be a part of a team that's dedicated to excellence in education
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "Competitive Salary",
                  description:
                    "We offer industry-competitive compensation packages along with performance bonuses",
                },
                {
                  icon: "📈",
                  title: "Career Growth",
                  description:
                    "Regular training programs and opportunities for professional development",
                },
                {
                  icon: "🤝",
                  title: "Supportive Environment",
                  description:
                    "Work with a team of passionate educators in a collaborative atmosphere",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherRegistration;
