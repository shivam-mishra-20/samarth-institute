import RoleFeatureHub from "../components/dashboard/RoleFeatureHub";
import { useAuth } from "../context/AuthContext";

const TeacherDashboard = () => {
  const { userData, user } = useAuth();

  return (
    <RoleFeatureHub
      role="teacher"
      title="Teacher Dashboard"
      subtitle="Manage classes, student progress and communication"
      userName={userData?.name || user?.email || "Teacher"}
    />
  );
};

export default TeacherDashboard;
