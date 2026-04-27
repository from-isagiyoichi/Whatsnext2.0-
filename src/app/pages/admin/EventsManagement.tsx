import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Edit2, Trash2, Search, Calendar, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { AdminService } from "../../services/adminService";
import { events as defaultEvents, Event } from "../../data/events";

export function EventsManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    
    // Initialize with default events if localStorage is empty
    const storedEvents = localStorage.getItem("eventsData");
    if (!storedEvents) {
      localStorage.setItem("eventsData", JSON.stringify(defaultEvents));
      setEvents(defaultEvents);
    } else {
      const loadedEvents = await AdminService.getAllEvents();
      setEvents(loadedEvents.length > 0 ? loadedEvents : defaultEvents);
    }
    
    setLoading(false);
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) return;

    const result = await AdminService.deleteEvent(eventId);
    if (result.success) {
      toast.success("Event deleted successfully");
      loadEvents();
    } else {
      toast.error(result.error || "Failed to delete event");
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
        <div className="flex items-center gap-4 p-4 max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold tracking-wide">Events Management</h1>
            <p className="text-white/60 text-xs">
              {loading ? "Loading..." : `${events.length} event${events.length !== 1 ? 's' : ''} listed`}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/events/new")}
            className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Info Banner */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-green-400 text-xs font-medium">
            Live Sync Active - Changes reflect instantly in Student Portal
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, category, or venue..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
          />
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-sm">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex gap-4">
                  {/* Event Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">{event.title}</h3>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span className="truncate">{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <DollarSign className="w-3 h-3" />
                        <span>₹{typeof event.price === 'object' ? event.price.regular : event.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        event.category === 'Technical' ? 'bg-red-500/20 text-red-500' :
                        event.category === 'Cultural' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {event.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        event.status === 'upcoming' ? 'bg-green-500/20 text-green-500' :
                        event.status === 'ongoing' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                    className="flex-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500/20 transition-all active:scale-95 text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="flex-1 bg-red-500/10 border border-red-500/30 text-red-500 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
