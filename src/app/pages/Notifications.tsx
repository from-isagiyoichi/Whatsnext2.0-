import { ArrowLeft, Bell, Calendar, CheckCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Notification, getNotifications, markAllAsRead } from "../data/notifications";

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications
    const data = getNotifications();
    setNotifications(data);
    
    // Mark all as read when opening the page
    markAllAsRead();
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <Calendar className="w-5 h-5 text-red-500" />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than an hour
    if (diff < 1000 * 60 * 60) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return `${hours}h ago`;
    }
    
    // Default date format
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold tracking-wide">Notifications</h1>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-white/60">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Bell className="w-10 h-10 text-white/40" />
              </div>
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`bg-white/5 rounded-2xl p-4 border transition-colors ${
                  !notification.read ? 'border-red-600/50 bg-red-900/10' : 'border-white/10'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'success' ? 'bg-green-500/20' : 
                    notification.type === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-white/80'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-white/40 whitespace-nowrap ml-2">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
