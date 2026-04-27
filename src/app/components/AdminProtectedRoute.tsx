import { Navigate } from "react-router";
import { AuthService } from "../services/authService";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const isAdminLoggedIn = AuthService.isAdminLoggedIn();

  if (!isAdminLoggedIn) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
