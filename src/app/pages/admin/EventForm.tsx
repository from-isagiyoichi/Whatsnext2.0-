import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Calendar, MapPin, DollarSign, Users, Clock, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AdminService } from "../../services/adminService";
import { Event } from "../../data/events";
import { compressBase64Image, logStorageStats } from "../../utils/storage";

export function EventForm() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEditMode = !!eventId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "live" as "live" | "coming-soon",
    eventType: "Technical",
    date: "",
    time: "",
    venue: "",
    price: { earlyBird: 0, regular: 0 },
    earlyBirdDeadline: "",
    capacity: 100,
    status: "upcoming" as "upcoming" | "ongoing" | "completed",
    image: "",
    tags: [] as string[],
    highlights: [] as string[],
    coordinators: [] as any[],
  });

  const [tagInput, setTagInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");

  useEffect(() => {
    if (isEditMode) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    const events = await AdminService.getAllEvents();
    const event = events.find((e: Event) => e.id === eventId);
    
    if (event) {
      setFormData({
        title: event.title || "",
        subtitle: (event as any).subtitle || "",
        description: event.description || "",
        category: event.category || "live",
        eventType: (event as any).eventType || "Technical",
        date: event.date || "",
        time: event.time || "",
        venue: event.venue || "",
        price: typeof event.price === 'number' ? { earlyBird: event.price, regular: event.price } : event.price || { earlyBird: 0, regular: 0 },
        earlyBirdDeadline: (event as any).earlyBirdDeadline || "",
        capacity: event.capacity || 100,
        status: event.status || "upcoming",
        image: event.image || "",
        tags: event.tags || [],
        highlights: event.highlights || [],
        coordinators: (event.coordinators || []).map(coord => ({
          id: coord.id || `c_${Date.now()}_${Math.random()}`,
          name: coord.name || "",
          role: coord.role || "",
          email: coord.email || "",
          phone: coord.phone || "",
          image: coord.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
        })),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        coordinators: formData.coordinators,
        registeredCount: 0,
      };

      console.log('💾 Saving event with category:', eventData.category, 'Title:', eventData.title);

      const result = isEditMode
        ? await AdminService.updateEvent(eventId!, eventData)
        : await AdminService.createEvent(eventData);

      if (result.success) {
        const categoryLabel = eventData.category === 'live' ? 'LIVE' : 'COMING SOON';
        toast.success(`Event ${isEditMode ? 'updated' : 'created'} in ${categoryLabel} section`);

        // Log storage stats after saving
        logStorageStats();

        navigate("/admin/events");
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

  const addCoordinator = () => {
    const newCoordinator = {
      id: `c_${Date.now()}`,
      name: "",
      role: "",
      email: "",
      phone: "",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    };
    setFormData({ ...formData, coordinators: [...formData.coordinators, newCoordinator] });
  };

  const updateCoordinator = (index: number, field: string, value: string) => {
    const newCoordinators = [...formData.coordinators];
    newCoordinators[index] = { ...newCoordinators[index], [field]: value };
    setFormData({ ...formData, coordinators: newCoordinators });
  };

  const handleCoordinatorImageUpload = async (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressed = await compressBase64Image(reader.result as string, 200, 0.7);
        updateCoordinator(index, "image", compressed);
        toast.success("Coordinator photo uploaded & compressed");
      } catch (error) {
        console.error("Image compression error:", error);
        updateCoordinator(index, "image", reader.result as string);
        toast.success("Coordinator photo uploaded");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeCoordinator = (index: number) => {
    setFormData({ ...formData, coordinators: formData.coordinators.filter((_, i) => i !== index) });
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
        <div className="flex items-center gap-4 p-4 max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/admin/events")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold tracking-wide">
            {isEditMode ? "Edit Event" : "Add New Event"}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Information */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-bold text-lg mb-4">Basic Information</h2>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1">Event Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1">Subtitle *</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                placeholder="Enter event subtitle"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm min-h-[100px]"
                placeholder="Describe the event..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  required
                >
                  <option value="live">Live</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1">Event Type *</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  required
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Category Info Banner */}
            <div className={`p-3 rounded-xl border ${
              formData.category === 'live'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-blue-500/10 border-blue-500/30'
            }`}>
              <p className={`text-xs font-medium ${
                formData.category === 'live' ? 'text-green-400' : 'text-blue-400'
              }`}>
                📱 Students will see this event in the <span className="font-bold">
                  {formData.category === 'live' ? 'LIVE' : 'COMING SOON'}
                </span> tab
              </p>
            </div>
          </section>

          {/* Event Details */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-bold text-lg mb-4">Event Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-red-500" />
                  Date *
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="Mar 15, 2026"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-red-500" />
                  Time *
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="10:00 AM"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-red-500" />
                Venue *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                placeholder="Enter venue location"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-red-500" />
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price.regular || 0}
                  onChange={(e) => setFormData({ ...formData, price: { ...formData.price, regular: Number(e.target.value) } })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-red-500" />
                  Early Bird Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price.earlyBird || 0}
                  onChange={(e) => setFormData({ ...formData, price: { ...formData.price, earlyBird: Number(e.target.value) } })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-red-500" />
                  Early Bird Deadline *
                </label>
                <input
                  type="text"
                  value={formData.earlyBirdDeadline}
                  onChange={(e) => setFormData({ ...formData, earlyBirdDeadline: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="March 12, 2026"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                  <Users className="w-3 h-3 text-red-500" />
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium ml-1 flex items-center gap-2">
                <ImageIcon className="w-3 h-3 text-red-500" />
                Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="flex-1 w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                  placeholder="Upload a file or enter URL..."
                />
                <input
                  type="file"
                  id="cover-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        try {
                          const compressed = await compressBase64Image(reader.result as string, 800, 0.8);
                          setFormData({ ...formData, image: compressed });
                          toast.success("Image uploaded & compressed");
                        } catch (error) {
                          console.error("Image compression error:", error);
                          setFormData({ ...formData, image: reader.result as string });
                          toast.success("Image uploaded");
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label
                  htmlFor="cover-upload"
                  className="bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-all active:scale-95 text-xs font-medium whitespace-nowrap cursor-pointer flex items-center justify-center"
                >
                  Upload File
                </label>
              </div>
            </div>
          </section>

          {/* Tags */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-bold text-lg mb-4">Tags</h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all active:scale-95 text-sm font-medium"
              >
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-red-500/20 text-red-500 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Highlights */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-bold text-lg mb-4">Highlights</h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                placeholder="Add highlight and press Enter"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all active:scale-95 text-sm font-medium"
              >
                Add
              </button>
            </div>

            {formData.highlights.length > 0 && (
              <div className="space-y-2">
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm flex items-center justify-between"
                  >
                    <span>{highlight}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-500 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Coordinators */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Coordinators</h2>
              <button
                type="button"
                onClick={addCoordinator}
                className="bg-yellow-500/20 text-yellow-500 px-3 py-1.5 rounded-lg hover:bg-yellow-500/30 transition-all text-xs font-medium"
              >
                + Add Coordinator
              </button>
            </div>

            {formData.coordinators.map((coord, index) => (
              <div key={coord.id} className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeCoordinator(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-medium"
                >
                  Remove
                </button>
                
                {/* Coordinator Photo Upload */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <img 
                      src={coord.image} 
                      alt={coord.name || "Coordinator"} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                    />
                    <input 
                      type="file"
                      id={`coord-photo-${index}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCoordinatorImageUpload(index, file);
                        }
                      }}
                    />
                    <label
                      htmlFor={`coord-photo-${index}`}
                      className="absolute bottom-0 right-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors shadow-lg"
                    >
                      <ImageIcon className="w-3 h-3 text-black" />
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-medium">Coordinator Photo</p>
                    <p className="text-white/40 text-[10px]">Click the icon to upload</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pr-16">
                  <div className="space-y-1">
                    <label className="text-white/60 text-[10px] font-medium ml-1">Name</label>
                    <input
                      type="text"
                      value={coord.name}
                      onChange={(e) => updateCoordinator(index, "name", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500/50 transition-all text-sm"
                      placeholder="Coordinator Name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-[10px] font-medium ml-1">Role</label>
                    <input
                      type="text"
                      value={coord.role}
                      onChange={(e) => updateCoordinator(index, "role", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500/50 transition-all text-sm"
                      placeholder="e.g. Event Head"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-[10px] font-medium ml-1">Email</label>
                    <input
                      type="email"
                      value={coord.email}
                      onChange={(e) => updateCoordinator(index, "email", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500/50 transition-all text-sm"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-[10px] font-medium ml-1">Phone</label>
                    <input
                      type="tel"
                      value={coord.phone}
                      onChange={(e) => updateCoordinator(index, "phone", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500/50 transition-all text-sm"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {formData.coordinators.length === 0 && (
              <div className="text-center py-6 text-white/40 text-sm">
                No coordinators added. Click the button above to add one.
              </div>
            )}
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-600/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditMode ? "Update Event" : "Create Event"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}