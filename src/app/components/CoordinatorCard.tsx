import { Mail, Phone, Linkedin, Instagram, Twitter, MessageCircle } from "lucide-react";
import { Coordinator } from "../data/events";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChatService } from "../services/chatService";

interface CoordinatorCardProps {
  coordinator: Coordinator;
}

export function CoordinatorCard({ coordinator }: CoordinatorCardProps) {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";

  // Check if image is invalid
  const isInvalidImage = !coordinator.image || coordinator.image.includes('figma:asset') || coordinator.image.includes('blob:') || coordinator.image === 'undefined';
  const coordinatorImage = imageError || isInvalidImage ? fallbackImage : coordinator.image;

  const handleStartChat = () => {
    const studentEmail = localStorage.getItem("userEmail") || "";
    const studentName = localStorage.getItem("userName") || "";

    const chat = ChatService.getChatWithCoordinator(
      studentEmail,
      studentName,
      coordinator.id,
      coordinator.name,
      coordinatorImage,
      coordinator.role,
      coordinator.email,
      coordinator.phone
    );

    setShowContact(false);
    navigate(`/messages/${chat.id}`);
  };

  return (
    <div className="flex-shrink-0 w-32">
      <div
        onClick={() => setShowContact(!showContact)}
        className="cursor-pointer"
      >
        <div className="w-32 h-32 rounded-2xl overflow-hidden mb-3 ring-2 ring-white/20 hover:ring-white/40 transition-all active:scale-95">
          <img
            src={coordinatorImage}
            alt={coordinator.name}
            onError={() => {
              if (!imageError) {
                console.warn(`Using fallback image for coordinator: ${coordinator.name}`);
                setImageError(true);
              }
            }}
            className="w-full h-full object-cover"
          />
        </div>
        
        <h3 className="text-white text-sm font-semibold truncate mb-1">{coordinator.name}</h3>
        <p className="text-white/60 text-xs truncate">{coordinator.role}</p>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowContact(false)}
        >
          <div 
            className="bg-gray-900 rounded-3xl p-6 max-w-sm w-full border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 ring-2 ring-white/20">
                <img
                  src={coordinatorImage}
                  alt={coordinator.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white text-xl font-bold mb-1">
                {coordinator.name}
              </h3>
              <p className="text-white/60 text-sm">{coordinator.role}</p>
            </div>

            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${coordinator.email}`}
                className="flex items-center gap-3 bg-black/50 rounded-xl p-3 hover:bg-black/70 transition-colors active:scale-95"
              >
                <Mail className="w-5 h-5 text-white" />
                <span className="text-white text-sm">{coordinator.email}</span>
              </a>

              <a
                href={`tel:${coordinator.phone}`}
                className="flex items-center gap-3 bg-black/50 rounded-xl p-3 hover:bg-black/70 transition-colors active:scale-95"
              >
                <Phone className="w-5 h-5 text-white" />
                <span className="text-white text-sm">{coordinator.phone}</span>
              </a>
            </div>

            {/* Social Links */}
            {coordinator.social && (
              <div className="flex justify-center gap-3 mb-4">
                {coordinator.social.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${coordinator.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors active:scale-95"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                )}
                {coordinator.social.instagram && (
                  <a
                    href={`https://instagram.com/${coordinator.social.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors active:scale-95"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                {coordinator.social.twitter && (
                  <a
                    href={`https://twitter.com/${coordinator.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors active:scale-95"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleStartChat}
                className="w-full bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition-colors active:scale-95 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Message {coordinator.name.split(" ")[0]}
              </button>

              <button
                onClick={() => setShowContact(false)}
                className="w-full bg-yellow-500 text-black py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
