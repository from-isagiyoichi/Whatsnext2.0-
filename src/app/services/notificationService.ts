export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  isRead: boolean;
  createdAt: string;
}

export class NotificationService {
  private static BASE_URL = "http://localhost:5000/api"; // Change to your deployed Flask API URL
  private static USE_MOCK = true; // Set to false when Flask backend is deployed

  private static getAuthHeaders() {
    const token = localStorage.getItem("authToken") || localStorage.getItem("userEmail");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  /**
   * Get all notifications for current user
   */
  static async getNotifications(): Promise<Notification[]> {
    if (this.USE_MOCK) {
      // Return notifications from localStorage
      return new Promise((resolve) => {
        setTimeout(() => {
          const notifications = localStorage.getItem("notifications");
          const notifs = notifications ? JSON.parse(notifications) : [];
          resolve(notifs);
        }, 300);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/notifications`, {
        method: "GET",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");
      return await response.json();
    } catch (error) {
      console.error("Notification API Error:", error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: number): Promise<boolean> {
    if (this.USE_MOCK) {
      // Update localStorage
      return new Promise((resolve) => {
        setTimeout(() => {
          const notifications = localStorage.getItem("notifications");
          if (notifications) {
            const notifs = JSON.parse(notifications);
            const updated = notifs.map((n: Notification) => 
              n.id === notificationId ? { ...n, isRead: true } : n
            );
            localStorage.setItem("notifications", JSON.stringify(updated));
          }
          resolve(true);
        }, 200);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: this.getAuthHeaders()
      });

      return response.ok;
    } catch (error) {
      console.error("Notification API Error:", error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    if (this.USE_MOCK) {
      // Count from localStorage
      return new Promise((resolve) => {
        setTimeout(() => {
          const notifications = localStorage.getItem("notifications");
          if (notifications) {
            const notifs: Notification[] = JSON.parse(notifications);
            const count = notifs.filter(n => !n.isRead).length;
            resolve(count);
          } else {
            resolve(0);
          }
        }, 200);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/notifications/unread-count`, {
        method: "GET",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to fetch unread count");
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error("Notification API Error:", error);
      return 0;
    }
  }
}
