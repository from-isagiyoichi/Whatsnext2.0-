import { AuthUser, validateCredentials as mockValidate } from "../utils/auth";

export class AuthService {
  private static BASE_URL = "http://localhost:5000/api"; // Change to your deployed Flask API URL
  private static USE_MOCK = true; // Set to false when Flask backend is deployed

  static async login(email: string, password: string): Promise<{ user: AuthUser | null; error?: string }> {
    if (this.USE_MOCK) {
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = mockValidate(email, password);
          if (user) {
            resolve({ user });
          } else {
            resolve({ user: null, error: "Invalid credentials" });
          }
        }, 1000);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { user: null, error: errorData.error || "Login failed" };
      }
      
      const data = await response.json();
      
      // Store token and user info
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      
      return { 
        user: {
          name: data.user.name,
          email: data.user.email
        }
      };
    } catch (error) {
      console.error("Auth API Error:", error);
      return { user: null, error: "Connection error. Please check if the Flask backend is running." };
    }
  }

  static logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    // If using real API, might call a logout endpoint here
  }

  static getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  static async validateToken(): Promise<boolean> {
    if (this.USE_MOCK) {
      // Check if user is logged in locally
      return !!localStorage.getItem("userEmail");
    }

    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.BASE_URL}/auth/validate`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const userEmail = localStorage.getItem("userEmail");

          if (!userEmail) {
            resolve({ success: false, error: "User not authenticated" });
            return;
          }

          // Get students data from localStorage
          const studentsData = localStorage.getItem("studentsData");
          if (!studentsData) {
            resolve({ success: false, error: "Student data not found" });
            return;
          }

          try {
            const students = JSON.parse(studentsData);
            const studentIndex = students.findIndex(
              (s: any) => s.email.toLowerCase() === userEmail.toLowerCase()
            );

            if (studentIndex === -1) {
              resolve({ success: false, error: "Student not found" });
              return;
            }

            const student = students[studentIndex];

            // Verify current password
            if (student.password !== currentPassword) {
              resolve({ success: false, error: "Current password is incorrect" });
              return;
            }

            // Update password in studentsData
            students[studentIndex].password = newPassword;
            localStorage.setItem("studentsData", JSON.stringify(students));

            console.log("✅ Password changed successfully for:", userEmail);
            resolve({ success: true });
          } catch (error) {
            console.error("Change password error:", error);
            resolve({ success: false, error: "Failed to change password" });
          }
        }, 1000);
      });
    }

    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || "Password change failed" };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, error: "Connection error. Please try again." };
    }
  }

  static async updateProfile(data: { name?: string; phone?: string; profilePicture?: string }): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          if (data.name) {
            localStorage.setItem("userName", data.name);
          }
          if (data.phone) {
            localStorage.setItem("userPhone", data.phone);
          }
          if (data.profilePicture) {
            localStorage.setItem("userProfilePicture", data.profilePicture);
          }
          resolve({ success: true });
        }, 1000);
      });
    }

    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.BASE_URL}/user/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || "Profile update failed" };
      }

      const responseData = await response.json();
      
      // Update localStorage with new data
      if (responseData.user) {
        if (responseData.user.name) localStorage.setItem("userName", responseData.user.name);
        if (responseData.user.phone) localStorage.setItem("userPhone", responseData.user.phone);
        if (responseData.user.profilePicture) localStorage.setItem("userProfilePicture", responseData.user.profilePicture);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Connection error. Please try again." };
    }
  }

  static getUserProfile() {
    return {
      name: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
      phone: localStorage.getItem("userPhone") || "",
      profilePicture: localStorage.getItem("userProfilePicture") || null,
    };
  }

  // Admin Login
  static async adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Get stored admin credentials (supports bidirectional sync)
          const storedAdminEmail = localStorage.getItem("adminEmail") || "Adminmbcet@mbcet.ac.in";
          const storedAdminPassword = localStorage.getItem("adminPassword") || "therealadmin@mbcet";
          
          // Trim whitespace and compare
          const trimmedEmail = email.trim();
          const trimmedPassword = password.trim();
          
          if (trimmedEmail === storedAdminEmail && trimmedPassword === storedAdminPassword) {
            // Store admin session
            localStorage.setItem("adminToken", "mock-admin-token-" + Date.now());
            localStorage.setItem("adminEmail", storedAdminEmail);
            localStorage.setItem("isAdmin", "true");
            console.log("✅ Admin login successful");
            resolve({ success: true });
          } else {
            console.log("❌ Admin login failed - Invalid credentials");
            resolve({ success: false, error: "Invalid admin credentials" });
          }
        }, 1000);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || "Admin login failed" };
      }
      
      const data = await response.json();
      
      // Store admin token and info
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", data.admin.email);
      localStorage.setItem("isAdmin", "true");
      
      return { success: true };
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, error: "Connection error. Please check if the Flask backend is running." };
    }
  }

  static adminLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    // Keep adminEmail, adminPassword, and adminContactInfo - they should persist!
    // These are part of the bidirectional sync system
  }

  static isAdminLoggedIn(): boolean {
    return localStorage.getItem("isAdmin") === "true" && !!localStorage.getItem("adminToken");
  }
}