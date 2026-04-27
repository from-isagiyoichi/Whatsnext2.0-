import eventImage1 from "figma:asset/84fd91b1f7df133143159ac3bb0982a4d3e07062.png";
import eventImage5 from "figma:asset/fc6653371908e063c070b2e469d6bc2c05a58490.png"; // Assuming this was used in Home.tsx, importing to be safe if needed

// Re-using the interfaces
export interface Coordinator {
  id: string;
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Event {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: "live" | "coming-soon";
  price: {
    earlyBird: number;
    regular: number;
  };
  earlyBirdDeadline: string;
  coordinators: Coordinator[];
}

// Mock Data
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    image: eventImage1,
    title: "CROSSROADS",
    subtitle: "TECHNO-CULTURAL FEST OF MBCET",
    date: "March 15, 2026",
    time: "10:00 AM - 8:00 PM",
    venue: "MBCET Main Auditorium, Trivandrum",
    description: "Join us for the biggest techno-cultural fest of the year! Experience amazing performances, technical workshops, cultural shows, and much more. A celebration of talent, creativity, and innovation.",
    category: "live",
    price: {
      earlyBird: 199,
      regular: 299,
    },
    earlyBirdDeadline: "March 12, 2026",
    coordinators: [
      {
        id: "c1",
        name: "Priya Sharma",
        role: "Event Head",
        image: "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmclMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzIxMjM2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "priya.cs21@mbcet.ac.in",
        phone: "+91 98765 43210",
        social: {
          linkedin: "priya-sharma",
          instagram: "@priyasharma",
        },
      },
      {
        id: "c2",
        name: "Rahul Menon",
        role: "Technical Coordinator",
        image: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjIxNDQxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        email: "rahul.ec21@mbcet.ac.in",
        phone: "+91 98765 43211",
        social: {
          linkedin: "rahul-menon",
          twitter: "@rahulmenon",
        },
      },
      {
        id: "c3",
        name: "Sarah Thomas",
        role: "Cultural Coordinator",
        image: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBldmVudCUyMGNvb3JkaW5hdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyMjE2ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "sarah.me21@mbcet.ac.in",
        phone: "+91 98765 43212",
        social: {
          instagram: "@sarahthomas",
        },
      },
      {
        id: "c4",
        name: "Arjun Krishna",
        role: "Sponsorship Manager",
        image: "https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMG1hbmFnZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyMjE2ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "arjun.ee21@mbcet.ac.in",
        phone: "+91 98765 43213",
        social: {
          linkedin: "arjun-krishna",
        },
      },
    ],
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1717962690206-2d2f6ddac9db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwZW5naW5lZXJpbmclMjB0ZWNobm9sb2d5JTIwZXZlbnQlMjBmdXR1cmlzdGljJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcyMzg2Mjg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "TRYDAN",
    subtitle: "EEE DEPARTMENT TECH FEST",
    date: "April 5, 2026",
    time: "9:00 AM - 5:00 PM",
    venue: "MBCET Campus, Trivandrum",
    description: "A national level technical fest conducted by the Electrical and Electronics Engineering Department of MBCET. Join us for a showcase of innovation, technical workshops, and electrifying competitions.",
    category: "live",
    price: {
      earlyBird: 199,
      regular: 299,
    },
    earlyBirdDeadline: "April 2, 2026",
    coordinators: [
      {
        id: "c5",
        name: "Meera Nair",
        role: "Festival Director",
        image: "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmclMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzIxMjM2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "meera.btech21@mbcet.ac.in",
        phone: "+91 98765 43214",
        social: {
          instagram: "@meeranair",
          linkedin: "meera-nair",
        },
      },
      {
        id: "c6",
        name: "Vikram Pillai",
        role: "Program Manager",
        image: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjIxNDQxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        email: "vikram.mca22@mbcet.ac.in",
        phone: "+91 98765 43215",
        social: {
          linkedin: "vikram-pillai",
        },
      },
    ],
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1659456690967-bad366de0000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBjcm93ZCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzIxNzcxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "RHYTHM FEST",
    subtitle: "MUSIC & DANCE EXTRAVAGANZA",
    date: "May 20, 2026",
    time: "5:00 PM - 12:00 AM",
    venue: "Greenfield Arena, Bangalore",
    description: "Get ready to groove! Featuring top DJs, live bands, and electrifying dance performances. The ultimate music and dance festival experience.",
    category: "coming-soon",
    price: {
      earlyBird: 399,
      regular: 499,
    },
    earlyBirdDeadline: "May 17, 2026",
    coordinators: [
      {
        id: "c7",
        name: "DJ Aarav",
        role: "Music Director",
        image: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjIxNDQxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        email: "aarav.cs22@mbcet.ac.in",
        phone: "+91 98765 43216",
        social: {
          instagram: "@djaarav",
          twitter: "@djaarav",
        },
      },
    ],
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1761195696518-6384573549ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZXhwbyUyMGV2ZW50fGVufDF8fHx8MTc3MjIxNjM0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "TECH SUMMIT",
    subtitle: "INNOVATION & TECHNOLOGY EXPO",
    date: "June 10, 2026",
    time: "9:00 AM - 6:00 PM",
    venue: "Tech Park Convention Center, Hyderabad",
    description: "Explore the future of technology with workshops, hackathons, keynote speeches from industry leaders, and innovative product launches.",
    category: "coming-soon",
    price: {
      earlyBird: 499,
      regular: 599,
    },
    earlyBirdDeadline: "June 7, 2026",
    coordinators: [
      {
        id: "c8",
        name: "Ananya Reddy",
        role: "Summit Organizer",
        image: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBldmVudCUyMGNvb3JkaW5hdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyMjE2ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "ananya.it21@mbcet.ac.in",
        phone: "+91 98765 43217",
        social: {
          linkedin: "ananya-reddy",
          twitter: "@ananyareddy",
        },
      },
      {
        id: "c9",
        name: "Karthik Iyer",
        role: "Tech Lead",
        image: "https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMG1hbmFnZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyMjE2ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "karthik.cs22@mbcet.ac.in",
        phone: "+91 98765 43218",
        social: {
          linkedin: "karthik-iyer",
        },
      },
    ],
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1659543690669-d40b1bfefc12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHdvcmtzaG9wJTIwdGVjaG5vbG9neSUyMHNlbWluYXJ8ZW58MXx8fHwxNzcyMzg2NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "DRONE WORKSHOP",
    subtitle: "TALK SESSION & LIVE DEMO",
    date: "July 15, 2026",
    time: "10:00 AM - 4:00 PM",
    venue: "MBCET Seminar Hall, Trivandrum",
    description: "Discover the world of unmanned aerial vehicles. This session includes an expert talk on drone technology followed by a hands-on workshop on assembly and flight mechanics.",
    category: "coming-soon",
    price: {
      earlyBird: 150,
      regular: 250,
    },
    earlyBirdDeadline: "July 12, 2026",
    coordinators: [
      {
        id: "c10",
        name: "Rohan Das",
        role: "Workshop Lead",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTcyMjE2ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "rohan.mech22@mbcet.ac.in",
        phone: "+91 98765 43219",
        social: {
          linkedin: "rohan-das",
        },
      },
    ],
  },
];

// Service class (Simulates API)
export class EventService {
  private static BASE_URL = "http://localhost:5000/api"; // Change to your deployed Flask API URL
  private static USE_MOCK = true; // Set to false when Flask backend is deployed

  private static getAuthHeaders() {
    const token = localStorage.getItem("authToken") || localStorage.getItem("userEmail");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  static async getEvents(): Promise<Event[]> {
    if (this.USE_MOCK) {
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_EVENTS), 500);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/events`, {
        method: "GET",
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch events");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  }

  static async getEventById(id: string): Promise<Event | undefined> {
    if (this.USE_MOCK) {
       return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_EVENTS.find(e => e.id === id)), 300);
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/events/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch event");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return undefined;
    }
  }
}