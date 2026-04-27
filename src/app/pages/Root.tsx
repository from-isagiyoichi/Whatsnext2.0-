import { Outlet, useNavigate, useLocation } from "react-router";
import { Toaster } from "../components/ui/sonner";
import { useEffect } from "react";
import { initializeStudentsStorage } from "../utils/auth";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize students data in localStorage on app startup
    initializeStudentsStorage();
    
    // Check authentication on initial load
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    // If not authenticated and trying to access root, redirect to login
    if (!userName || !userEmail) {
      if (location.pathname === "/" || (location.pathname !== "/login" && location.pathname !== "*")) {
        navigate("/login");
      }
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-black">
      <Outlet />
      <Toaster />
    </div>
  );
}