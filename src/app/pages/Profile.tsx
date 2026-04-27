import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  LogOut, 
  Settings, 
  HelpCircle,
  ChevronRight,
  CreditCard,
  Bell,
  Shield,
  Edit2
} from "lucide-react";
import { useNavigate } from "react-router";

interface ProfileMenuItemProps {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  action?: () => void;
  isLast?: boolean;
}

function ProfileMenuItem({ icon: Icon, label, subtitle, action, isLast }: ProfileMenuItemProps) {
  return (
    <div>
      <button
        onClick={action}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors active:scale-98"
      >
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-white/60" />
        </div>
        <div className="flex-1 text-left overflow-hidden">
          <h3 className="text-white text-base font-medium truncate">{label}</h3>
          {subtitle && (
            <p className="text-white/40 text-xs mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <ChevronRight className="w-5 h-5 text-white/20" />
        </div>
      </button>
      {!isLast && <div className="h-px bg-white/5 mx-4" />}
    </div>
  );
}

export function Profile() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Abhiram";
  const userEmail = localStorage.getItem("userEmail") || "abhiram.cs21@mbcet.ac.in";
  const userPhone = localStorage.getItem("userPhone") || "+91 98765 43210";
  const profilePicture = localStorage.getItem("userProfilePicture");

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="bg-gray-900 pb-6 rounded-b-[2rem] shadow-xl border-b border-white/5 relative overflow-hidden z-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-black to-yellow-500/10 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors active:scale-95 backdrop-blur-md border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold tracking-wide">Account</h1>
          </div>

          <div className="px-6 pt-2 pb-4 flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full p-[2px] shadow-lg shadow-red-500/20">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt={userName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>
              <button 
                onClick={() => navigate("/account-settings")}
                className="absolute bottom-0 right-0 w-7 h-7 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-white text-2xl font-bold">{userName}</h2>
              <p className="text-white/60 text-sm mb-1">{userEmail}</p>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-bold tracking-wide uppercase border border-yellow-500/20">
                  Verified
                </span>
                <span className="text-white/40 text-xs font-medium">
                  {userPhone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-8">
        {/* Booking History */}
        <section>
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            My Activity
          </h3>
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-white/5">
            <ProfileMenuItem 
              icon={Calendar} 
              label="Your Orders" 
              subtitle="View all your bookings & tickets"
              action={() => navigate("/tickets")}
            />
            <ProfileMenuItem 
              icon={Settings} 
              label="Account Settings" 
              subtitle="Manage your profile & preferences"
              action={() => navigate("/account-settings")}
              isLast
            />
          </div>
        </section>

        {/* Payments & Offers */}
        <section>
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Payments & Security
          </h3>
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-white/5">
            <ProfileMenuItem 
              icon={CreditCard} 
              label="Payment Methods" 
              subtitle="Manage cards, UPI & wallets"
              action={() => navigate("/payment-methods")}
            />
             <ProfileMenuItem 
              icon={Shield} 
              label="Security" 
              subtitle="Password & security settings"
              action={() => navigate("/security")}
              isLast
            />
          </div>
        </section>

        {/* Support & More */}
        <section>
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 pl-2">
            Support & Info
          </h3>
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-white/5">
            <ProfileMenuItem 
              icon={HelpCircle} 
              label="Help & Support" 
              subtitle="FAQs & customer care"
              action={() => navigate("/help-support")}
              isLast
            />
          </div>
        </section>
        
        {/* Logout */}
        <div className="pt-4 pb-8">
          <button 
            onClick={() => {
              localStorage.removeItem("userName");
              localStorage.removeItem("userEmail");
              navigate("/login");
            }}
            className="w-full bg-gray-900 text-red-400 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold border border-white/5 hover:bg-red-500/10 transition-colors active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
          <p className="text-center text-white/20 text-xs mt-4">
            whatsnext? v1.0.0 • Made with ❤️ for MBCET
          </p>
        </div>
      </div>
    </div>
  );
}