import RoleFeatureHub from "../components/dashboard/RoleFeatureHub";
import { useAuth } from "../context/AuthContext";

const ParentDashboard = () => {
  const { userData, user } = useAuth();

  return (
    <RoleFeatureHub
      role="parent"
      title="Parent Dashboard"
      subtitle="Monitor your child updates across school modules"
      userName={userData?.name || user?.email || "Parent"}
    />
  );
};

export default ParentDashboard;
