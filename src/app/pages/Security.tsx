import { useState } from "react";
import { ArrowLeft, Lock, Shield, Key, Check, Smartphone, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthService } from "../services/authService";

export function Security() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await AuthService.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        toast.success("Password updated successfully! You'll be logged out for security.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Log out user after password change for security
        setTimeout(() => {
          AuthService.logout();
          navigate("/login");
        }, 2000);
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600/10 rounded-full blur-[80px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
        <div className="flex items-center gap-4 p-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold tracking-wide">Security</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-8">
        
        {/* Two-Factor Authentication */}
        <section>
          <div className="flex items-center gap-3 mb-4 pl-2">
            <Shield className="w-5 h-5 text-yellow-500" />
            <h2 className="text-white font-bold text-lg">Two-Step Verification</h2>
          </div>
          
          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 overflow-hidden relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-white font-medium">Protect your account</p>
                <p className="text-white/60 text-xs leading-relaxed max-w-[240px]">
                  Require a verification code along with your password when you sign in.
                </p>
              </div>
              <button
                onClick={() => {
                  setTwoFactor(!twoFactor);
                  toast.success(twoFactor ? "2FA Disabled" : "2FA Enabled");
                }}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  twoFactor ? "bg-yellow-500" : "bg-white/20"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                    twoFactor ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            
            {twoFactor && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-yellow-500/90 text-xs font-medium">
                  Verification codes will be sent to +91 ***** **210
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Change Password */}
        <section>
          <div className="flex items-center gap-3 mb-4 pl-2">
            <Key className="w-5 h-5 text-red-500" />
            <h2 className="text-white font-bold text-lg">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-white/60 text-xs font-medium ml-1">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/60 text-xs font-medium ml-1">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/60 text-xs font-medium ml-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!currentPassword || !newPassword || !confirmPassword || isSubmitting}
                className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-yellow-200/80 text-xs leading-relaxed">
              For security reasons, you will be logged out of all other devices after changing your password.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
