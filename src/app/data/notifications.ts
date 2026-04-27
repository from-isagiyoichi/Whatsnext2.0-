export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  timestamp: string;
  read: boolean;
}

export const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Event: TRYDAN",
    message: "The EEE Department Tech Fest is now live! Check it out.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
  },
   {
    id: "2",
    title: "Drone Workshop",
    message: "Registrations are open for the Drone Workshop.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false,
  }
];

export const getNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem("notifications");
    if (!stored) {
      localStorage.setItem("notifications", JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    return JSON.parse(stored);
  } catch (e) {
    return initialNotifications;
  }
};

export const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
  try {
    const notifications = getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updated = [newNotification, ...notifications];
    localStorage.setItem("notifications", JSON.stringify(updated));
    return newNotification;
  } catch (e) {
    console.error("Failed to add notification", e);
  }
};

export const markAllAsRead = () => {
  try {
    const notifications = getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("notifications", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to mark notifications as read", e);
    return [];
  }
};
