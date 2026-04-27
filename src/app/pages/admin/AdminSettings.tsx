import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Save, 
  Mail, 
  Phone, 
  MessageCircle, 
  Lock,
  Eye,
  EyeOff,
  Settings as SettingsIcon
} from "lucide-react";
import { toast } from "sonner";

interface AdminContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
}

interface AdminPasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function AdminSettings() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load existing contact info or use defaults
  const [contactInfo, setContactInfo] = useState<AdminContactInfo>(() => {
    const stored = localStorage.getItem("adminContactInfo");
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      email: "Adminmbcet@mbcet.ac.in",
      phone: "+91 1234 567 890",
      whatsapp: "+911234567890"
    };
  });

  const [passwordData, setPasswordData] = useState<AdminPasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(contactInfo.phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Validate WhatsApp
    if (!phoneRegex.test(contactInfo.whatsapp.replace(/\s/g, ""))) {
      toast.error("Please enter a valid WhatsApp number");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      localStorage.setItem("adminContactInfo", JSON.stringify(contactInfo));
      toast.success("✅ Contact information updated successfully!");
      console.log("✅ Admin contact info updated:", contactInfo);
      setIsSubmitting(false);
    }, 500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSubmitting(true);

    // Get current admin password from localStorage (persistent)
    const currentAdminPassword = localStorage.getItem("adminPassword") || "therealadmin@mbcet";

    // Verify current password
    if (passwordData.currentPassword !== currentAdminPassword) {
      toast.error("Current password is incorrect");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      // Update admin password permanently
      localStorage.setItem("adminPassword", passwordData.newPassword);
      
      toast.success("🔐 Password changed successfully!");
      console.log("✅ Admin password updated permanently");
      
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-yellow-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-red-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
        <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold tracking-wide">Admin Settings</h1>
            <p className="text-white/60 text-xs">Manage contact information and security</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Contact Information Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold">Contact Information</h2>
              <p className="text-white/60 text-xs">Students will see these details when contacting admin</p>
            </div>
          </div>

          <form onSubmit={handleSaveContactInfo} className="space-y-4">
            <div>
              <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-yellow-500" />
                Admin Email
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                placeholder="admin@mbcet.ac.in"
                required
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-yellow-500" />
                Phone Number
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                placeholder="+91 1234 567 890"
                required
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-yellow-500" />
                WhatsApp Number (without spaces)
              </label>
              <input
                type="tel"
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                placeholder="+911234567890"
                required
              />
              <p className="text-white/40 text-[10px] mt-1.5 ml-1">
                Used for WhatsApp link (wa.me/{contactInfo.whatsapp.replace(/\+/g, "")})
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Contact Info"}
            </button>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold">Change Password</h2>
              <p className="text-white/60 text-xs">Update your admin login password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm pr-12"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm pr-12"
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm pr-12"
                  placeholder="Re-enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {passwordData.newPassword && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-3">
                <p className="text-white/60 text-xs mb-2">Password Strength:</p>
                <div className="flex gap-1">
                  <div className={`h-1.5 flex-1 rounded-full ${passwordData.newPassword.length >= 6 ? 'bg-yellow-500' : 'bg-white/10'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${passwordData.newPassword.length >= 8 ? 'bg-yellow-500' : 'bg-white/10'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${passwordData.newPassword.length >= 10 && /[A-Z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-white/10'}`} />
                </div>
                <p className="text-white/40 text-[10px] mt-1.5">
                  {passwordData.newPassword.length < 6 && "Weak - Use at least 6 characters"}
                  {passwordData.newPassword.length >= 6 && passwordData.newPassword.length < 8 && "Fair - Consider using 8+ characters"}
                  {passwordData.newPassword.length >= 8 && passwordData.newPassword.length < 10 && "Good - Add uppercase for better security"}
                  {passwordData.newPassword.length >= 10 && /[A-Z]/.test(passwordData.newPassword) && "Strong - Excellent password!"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
            >
              <Lock className="w-4 h-4" />
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Current Admin Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-2">Current Admin Account</p>
          <p className="text-white text-sm font-medium">
            {localStorage.getItem("adminEmail") || "Adminmbcet@mbcet.ac.in"}
          </p>
        </div>
      </div>
    </div>
  );
}