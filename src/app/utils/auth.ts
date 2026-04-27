import studentListRaw from "../../imports/student-list.txt?raw";

export interface AuthUser {
  email: string;
  password: string;
  name: string;
}

// Parse the student list file
export function parseStudentList(): AuthUser[] {
  const users: AuthUser[] = [];
  const lines = studentListRaw.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  
  let i = 0;
  while (i < lines.length) {
    const currentLine = lines[i];
    
    // Check if current line contains both email and password (separated by spaces)
    if (currentLine.includes('@mbcet.ac.in') && currentLine.split(/\s+/).length > 1) {
      const parts = currentLine.split(/\s+/);
      const email = parts[0];
      const password = parts.slice(1).join('');
      
      // Extract name from email (e.g., ajgayathrinair -> Ajgayathrinair)
      const namePart = email.split('@')[0].split('.')[0];
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      
      users.push({ email, password, name });
      i++;
    } 
    // Check if email is on current line and password on next line
    else if (currentLine.includes('@mbcet.ac.in') && i + 1 < lines.length) {
      const email = currentLine;
      const nextLine = lines[i + 1];
      
      // Check if next line looks like a password (doesn't contain @)
      if (!nextLine.includes('@')) {
        const password = nextLine;
        
        // Extract name from email
        const namePart = email.split('@')[0].split('.')[0];
        const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        
        users.push({ email, password, name });
        i += 2; // Skip both lines
      } else {
        i++;
      }
    } else {
      i++;
    }
  }
  
  return users;
}

// Get all authorized users
let authorizedUsers: AuthUser[] = [];
try {
  authorizedUsers = parseStudentList();
} catch (e) {
  console.error("Failed to parse student list:", e);
}

// Validate user credentials
export function validateCredentials(email: string, password: string): AuthUser | null {
  // Always check localStorage first to reflect admin portal updates
  const localStudentsData = localStorage.getItem("studentsData");
  
  if (localStudentsData) {
    try {
      const localStudents = JSON.parse(localStudentsData);
      const user = localStudents.find(
        (u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password.trim() === password.trim()
      );
      if (user) {
        console.log("✅ Login successful for:", user.email);
        return { email: user.email, password: user.password, name: user.name };
      }
    } catch (e) {
      console.error("Failed to parse local students data", e);
    }
  } else {
    // Initialize localStorage from text file on first run
    try {
      const initialStudents = authorizedUsers.map(u => ({
        name: u.name,
        email: u.email,
        password: u.password,
        branch: "EEE",
        year: "1",
        admissionNumber: "TBA"
      }));
      localStorage.setItem("studentsData", JSON.stringify(initialStudents));
      console.log("📝 Initialized studentsData in localStorage with", initialStudents.length, "students");
      
      // Now check again with initialized data
      const user = authorizedUsers.find(
        u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password.trim() === password.trim()
      );
      return user || null;
    } catch (e) {
      console.error("Failed to initialize students data", e);
    }
  }

  console.log("❌ Login failed for:", email);
  return null;
}

// Get all authorized users (for debugging)
export function getAuthorizedUsers(): AuthUser[] {
  return authorizedUsers;
}

// Get total student count from synchronized localStorage
export function getTotalStudentCount(): number {
  const localStudentsData = localStorage.getItem("studentsData");
  if (localStudentsData) {
    try {
      const localStudents = JSON.parse(localStudentsData);
      return localStudents.length;
    } catch (e) {
      console.error("Failed to parse local students data", e);
      return authorizedUsers.length;
    }
  }
  return authorizedUsers.length;
}

// Initialize students in localStorage if not already present
export function initializeStudentsStorage(): void {
  const localStudentsData = localStorage.getItem("studentsData");
  if (!localStudentsData) {
    const initialStudents = authorizedUsers.map(u => ({
      name: u.name,
      email: u.email,
      password: u.password,
      branch: "EEE",
      year: "1",
      admissionNumber: "TBA"
    }));
    localStorage.setItem("studentsData", JSON.stringify(initialStudents));
  }

  // Initialize admin credentials if not present (persistent storage)
  if (!localStorage.getItem("adminEmail")) {
    localStorage.setItem("adminEmail", "Adminmbcet@mbcet.ac.in");
  }
  if (!localStorage.getItem("adminPassword")) {
    localStorage.setItem("adminPassword", "therealadmin@mbcet");
  }

  // Check if events data has invalid figma:asset references and fix them
  const eventsData = localStorage.getItem("eventsData");
  if (eventsData) {
    try {
      const events = JSON.parse(eventsData);
      let needsUpdate = false;

      events.forEach((event: any) => {
        // Check if event image is a figma:asset reference (starts with blob: or is undefined)
        if (!event.image || event.image.includes('blob:') || event.image.includes('figma:asset') || event.image === 'undefined') {
          event.image = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1080";
          needsUpdate = true;
        }

        // Fix coordinator images
        if (event.coordinators) {
          event.coordinators.forEach((coord: any) => {
            if (!coord.image || coord.image.includes('blob:') || coord.image.includes('figma:asset') || coord.image === 'undefined') {
              coord.image = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";
              needsUpdate = true;
            }
          });
        }
      });

      if (needsUpdate) {
        localStorage.setItem("eventsData", JSON.stringify(events));
        console.log("✅ Fixed event images with invalid references");
      }
    } catch (error) {
      console.error("Failed to fix event images:", error);
    }
  }
}