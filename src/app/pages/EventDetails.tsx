import { ArrowLeft, Calendar, Clock, MapPin, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { CoordinatorCard } from "../components/CoordinatorCard";
import { useState, useEffect } from "react";
import { AdminService } from "../services/adminService";
import { Event } from "../data/events";

export function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<"earlyBird" | "regular">("regular");
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1080";

  // Check if event image is invalid
  const isInvalidImage = event && (!event.image || event.image.includes('figma:asset') || event.image.includes('blob:') || event.image === 'undefined');
  const displayImage = event ? (imageError || isInvalidImage ? fallbackImage : (event.image || fallbackImage)) : fallbackImage;

  useEffect(() => {
    const loadEvent = async () => {
      const allEvents = await AdminService.getAllEvents();
      const foundEvent = allEvents.find((e) => e.id === eventId);
      setEvent(foundEvent || null);
      setLoading(false);
    };
    loadEvent();

    // Reload when storage changes (from admin portal updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eventsData') {
        loadEvent();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll for changes every 2 seconds when tab is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadEvent();
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [eventId]);

  // Check if early bird is still available (compare dates)
  const isEarlyBirdAvailable = () => {
    if (!event) return false;
    // Simple check if earlyBird price exists and is > 0, and earlyBirdDeadline exists
    if (!event.earlyBirdDeadline || !event.price?.earlyBird) return false;
    try {
      const today = new Date();
      const deadline = new Date(event.earlyBirdDeadline);
      if (isNaN(deadline.getTime())) return false; // Invalid date
      return today <= deadline;
    } catch(e) {
      return false;
    }
  };

  const earlyBirdAvailable = isEarlyBirdAvailable();

  // Set default to early bird if available
  useEffect(() => {
    if (earlyBirdAvailable && selectedTicket === "regular") {
      setSelectedTicket("earlyBird");
    }
  }, [earlyBirdAvailable, selectedTicket]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
           <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="text-white text-center relative z-10">
          <h2 className="text-2xl mb-4 font-bold">Event not found</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Navigate to cart with event data
    navigate('/cart', { state: { event, ticketType: selectedTicket } });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header Image */}
        <div className="relative h-80">
          <img
            src={displayImage}
            alt={event.title}
            onError={() => {
              if (!imageError) {
                console.warn(`Using fallback image for event: ${event.title}`);
                setImageError(true);
              }
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-24">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-white text-3xl font-bold tracking-wide mb-2">
              {event.title}
            </h1>
            <p className="text-white/60 text-sm tracking-wide">
              {event.subtitle}
            </p>
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-white">
              <Calendar className="w-5 h-5 text-white/60" />
              <span className="text-sm">{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Clock className="w-5 h-5 text-white/60" />
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-start gap-3 text-white">
              <MapPin className="w-5 h-5 text-white/60 mt-0.5" />
              <span className="text-sm">{event.venue}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold mb-3">About Event</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Program Coordinators */}
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold mb-4">Program Coordinators</h2>
            <p className="text-white/60 text-xs mb-4">Tap to connect with coordinators</p>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {event.coordinators.map((coordinator) => (
                <CoordinatorCard key={coordinator.id} coordinator={coordinator} />
              ))}
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="mb-6">
            <h2 className="text-white text-lg font-bold mb-4">Select Ticket</h2>
            {earlyBirdAvailable && (
              <div className="mb-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-3 border border-yellow-500/30">
                <p className="text-yellow-400 text-xs font-bold tracking-wide">
                  ⚡ Early Bird pricing available until {event.earlyBirdDeadline}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {earlyBirdAvailable && (
                <button
                  onClick={() => setSelectedTicket("earlyBird")}
                  className={`w-full p-4 rounded-2xl border transition-all ${
                    selectedTicket === "earlyBird"
                      ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <p className="text-white font-bold">Early Bird</p>
                      <p className="text-white/60 text-xs">Special offer</p>
                    </div>
                    <p className="text-yellow-500 text-xl font-bold">₹{typeof event.price === 'number' ? event.price : event.price.earlyBird}</p>
                  </div>
                </button>
              )}

              <button
                onClick={() => setSelectedTicket("regular")}
                className={`w-full p-4 rounded-2xl border transition-all ${
                  selectedTicket === "regular"
                    ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
                    : "border-white/10 hover:border-white/20 bg-white/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-white font-bold">Regular</p>
                    <p className="text-white/60 text-xs">General admission</p>
                  </div>
                  <p className="text-white text-xl font-bold">₹{typeof event.price === 'number' ? event.price : event.price.regular}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10">
          <div className="max-w-md mx-auto px-4 py-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-4 rounded-full flex items-center justify-center gap-3 font-bold text-lg hover:bg-red-700 transition-colors active:scale-95 shadow-lg shadow-red-600/20"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart - ₹{typeof event.price === 'number' ? event.price : event.price[selectedTicket]}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}