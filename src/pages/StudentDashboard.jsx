import RoleFeatureHub from "../components/dashboard/RoleFeatureHub";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { userData, user } = useAuth();

  return (
    <RoleFeatureHub
      role="student"
      title="Student Dashboard"
      subtitle="Your academic workspace with real-time updates"
      userName={userData?.name || user?.email || "Student"}
    />
  );
};

export default StudentDashboard;
