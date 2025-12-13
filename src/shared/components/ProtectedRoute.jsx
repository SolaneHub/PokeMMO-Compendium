import { Navigate } from "react-router-dom";

import { useAuth } from "@/shared/context/AuthContext";
import { isAdmin } from "@/shared/utils/adminUtils"; // Updated import path

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-white">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin(currentUser.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
