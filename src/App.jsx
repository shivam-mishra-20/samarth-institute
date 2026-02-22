import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Faculties from "./pages/Faculties";
import Faculty from "./pages/Faculty";
import About from "./pages/About";
import Academic from "./pages/Academic";
import PreFoundationClass6 from "./pages/academic/PreFoundationClass6";
import PreFoundationClass7 from "./pages/academic/PreFoundationClass7";
import PreFoundationClass8 from "./pages/academic/PreFoundationClass8";
import FoundationClass9 from "./pages/academic/FoundationClass9";
import FoundationClass10 from "./pages/academic/FoundationClass10";
import AfterBoardsEklavy from "./pages/academic/AfterBoardsEklavy";
import AfterBoardsArjuna from "./pages/academic/AfterBoardsArjuna";
import IntegratedNTSE from "./pages/academic/IntegratedNTSE";
import IntegratedIIT from "./pages/academic/IntegratedIIT";
import IntegratedNEET from "./pages/academic/IntegratedNEET";
import CourseDetail from "./pages/CourseDetail";
import CourseCategory from "./pages/CourseCategory";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import StudentCorner from "./pages/StudentCorner";
import ResultsShowcase from "./pages/ResultsShowcase";
import TeacherRegistration from "./pages/TeacherRegistration";
import TeacherApplications from "./pages/TeacherApplications";
import ScholarshipApplications from "./pages/ScholarshipApplications";
import ContactEnquiries from "./pages/ContactEnquiries";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";
import SetupUsers from "./pages/SetupUsers";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { USER_ROLES } from "./constants/roles";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/courses/category/:categorySlug"
            element={<CourseCategory />}
          />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/about" element={<About />} />
          <Route path="/academic" element={<Academic />} />
          <Route
            path="/academic/pre-foundation/class-6"
            element={<PreFoundationClass6 />}
          />
          <Route
            path="/academic/pre-foundation/class-7"
            element={<PreFoundationClass7 />}
          />
          <Route
            path="/academic/pre-foundation/class-8"
            element={<PreFoundationClass8 />}
          />
          <Route
            path="/academic/foundation/class-9"
            element={<FoundationClass9 />}
          />
          <Route
            path="/academic/foundation/class-10"
            element={<FoundationClass10 />}
          />
          <Route
            path="/academic/after-boards/eklavy-neet"
            element={<AfterBoardsEklavy />}
          />
          <Route
            path="/academic/after-boards/arjuna-jee"
            element={<AfterBoardsArjuna />}
          />
          <Route
            path="/academic/integrated/ntse-olympiad"
            element={<IntegratedNTSE />}
          />
          <Route
            path="/academic/integrated/iit-nit"
            element={<IntegratedIIT />}
          />
          <Route
            path="/academic/integrated/neet"
            element={<IntegratedNEET />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/students-corner" element={<StudentCorner />} />
          <Route path="/results-showcase" element={<ResultsShowcase />} />
          <Route path="/join-team" element={<TeacherRegistration />} />
          <Route
            path="/teacher-applications"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <TeacherApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarship-applications"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.TEACHER]}>
                <ScholarshipApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact-enquiries"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <ContactEnquiries />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/setup-users" element={<SetupUsers />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute
                allowedRoles={[
                  USER_ROLES.STUDENT,
                  USER_ROLES.TEACHER,
                  USER_ROLES.ADMIN,
                ]}
              >
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="p-10 text-center">Signup Page Placeholder</div>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute
                allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.TEACHER]}
              >
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute
                allowedRoles={[
                  USER_ROLES.STUDENT,
                  USER_ROLES.TEACHER,
                  USER_ROLES.ADMIN,
                ]}
              >
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute
                allowedRoles={[
                  USER_ROLES.TEACHER,
                  USER_ROLES.ADMIN,
                  USER_ROLES.STUDENT,
                ]}
              >
                <Results />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
