import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is authenticated
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    // If not authenticated and not already on login page, redirect to login
    if ((!userName || !userEmail) && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, location]);
  
  return <>{children}</>;
}
