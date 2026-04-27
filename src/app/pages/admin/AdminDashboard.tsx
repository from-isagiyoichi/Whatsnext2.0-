import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { 
  Calendar, 
  Users, 
  LogOut, 
  Shield, 
  ChevronRight,
  TrendingUp,
  Activity,
  Settings
} from "lucide-react";
import { AuthService } from "../../services/authService";
import { AdminService } from "../../services/adminService";
import { toast } from "sonner";

interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  count?: number;
  action: () => void;
  color: "red" | "yellow";
}

function DashboardCard({ icon: Icon, title, description, count, action, color }: DashboardCardProps) {
  const colorClasses = {
    red: "from-red-600/20 to-red-600/5 border-red-500/20 text-red-500",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-500"
  };

  return (
    <button
      onClick={action}
      className={`w-full bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 hover:scale-[1.02] transition-all active:scale-95 text-left`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[3]}`} />
        </div>
        <ChevronRight className="w-5 h-5 text-white/40" />
      </div>
      
      <h3 className="text-white text-lg font-bold mb-1">{title}</h3>
      <p className="text-white/60 text-sm mb-3">{description}</p>
      
      {count !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{count}</span>
          <span className="text-white/40 text-xs">total</span>
        </div>
      )}
    </button>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentCount, setStudentCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reload data whenever we navigate back to the dashboard
    loadDashboardData();
  }, [location]);

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data when window regains focus (e.g., navigating back from management pages)
    const handleFocus = () => loadDashboardData();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load students count
      const students = await AdminService.getAllStudents();
      setStudentCount(students.length);

      // Load events count
      const events = await AdminService.getAllEvents();
      setEventCount(events.length);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.adminLogout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-red-600/20 via-black to-yellow-500/10 pb-6 rounded-b-[2rem] shadow-xl border-b border-white/5 relative overflow-hidden z-10">
        <div className="relative z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold tracking-wide">Admin Panel</h1>
                <p className="text-white/60 text-xs">whatsnext? Management</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Quick Stats */}
        <section>
          <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Overview
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-4 h-4 text-red-500" />
                <span className="text-white/60 text-xs font-medium">Active Events</span>
              </div>
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <p className="text-white text-2xl font-bold">{eventCount}</p>
              )}
            </div>
            
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
                <span className="text-white/60 text-xs font-medium">Total Students</span>
              </div>
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <p className="text-white text-2xl font-bold">{studentCount.toLocaleString()}</p>
              )}
            </div>
          </div>
        </section>

        {/* Management Cards */}
        <section>
          <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Management
          </h2>
          
          <div className="space-y-4">
            <DashboardCard
              icon={Calendar}
              title="Events Management"
              description="Add, edit, or remove events"
              count={eventCount}
              action={() => navigate("/admin/events")}
              color="red"
            />
            
            <DashboardCard
              icon={Users}
              title="Students Management"
              description="Manage student database & access"
              count={studentCount}
              action={() => navigate("/admin/students")}
              color="yellow"
            />
            
            <DashboardCard
              icon={Settings}
              title="Admin Settings"
              description="Contact info & password settings"
              action={() => navigate("/admin/settings")}
              color="red"
            />
          </div>
        </section>

        {/* System Info */}
        <section className="pt-4">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              System Information
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Version</span>
                <span className="text-white font-medium">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Mode</span>
                <span className="text-yellow-500 font-medium">Mock (localStorage)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Backend</span>
                <span className="text-white/40 text-xs">Flask integration ready</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5">
                <span className="text-white/60">Data Sync Status</span>
                <span className="flex items-center gap-1.5 text-green-500 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
              <div className="text-white/40 text-xs leading-relaxed pt-1">
                Admin portal changes sync instantly to student portal via localStorage
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}