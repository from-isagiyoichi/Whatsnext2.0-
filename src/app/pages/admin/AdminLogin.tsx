import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Mail, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthService } from "../../services/authService";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await AuthService.adminLogin(email, password);
      
      if (result.success) {
        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      } else {
        toast.error(result.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl mb-4 shadow-lg shadow-red-500/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-white/60 text-sm">whatsnext? Management System</p>
        </div>



        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3 text-red-500" />
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                placeholder="admin@mbcet.ac.in"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3 text-red-500" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-600/20 mt-6"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => navigate("/login")}
              className="w-full text-white/60 hover:text-white text-sm transition-colors"
            >
              Back to Student Login
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          MBCET Admin Access Only • Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}
