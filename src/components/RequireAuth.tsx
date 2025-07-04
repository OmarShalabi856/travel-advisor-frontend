import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../services/useAuth";

export default function RequireAuth() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn()) {
    const redirectTo = location.pathname + location.search;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} replace />;
  }

  return <Outlet />;
}
