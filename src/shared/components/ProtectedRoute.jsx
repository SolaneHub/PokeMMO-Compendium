import { Navigate } from "react-router-dom";

import { useAuth } from "@/shared/context/AuthContext";
import { useAdminCheck } from "@/shared/hooks/useAdminCheck";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();
  const { isAdmin: isUserAdmin, loading: adminLoading } =
    useAdminCheck(adminOnly);

  if (loading || (adminOnly && adminLoading)) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-white">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
