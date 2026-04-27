import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MessageCircle, Trash2, Search } from "lucide-react";
import { ChatService, Chat } from "../services/chatService";
import { toast } from "sonner";

export function Messages() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const studentEmail = localStorage.getItem("userEmail") || "";
  const studentName = localStorage.getItem("userName") || "";

  useEffect(() => {
    loadChats();

    // Auto-refresh chats every 2 seconds
    const interval = setInterval(loadChats, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadChats = () => {
    const studentChats = ChatService.getStudentChats(studentEmail);
    setChats(studentChats);
  };

  const handleDeleteChat = (chatId: string, coordinatorName: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Delete conversation with ${coordinatorName}?`)) return;

    const success = ChatService.deleteChat(chatId, studentEmail);
    if (success) {
      toast.success("Chat deleted");
      loadChats();
    } else {
      toast.error("Failed to delete chat");
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredChats = chats.filter((chat) =>
    chat.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.coordinatorRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="flex items-center gap-4 p-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold tracking-wide">Messages</h1>
            <p className="text-white/60 text-xs">
              {chats.length} conversation{chats.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4 relative z-10">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
          />
        </div>

        {/* Chat List */}
        {filteredChats.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white/60 text-lg font-medium mb-2">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </h3>
            <p className="text-white/40 text-sm mb-6">
              {searchQuery
                ? "Try a different search term"
                : "Start chatting with event coordinators"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/")}
                className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                Browse Events
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/messages/${chat.id}`)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all active:scale-[0.98] text-left relative overflow-hidden group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Coordinator Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.coordinatorImage}
                      alt={chat.coordinatorName}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
                    />
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
                        <span className="text-white text-xs font-bold">
                          {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-bold text-sm truncate">
                        {chat.coordinatorName}
                      </h3>
                      <span className="text-white/40 text-xs flex-shrink-0 ml-2">
                        {formatTimestamp(chat.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs mb-1 truncate">
                      {chat.coordinatorRole}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        chat.unreadCount > 0
                          ? "text-white font-medium"
                          : "text-white/40"
                      }`}
                    >
                      {chat.lastMessage || "No messages yet"}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, chat.coordinatorName, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg active:scale-95"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
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
