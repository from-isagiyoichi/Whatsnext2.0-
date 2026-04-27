export interface BookingItem {
  eventId: string;
  ticketType: "earlyBird" | "regular";
  quantity: number;
}

export interface Booking {
  bookingId: string;
  event: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    date: string;
    time: string;
    venue: string;
  };
  ticketType: "earlyBird" | "regular";
  quantity: number;
  totalPrice: number;
  qrCode?: string;
  bookingDate: string;
  status: string;
}

export class BookingService {
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
   * Create bookings from cart items
   */
  static async createBookings(items: BookingItem[]): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      // Mock implementation - just return success
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 800);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/bookings`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || "Booking failed" };
      }

      return { success: true };
    } catch (error) {
      console.error("Booking API Error:", error);
      return { success: false, error: "Connection error" };
    }
  }

  /**
   * Get all bookings for current user
   */
  static async getBookings(): Promise<Booking[]> {
    if (this.USE_MOCK) {
      // Return bookings from localStorage
      return new Promise((resolve) => {
        setTimeout(() => {
          const bookedTickets = localStorage.getItem("bookedTickets");
          const tickets = bookedTickets ? JSON.parse(bookedTickets) : [];
          resolve(tickets);
        }, 500);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/bookings`, {
        method: "GET",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error("Failed to fetch bookings");
      return await response.json();
    } catch (error) {
      console.error("Booking API Error:", error);
      return [];
    }
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || "Cancellation failed" };
      }

      return { success: true };
    } catch (error) {
      console.error("Booking API Error:", error);
      return { success: false, error: "Connection error" };
    }
  }
}
