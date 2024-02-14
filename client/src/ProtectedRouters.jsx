import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouters() {
  const { isAuthentcated } = useAuth();
  if (!isAuthentcated) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default ProtectedRouters;
