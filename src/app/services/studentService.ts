import { Student } from "./adminService";

/**
 * StudentService - Manages student-side operations that sync with Admin Portal
 * 
 * This service ensures that when students update their profile, the changes
 * are reflected both in their session AND in the Admin Portal's student list.
 */
export class StudentService {
  private static BASE_URL = "http://localhost:5000/api";
  private static USE_MOCK = true;

  /**
   * Update student profile (name, phone, profile picture)
   * This syncs changes to both student session AND admin portal
   */
  static async updateProfile(
    email: string,
    updates: {
      name?: string;
      phone?: string;
      profilePicture?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Update session data
          if (updates.name) localStorage.setItem("userName", updates.name);
          if (updates.phone) localStorage.setItem("userPhone", updates.phone);
          if (updates.profilePicture) localStorage.setItem("userProfilePicture", updates.profilePicture);

          // CRITICAL: Also update studentsData for Admin Portal visibility
          const studentsData = localStorage.getItem("studentsData");
          if (studentsData) {
            const students: Student[] = JSON.parse(studentsData);
            const index = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
            
            if (index !== -1) {
              students[index] = {
                ...students[index],
                ...(updates.name && { name: updates.name }),
                ...(updates.phone && { phone: updates.phone }),
                ...(updates.profilePicture && { profilePicture: updates.profilePicture }),
              };
              localStorage.setItem("studentsData", JSON.stringify(students));
              console.log("✅ Student profile updated and synced to Admin Portal:", email);
              resolve({ success: true });
            } else {
              resolve({ success: false, error: "Student not found in system" });
            }
          } else {
            resolve({ success: false, error: "Students data not initialized" });
          }
        }, 500);
      });
    }

    // Flask API mode
    try {
      const response = await fetch(`${this.BASE_URL}/students/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }

      // On success, update local session data
      if (updates.name) localStorage.setItem("userName", updates.name);
      if (updates.phone) localStorage.setItem("userPhone", updates.phone);
      if (updates.profilePicture) localStorage.setItem("userProfilePicture", updates.profilePicture);

      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: "Failed to update profile" };
    }
  }

  /**
   * Change student password
   * Updates both login credentials and admin portal data
   */
  static async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const studentsData = localStorage.getItem("studentsData");
          if (studentsData) {
            const students: Student[] = JSON.parse(studentsData);
            const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
            
            if (!student) {
              resolve({ success: false, error: "Student not found" });
              return;
            }

            // Verify current password
            if (student.password !== currentPassword) {
              resolve({ success: false, error: "Current password is incorrect" });
              return;
            }

            // Update password
            const index = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
            if (index !== -1) {
              students[index].password = newPassword;
              localStorage.setItem("studentsData", JSON.stringify(students));
              console.log("✅ Password changed successfully for:", email);
              resolve({ success: true });
            } else {
              resolve({ success: false, error: "Failed to update password" });
            }
          } else {
            resolve({ success: false, error: "Students data not initialized" });
          }
        }, 500);
      });
    }

    // Flask API mode
    try {
      const response = await fetch(`${this.BASE_URL}/students/${email}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }

      return { success: true };
    } catch (error) {
      console.error("Change password error:", error);
      return { success: false, error: "Failed to change password" };
    }
  }

  /**
   * Get student profile data
   */
  static async getProfile(email: string): Promise<{ success: boolean; student?: Student; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const studentsData = localStorage.getItem("studentsData");
          if (studentsData) {
            const students: Student[] = JSON.parse(studentsData);
            const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
            
            if (student) {
              resolve({ success: true, student });
            } else {
              resolve({ success: false, error: "Student not found" });
            }
          } else {
            resolve({ success: false, error: "Students data not initialized" });
          }
        }, 300);
      });
    }

    // Flask API mode
    try {
      const response = await fetch(`${this.BASE_URL}/students/${email}`);

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }

      const student = await response.json();
      return { success: true, student };
    } catch (error) {
      console.error("Get profile error:", error);
      return { success: false, error: "Failed to fetch profile" };
    }
  }
}
