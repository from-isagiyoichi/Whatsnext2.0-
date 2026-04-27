import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Send, Mail, Phone } from "lucide-react";
import { ChatService, Chat } from "../services/chatService";
import { toast } from "sonner";

export function ChatConversation() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const studentEmail = localStorage.getItem("userEmail") || "";
  const studentName = localStorage.getItem("userName") || "";

  useEffect(() => {
    loadChat();

    // Mark chat as read when opened
    if (chatId) {
      ChatService.markChatAsRead(chatId, studentEmail);
    }

    // Auto-refresh messages every 2 seconds
    const interval = setInterval(loadChat, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [chat?.messages]);

  const loadChat = () => {
    const chatData = localStorage.getItem("chatData");
    if (!chatData || !chatId) return;

    const allChats: Chat[] = JSON.parse(chatData);
    const foundChat = allChats.find(
      (c) => c.id === chatId && c.studentEmail === studentEmail
    );

    setChat(foundChat || null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !chat || sending) return;

    setSending(true);

    const success = ChatService.sendMessage(
      chat.id,
      studentEmail,
      studentName,
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      messageInput
    );

    if (success) {
      setMessageInput("");
      loadChat();
      setTimeout(scrollToBottom, 100);
    } else {
      toast.error("Failed to send message");
    }

    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupMessagesByDate = () => {
    if (!chat) return {};

    const grouped: { [date: string]: typeof chat.messages } = {};

    chat.messages.forEach((msg) => {
      const date = new Date(msg.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });

    return grouped;
  };

  if (!chat) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-center">
          <p className="mb-4">Chat not found</p>
          <button
            onClick={() => navigate("/messages")}
            className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all active:scale-95"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md z-10 border-b border-white/10">
        <div className="flex items-center gap-4 p-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/messages")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <img
              src={chat.coordinatorImage}
              alt={chat.coordinatorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-sm truncate">
                {chat.coordinatorName}
              </h1>
              <p className="text-white/60 text-xs truncate">{chat.coordinatorRole}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`mailto:${chat.coordinatorEmail}`}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
            >
              <Mail className="w-4 h-4 text-white" />
            </a>
            <a
              href={`tel:${chat.coordinatorPhone}`}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
            >
              <Phone className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-md mx-auto w-full relative z-10">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-white/60 text-lg font-medium mb-2">
              Start the conversation
            </h3>
            <p className="text-white/40 text-sm">
              Send a message to {chat.coordinatorName}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/40 text-xs font-medium">{date}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === studentEmail;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isOwnMessage ? "items-end" : "items-start"
                          } flex flex-col`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isOwnMessage
                                ? "bg-red-600 text-white rounded-br-md"
                                : "bg-white/10 text-white rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">
                              {message.message}
                            </p>
                          </div>
                          <span className="text-white/40 text-xs mt-1">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 relative z-10">
        <div className="max-w-md mx-auto flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${chat.coordinatorName}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm resize-none"
              rows={1}
              style={{
                maxHeight: "120px",
                minHeight: "48px",
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 flex-shrink-0"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
