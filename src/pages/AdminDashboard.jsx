import RoleFeatureHub from "../components/dashboard/RoleFeatureHub";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { userData, user } = useAuth();

  return (
    <RoleFeatureHub
      role="admin"
      title="Admin Dashboard"
      subtitle="Control operations, academics and institution-wide communication"
      userName={userData?.name || user?.email || "Admin"}
    />
  );
};

export default AdminDashboard;
