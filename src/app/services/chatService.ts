/**
 * ChatService - Manages messaging between students and coordinators
 * Storage: localStorage key "chatData"
 */

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  coordinatorId: string;
  coordinatorName: string;
  coordinatorImage: string;
  coordinatorRole: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  studentEmail: string;
  studentName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export class ChatService {
  private static STORAGE_KEY = "chatData";

  /**
   * Get all chats for the current student
   */
  static getStudentChats(studentEmail: string): Chat[] {
    const chatData = localStorage.getItem(this.STORAGE_KEY);
    if (!chatData) return [];

    const allChats: Chat[] = JSON.parse(chatData);
    return allChats
      .filter((chat) => chat.studentEmail === studentEmail)
      .sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA; // Most recent first
      });
  }

  /**
   * Get or create a chat with a coordinator
   */
  static getChatWithCoordinator(
    studentEmail: string,
    studentName: string,
    coordinatorId: string,
    coordinatorName: string,
    coordinatorImage: string,
    coordinatorRole: string,
    coordinatorEmail: string,
    coordinatorPhone: string
  ): Chat {
    const chatData = localStorage.getItem(this.STORAGE_KEY);
    const allChats: Chat[] = chatData ? JSON.parse(chatData) : [];

    // Find existing chat
    const existingChat = allChats.find(
      (chat) =>
        chat.studentEmail === studentEmail &&
        chat.coordinatorId === coordinatorId
    );

    if (existingChat) {
      return existingChat;
    }

    // Create new chat
    const newChat: Chat = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      coordinatorId,
      coordinatorName,
      coordinatorImage,
      coordinatorRole,
      coordinatorEmail,
      coordinatorPhone,
      studentEmail,
      studentName,
      unreadCount: 0,
      messages: [],
    };

    allChats.push(newChat);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allChats));

    return newChat;
  }

  /**
   * Send a message in a chat
   */
  static sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    senderImage: string,
    message: string
  ): boolean {
    const chatData = localStorage.getItem(this.STORAGE_KEY);
    if (!chatData) return false;

    const allChats: Chat[] = JSON.parse(chatData);
    const chatIndex = allChats.findIndex((chat) => chat.id === chatId);

    if (chatIndex === -1) return false;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId,
      senderName,
      senderImage,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    allChats[chatIndex].messages.push(newMessage);
    allChats[chatIndex].lastMessage = message.trim();
    allChats[chatIndex].lastMessageTime = newMessage.timestamp;

    // Increment unread count if message is from coordinator
    const currentStudent = allChats[chatIndex].studentEmail;
    if (senderId !== currentStudent) {
      allChats[chatIndex].unreadCount += 1;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allChats));
    return true;
  }

  /**
   * Mark all messages in a chat as read
   */
  static markChatAsRead(chatId: string, studentEmail: string): void {
    const chatData = localStorage.getItem(this.STORAGE_KEY);
    if (!chatData) return;

    const allChats: Chat[] = JSON.parse(chatData);
    const chatIndex = allChats.findIndex(
      (chat) => chat.id === chatId && chat.studentEmail === studentEmail
    );

    if (chatIndex === -1) return;

    allChats[chatIndex].unreadCount = 0;
    allChats[chatIndex].messages.forEach((msg) => {
      if (msg.senderId !== studentEmail) {
        msg.read = true;
      }
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allChats));
  }

  /**
   * Get total unread message count for a student
   */
  static getTotalUnreadCount(studentEmail: string): number {
    const chats = this.getStudentChats(studentEmail);
    return chats.reduce((total, chat) => total + chat.unreadCount, 0);
  }

  /**
   * Delete a chat
   */
  static deleteChat(chatId: string, studentEmail: string): boolean {
    const chatData = localStorage.getItem(this.STORAGE_KEY);
    if (!chatData) return false;

    const allChats: Chat[] = JSON.parse(chatData);
    const filtered = allChats.filter(
      (chat) => !(chat.id === chatId && chat.studentEmail === studentEmail)
    );

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}
