import { Search, User, ShoppingCart, Ticket, Bell, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import { EventCard } from "../components/EventCard";
import { AdminService } from "../services/adminService";
import { ChatService } from "../services/chatService";
import { Event } from "../data/events";
import logo from "figma:asset/d0e98858b0fb6c3077bf0c27b3941e385a98e57f.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function Home() {
  const [activeTab, setActiveTab] = useState<"live" | "coming-soon">("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "ABHIRAM";
  const userEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    const loadEvents = async () => {
      const allEvents = await AdminService.getAllEvents();
      console.log("🏠 Home page loaded events:", allEvents.map(e => ({
        title: e.title,
        category: e.category,
        subtitle: e.subtitle || "NO SUBTITLE"
      })));
      setEvents(allEvents);
    };

    const loadUnreadCount = () => {
      const count = ChatService.getTotalUnreadCount(userEmail);
      setUnreadCount(count);
    };

    loadEvents();
    loadUnreadCount();

    // Reload events when window regains focus (e.g., returning from admin portal)
    const handleFocus = () => {
      loadEvents();
      loadUnreadCount();
    };
    window.addEventListener('focus', handleFocus);

    // Reload events when storage changes (from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eventsData') {
        loadEvents();
      }
      if (e.key === 'chatData') {
        loadUnreadCount();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll for changes every 2 seconds when tab is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadEvents();
        loadUnreadCount();
      }
    }, 2000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userEmail]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.subtitle || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery) {
      return matchesSearch;
    }

    const matchesTab = event.category === activeTab;

    // Debug logging
    if (!matchesTab) {
      console.log(`❌ Event "${event.title}" category "${event.category}" doesn't match tab "${activeTab}"`);
    }

    return matchesTab;
  });

  const sliderSettings = {
    dots: true,
    infinite: filteredEvents.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
    autoplay: filteredEvents.length > 1,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto">
        {/* Header */}
        <header className="px-3 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-red-600 flex items-center justify-center shrink-0">
                <img src={logo} alt="WN?" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-yellow-500 text-[9px] font-bold tracking-wider uppercase leading-tight">whatsnext?</p>
              <h1 className="text-white text-base font-bold tracking-wide truncate">
                {userName.toUpperCase()}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => navigate('/messages')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md active:scale-95 relative"
            >
              <MessageCircle className="w-5 h-5 text-black" />
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
                  <span className="text-white text-[10px] font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </div>
              )}
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md active:scale-95"
            >
              <Bell className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md active:scale-95"
            >
              <User className="w-5 h-5 text-black" />
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-3 mb-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search event"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-black text-white text-sm rounded-full pl-5 pr-13 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
              <Search className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="flex-1 px-3 mb-24">
          {filteredEvents.length > 0 ? (
            <Slider {...sliderSettings} className="event-carousel-mobile">
              {filteredEvents.map((event) => (
                <div key={event.id} className="px-1.5">
                  <div onClick={() => navigate(`/event/${event.id}`)}>
                    <EventCard
                      image={event.image}
                      title={event.title}
                      subtitle={event.subtitle}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="flex items-center justify-center h-[450px] text-white/60">
              <p className="text-sm">No events found</p>
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <div className="px-3 mb-5 flex justify-center -mt-14">
          <button
            onClick={() => filteredEvents.length > 0 && navigate(`/event/${filteredEvents[0].id}`)}
            className="bg-red-600 text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
            disabled={filteredEvents.length === 0}
          >
            <Ticket className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">VIEW DETAILS</span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <nav className="px-3 pb-5">
          <div className="bg-black rounded-full flex items-center justify-around py-2.5 px-3 shadow-xl border border-white/10">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === "live"
                  ? "bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                  : "text-white hover:bg-white/10 active:scale-95"
              }`}
            >
              <span className="text-xs font-bold tracking-wide">LIVE</span>
            </button>
            <button
              onClick={() => setActiveTab("coming-soon")}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap ${
                activeTab === "coming-soon"
                  ? "bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                  : "text-white hover:bg-white/10 active:scale-95"
              }`}
            >
              <span className="text-[11px] font-bold tracking-wide">COMING SOON</span>
            </button>
            <button
              onClick={() => navigate('/tickets')}
              className="w-9 h-9 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center active:scale-95"
            >
              <Ticket className="w-4 h-4 text-white" />
            </button>
          </div>
        </nav>
      </div>

      {/* Custom Carousel Styles */}
      <style>{`
        .event-carousel-mobile .slick-dots {
          bottom: -40px;
          z-index: 20;
        }

        .event-carousel-mobile .slick-dots li button:before {
          color: white;
          font-size: 8px;
          opacity: 0.4;
        }

        .event-carousel-mobile .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }

        .event-carousel-mobile .slick-slide > div {
          padding: 0 2px;
        }
      `}</style>
    </div>
  );
}