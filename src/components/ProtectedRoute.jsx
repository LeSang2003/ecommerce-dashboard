import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  // chưa login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  // có yêu cầu role nhưng không đúng
  if (role && user?.role !== role) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default ProtectedRoute;
