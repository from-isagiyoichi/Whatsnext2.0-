import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Phone, MessageCircle, X } from "lucide-react";
import logo from "figma:asset/d0e98858b0fb6c3077bf0c27b3941e385a98e57f.png";
import { validateCredentials } from "../utils/auth";
import { AuthService } from "../services/authService";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Check for admin credentials on the main login screen
    // Admin can access via student login form - auto-detects and routes to admin dashboard
    if (email.trim() === "Adminmbcet@mbcet.ac.in" && password === "therealadmin@mbcet") {
      const result = await AuthService.adminLogin(email, password);
      
      if (result.success) {
        setIsLoading(false);
        navigate("/admin/dashboard");
        return;
      } else {
        setIsLoading(false);
        setError(result.error || "Invalid admin credentials");
        return;
      }
    }
    
    // Simulate API call delay for student login
    setTimeout(() => {
      // Validate credentials against synchronized student list from localStorage
      // This reads from "studentsData" which is managed by the Admin Portal
      // Any changes in Admin Portal (add/edit/delete students) reflect here instantly
      const user = validateCredentials(email, password);
      
      if (user) {
        // Successful login
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);
        setIsLoading(false);
        navigate("/");
      } else {
        // Failed login
        setIsLoading(false);
        setError("Invalid email or password. Please check your credentials.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto mb-6 relative group">
             <div className="absolute inset-0 bg-yellow-500/20 rounded-xl blur-xl group-hover:bg-yellow-500/40 transition-all duration-500" />
             <img 
              src={logo} 
              alt="whatsnext?" 
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300 rounded-[10px]" 
             />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">whatsnext?</h1>
            <p className="text-yellow-500/80 font-medium text-sm mt-2 tracking-wide">MBCET EVENTS DISCOVERY</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error on input change
                }}
                required
                placeholder="College Email ID"
                className={`block w-full pl-11 pr-4 py-4 bg-white/5 border text-white placeholder-white/40 focus:outline-none transition-all ${ error ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50" : "border-white/10 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50" } rounded-[14px]`}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error on input change
                }}
                required
                placeholder="Password"
                className={`block w-full pl-11 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none transition-all ${
                  error 
                    ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50" 
                    : "border-white/10 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/60 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="rounded bg-white/10 border-white/20 text-yellow-500 focus:ring-yellow-500/50" />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm">
          Don't have an account?{" "}
          <button 
            type="button"
            className="text-white font-medium hover:underline decoration-yellow-500 decoration-2 underline-offset-4"
            onClick={() => setShowContactModal(true)}
          >
            Contact Admin
          </button>
        </p>

        {/* Help Text */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs text-center leading-relaxed">
            <span className="text-yellow-500 font-semibold">Authorized Access Only</span><br />
            Only registered MBCET students can log in.<br />
            Use your college email and provided password.
          </p>
        </div>

        {/* Debug Info - Shows sync is working */}
        <div className="text-center text-white/40 text-[10px] mt-2">
          System synchronized with {(() => {
            const data = localStorage.getItem("studentsData");
            return data ? JSON.parse(data).length : 0;
          })()} registered students
        </div>
      </div>

      {/* Contact Admin Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full relative">
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              onClick={() => setShowContactModal(false)}
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <h2 className="text-white text-xl font-bold mb-2">Contact Admin</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Need help accessing your account? Reach out to the admin for assistance.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-xs">Email</p>
                  <a 
                    href="mailto:Adminmbcet@mbcet.ac.in" 
                    className="text-white text-sm font-medium hover:text-yellow-500 transition-colors"
                  >
                    Adminmbcet@mbcet.ac.in
                  </a>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-xs">Phone</p>
                  <a 
                    href="tel:+911234567890" 
                    className="text-white text-sm font-medium hover:text-yellow-500 transition-colors"
                  >
                    +91 1234 567 890
                  </a>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-xs">WhatsApp Support</p>
                  <a 
                    href="https://wa.me/911234567890" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm font-medium hover:text-yellow-500 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all active:scale-95 mt-6"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}