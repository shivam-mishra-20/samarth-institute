import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./marketing/Home";
import Courses from "./pages/Courses";
import Faculties from "./pages/Faculties";
import Faculty from "./pages/Faculty";
import About from "./pages/About";
import CourseDetail from "./pages/CourseDetail";
import CourseCategory from "./pages/CourseCategory";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
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
