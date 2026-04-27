import { Event, events as defaultEvents } from "../data/events";
import { parseStudentList } from "../utils/auth";

/**
 * Student interface matching the database schema
 * This structure is synchronized between Admin Portal and Student Portal via localStorage
 */
export interface Student {
  name: string;
  email: string;
  password: string;
  phone?: string;
  branch: string;
  year: string;
  admissionNumber: string;
  profilePicture?: string;
}

/**
 * AdminService - Manages all admin operations for Events and Students
 * 
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      DATA SYNCHRONIZATION ARCHITECTURE                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * STORAGE KEYS:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ • "studentsData" → All student records (name, email, password, branch, etc.) │
 * │ • "eventsData"   → All event records (title, date, venue, price, etc.)       │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * SYNCHRONIZATION FLOW:
 * ┌──────────────────────┐         ┌──────────────────────┐
 * │   ADMIN PORTAL       │         │   STUDENT PORTAL     │
 * ├──────────────────────┤         ├──────────────────────┤
 * │ • Add Student        │────┐    │ • Login Validation   │
 * │ • Edit Student       │    │    │ • Event Listing      │
 * │ • Delete Student     │    │    │ • Event Details      │
 * │ • Add Event          │    │    │ • Booking            │
 * │ • Edit Event         │    │    └──────────┬───────────┘
 * │ • Delete Event       │    │               │
 * └──────────┬───────────┘    ��               │
 *            │                │               │
 *            │                ▼               │
 *            │      ┌──────────────────┐      │
 *            └─────▶│  localStorage    │◀─────┘
 *                   │  - studentsData  │
 *                   │  - eventsData    │
 *                   └──────────────────┘
 * 
 * KEY GUARANTEES:
 * ✓ Student count in Admin Dashboard = Students in Students Management
 * ✓ Event count in Admin Dashboard = Events in Events Management
 * ✓ Student added in Admin → Can login immediately in Student Portal
 * ✓ Student deleted in Admin → Cannot login in Student Portal
 * ✓ Event added in Admin → Appears immediately on Student Home page
 * ✓ Event edited in Admin → Updates reflected in Event Details page
 * 
 * INITIALIZATION:
 * - On first app load, students from /imports/student-list.txt are imported
 * - Subsequently, all operations use localStorage for instant sync
 * - See: Root.tsx → initializeStudentsStorage()
 * 
 * MOCK MODE:
 * - USE_MOCK = true: Uses localStorage (current mode, instant sync)
 * - USE_MOCK = false: Uses Flask API backend (set BASE_URL to your API)
 */
export class AdminService {
  private static BASE_URL = "http://localhost:5000/api";
  private static USE_MOCK = true;

  // Events Management
  static async getAllEvents(): Promise<Event[]> {
    if (this.USE_MOCK) {
      const eventsData = localStorage.getItem("eventsData");
      if (!eventsData) {
        // Initialize with default events if empty
        console.log("📝 Initializing eventsData with", defaultEvents.length, "default events");
        localStorage.setItem("eventsData", JSON.stringify(defaultEvents));
        return defaultEvents;
      }
      const events = JSON.parse(eventsData);
      console.log("📚 Loaded", events.length, "events from localStorage");
      return events;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/events`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch events");
      return await response.json();
    } catch (error) {
      console.error("Fetch events error:", error);
      return [];
    }
  }

  static async createEvent(event: Partial<Event>): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const eventsData = localStorage.getItem("eventsData");
          const events = eventsData ? JSON.parse(eventsData) : [];

          const newEvent = {
            ...event,
            id: `event-${Date.now()}`,
            createdAt: new Date().toISOString(),
          };

          console.log("✅ Creating new event:", {
            title: newEvent.title,
            category: newEvent.category,
            subtitle: newEvent.subtitle,
            image: newEvent.image ? "Image present" : "No image",
            coordinators: newEvent.coordinators?.length || 0
          });

          events.push(newEvent);
          localStorage.setItem("eventsData", JSON.stringify(events));
          console.log("💾 Total events in storage:", events.length);
          resolve({ success: true });
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/events`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(event),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Create event error:", error);
      return { success: false, error: "Failed to create event" };
    }
  }

  static async updateEvent(eventId: string, updates: Partial<Event>): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const eventsData = localStorage.getItem("eventsData");
          const events = eventsData ? JSON.parse(eventsData) : [];
          
          const index = events.findIndex((e: Event) => e.id === eventId);
          if (index !== -1) {
            events[index] = { ...events[index], ...updates };
            localStorage.setItem("eventsData", JSON.stringify(events));
            resolve({ success: true });
          } else {
            resolve({ success: false, error: "Event not found" });
          }
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/events/${eventId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Update event error:", error);
      return { success: false, error: "Failed to update event" };
    }
  }

  static async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const eventsData = localStorage.getItem("eventsData");
          const events = eventsData ? JSON.parse(eventsData) : [];
          
          const filtered = events.filter((e: Event) => e.id !== eventId);
          localStorage.setItem("eventsData", JSON.stringify(filtered));
          resolve({ success: true });
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/events/${eventId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Delete event error:", error);
      return { success: false, error: "Failed to delete event" };
    }
  }

  // Students Management
  static async getAllStudents(): Promise<Student[]> {
    if (this.USE_MOCK) {
      const studentsData = localStorage.getItem("studentsData");
      if (studentsData) {
        return JSON.parse(studentsData);
      } else {
        // Initialize from student-list.txt if empty
        const initialStudents = parseStudentList().map(u => ({
          name: u.name,
          email: u.email,
          password: u.password,
          branch: "EEE",
          year: "1",
          admissionNumber: "TBA"
        }));
        localStorage.setItem("studentsData", JSON.stringify(initialStudents));
        return initialStudents;
      }
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/students`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch students");
      return await response.json();
    } catch (error) {
      console.error("Fetch students error:", error);
      return [];
    }
  }

  static async addStudent(student: Student): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const studentsData = localStorage.getItem("studentsData");
          const students = studentsData ? JSON.parse(studentsData) : [];
          
          // Check if student already exists
          if (students.some((s: Student) => s.email === student.email)) {
            resolve({ success: false, error: "Student with this email already exists" });
            return;
          }
          
          students.push(student);
          localStorage.setItem("studentsData", JSON.stringify(students));
          console.log("✅ Student added to localStorage:", student.email, "- Can now login!");
          console.log("📊 Total students in system:", students.length);
          resolve({ success: true });
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/students`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(student),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Add student error:", error);
      return { success: false, error: "Failed to add student" };
    }
  }

  static async updateStudent(email: string, updates: Partial<Student>): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const studentsData = localStorage.getItem("studentsData");
          const students = studentsData ? JSON.parse(studentsData) : [];
          
          const index = students.findIndex((s: Student) => s.email === email);
          if (index !== -1) {
            students[index] = { ...students[index], ...updates };
            localStorage.setItem("studentsData", JSON.stringify(students));
            resolve({ success: true });
          } else {
            resolve({ success: false, error: "Student not found" });
          }
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/students/${email}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Update student error:", error);
      return { success: false, error: "Failed to update student" };
    }
  }

  static async deleteStudent(email: string): Promise<{ success: boolean; error?: string }> {
    if (this.USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const studentsData = localStorage.getItem("studentsData");
          const students = studentsData ? JSON.parse(studentsData) : [];
          
          const filtered = students.filter((s: Student) => s.email !== email);
          localStorage.setItem("studentsData", JSON.stringify(filtered));
          resolve({ success: true });
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.BASE_URL}/admin/students/${email}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Delete student error:", error);
      return { success: false, error: "Failed to delete student" };
    }
  }
}