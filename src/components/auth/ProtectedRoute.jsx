import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        {" "}
        Loading...{" "}
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;
