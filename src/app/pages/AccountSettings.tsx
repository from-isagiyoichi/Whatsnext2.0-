import { ArrowLeft, User, Phone, Mail, Trash2, Save, Globe, AlertTriangle, Camera, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { StudentService } from "../services/studentService";

export function AccountSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(
    localStorage.getItem("userProfilePicture")
  );
  const [formData, setFormData] = useState({
    name: localStorage.getItem("userName") || "Abhiram",
    email: localStorage.getItem("userEmail") || "abhiram.cs21@mbcet.ac.in",
    phone: localStorage.getItem("userPhone") || "+91 98765 43210",
    language: "English (UK)"
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfilePicture(base64String);
      toast.success("Profile picture updated! Click 'Save Changes' to apply.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    toast.success("Profile picture removed! Click 'Save Changes' to apply.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number (optional validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await StudentService.updateProfile(
        formData.email, // Current user's email
        {
          name: formData.name,
          phone: formData.phone,
          profilePicture: profilePicture || undefined,
        }
      );

      if (result.success) {
        toast.success("✅ Profile updated & synced to Admin Portal!");
      } else {
        toast.error(result.error || "Failed to update profile");
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
          <h1 className="text-white text-xl font-bold tracking-wide">Account Settings</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-8">
        
        {/* Profile Picture Section */}
        <section>
          <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Profile Picture
          </h2>
          
          <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-red-500 to-yellow-500 p-[2px]">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>
                {profilePicture && (
                  <button
                    onClick={handleRemoveProfilePicture}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500/20 transition-all active:scale-95 text-sm font-medium"
                >
                  <Camera className="w-4 h-4" />
                  {profilePicture ? "Change Photo" : "Upload Photo"}
                </button>
                <p className="text-white/40 text-[10px] mt-2 text-center">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Details Form */}
        <section>
          <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Personal Information
          </h2>
          
          <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-5">
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                <User className="w-3 h-3 text-yellow-500" /> Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3 text-yellow-500" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed text-sm"
              />
              <p className="text-white/20 text-[10px] ml-1">Email address is linked to your college ID and cannot be changed.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                <Phone className="w-3 h-3 text-yellow-500" /> Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-yellow-500/20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Preferences
          </h2>
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Language</p>
                  <p className="text-white/40 text-xs">{formData.language}</p>
                </div>
              </div>
              <span className="text-yellow-500 text-xs font-medium">Change</span>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-red-400/60 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Danger Zone
          </h2>
          <div className="bg-red-500/5 rounded-2xl border border-red-500/10 p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Delete Account</h3>
                <p className="text-white/40 text-xs leading-relaxed">
                  Permanently delete your account and all of your data. This action cannot be undone.
                </p>
              </div>
            </div>
            <button 
              onClick={() => toast.error("Please contact admin to delete student account")}
              className="w-full py-3 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}