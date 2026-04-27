// Use Unsplash URLs that work in all contexts (localStorage, etc.)
const eventImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1080";
const riyaImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150";
const advaithImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150";
const joeImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150";
const ajGayathriImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150";

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
  earlyBirdDeadline: string; // 3 days before event
  coordinators: Coordinator[];
  // Optional admin fields
  eventType?: string;
  capacity?: number;
  status?: "upcoming" | "ongoing" | "completed";
  tags?: string[];
  highlights?: string[];
  registeredCount?: number;
  createdAt?: string;
}

export const events: Event[] = [
  {
    id: "1",
    image: eventImage,
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
        name: "Riya Achu Kurienn",
        role: "Event Head",
        image: riyaImage,
        email: "riyaachukurien.b25ee1147@mbcet.ac.in",
        phone: "+91 98765 43210",
        social: {
          linkedin: "riya-achu",
          instagram: "@riyaachu",
        },
      },
      {
        id: "c2",
        name: "Advaith Ramesh",
        role: "Technical Coordinator",
        image: advaithImage,
        email: "advaithramesh.b25ee1111@mbcet.ac.in",
        phone: "+91 98765 43211",
        social: {
          linkedin: "advaith-ramesh",
          twitter: "@advaithramesh",
        },
      },
      {
        id: "c3",
        name: "Joe Joseph",
        role: "Cultural Coordinator",
        image: joeImage,
        email: "joejosephdennis.b25ee1132@mbcet.ac.in",
        phone: "+91 98765 43212",
        social: {
          instagram: "@joejoseph",
        },
      },
      {
        id: "c4",
        name: "AJ Gayathri",
        role: "Sponsorship Manager",
        image: ajGayathriImage,
        email: "ajgayathrinair.b25ee1101@mbcet.ac.in",
        phone: "+91 98765 43213",
        social: {
          linkedin: "aj-gayathri",
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
        id: "c1_e2",
        name: "Riya Achu Kurienn",
        role: "Event Head",
        image: riyaImage,
        email: "riya.cs21@mbcet.ac.in",
        phone: "+91 98765 43210",
        social: {
          linkedin: "riya-achu",
          instagram: "@riyaachu",
        },
      },
      {
        id: "c2_e2",
        name: "Advaith Ramesh",
        role: "Technical Coordinator",
        image: advaithImage,
        email: "advaith.ec21@mbcet.ac.in",
        phone: "+91 98765 43211",
        social: {
          linkedin: "advaith-ramesh",
          twitter: "@advaithramesh",
        },
      },
      {
        id: "c3_e2",
        name: "Joe Joseph",
        role: "Cultural Coordinator",
        image: joeImage,
        email: "joe.me21@mbcet.ac.in",
        phone: "+91 98765 43212",
        social: {
          instagram: "@joejoseph",
        },
      },
      {
        id: "c4_e2",
        name: "AJ Gayathri",
        role: "Sponsorship Manager",
        image: ajGayathriImage,
        email: "gayathri.ee21@mbcet.ac.in",
        phone: "+91 98765 43213",
        social: {
          linkedin: "aj-gayathri",
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
        id: "c1_e3",
        name: "Riya Achu Kurienn",
        role: "Event Head",
        image: riyaImage,
        email: "riya.cs21@mbcet.ac.in",
        phone: "+91 98765 43210",
        social: {
          linkedin: "riya-achu",
          instagram: "@riyaachu",
        },
      },
      {
        id: "c2_e3",
        name: "Advaith Ramesh",
        role: "Technical Coordinator",
        image: advaithImage,
        email: "advaith.ec21@mbcet.ac.in",
        phone: "+91 98765 43211",
        social: {
          linkedin: "advaith-ramesh",
          twitter: "@advaithramesh",
        },
      },
      {
        id: "c3_e3",
        name: "Joe Joseph",
        role: "Cultural Coordinator",
        image: joeImage,
        email: "joe.me21@mbcet.ac.in",
        phone: "+91 98765 43212",
        social: {
          instagram: "@joejoseph",
        },
      },
      {
        id: "c4_e3",
        name: "AJ Gayathri",
        role: "Sponsorship Manager",
        image: ajGayathriImage,
        email: "gayathri.ee21@mbcet.ac.in",
        phone: "+91 98765 43213",
        social: {
          linkedin: "aj-gayathri",
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
        id: "c1_e4",
        name: "Riya Achu Kurienn",
        role: "Event Head",
        image: riyaImage,
        email: "riya.cs21@mbcet.ac.in",
        phone: "+91 98765 43210",
        social: {
          linkedin: "riya-achu",
          instagram: "@riyaachu",
        },
      },
      {
        id: "c2_e4",
        name: "Advaith Ramesh",
        role: "Technical Coordinator",
        image: advaithImage,
        email: "advaith.ec21@mbcet.ac.in",
        phone: "+91 98765 43211",
        social: {
          linkedin: "advaith-ramesh",
          twitter: "@advaithramesh",
        },
      },
      {
        id: "c3_e4",
        name: "Joe Joseph",
        role: "Cultural Coordinator",
        image: joeImage,
        email: "joe.me21@mbcet.ac.in",
        phone: "+91 98765 43212",
        social: {
          instagram: "@joejoseph",
        },
      },
      {
        id: "c4_e4",
        name: "AJ Gayathri",
        role: "Sponsorship Manager",
        image: ajGayathriImage,
        email: "gayathri.ee21@mbcet.ac.in",
        phone: "+91 98765 43213",
        social: {
          linkedin: "aj-gayathri",
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
        id: "c1_e5",
        name: "Riya Achu Kurienn",
        role: "Event Head",
        image: riyaImage,
        email: "riya.cs21@mbcet.ac.in",
        phone: "+91 98765 43210",
        social: {
          linkedin: "riya-achu",
          instagram: "@riyaachu",
        },
      },
      {
        id: "c2_e5",
        name: "Advaith Ramesh",
        role: "Technical Coordinator",
        image: advaithImage,
        email: "advaith.ec21@mbcet.ac.in",
        phone: "+91 98765 43211",
        social: {
          linkedin: "advaith-ramesh",
          twitter: "@advaithramesh",
        },
      },
      {
        id: "c3_e5",
        name: "Joe Joseph",
        role: "Cultural Coordinator",
        image: joeImage,
        email: "joe.me21@mbcet.ac.in",
        phone: "+91 98765 43212",
        social: {
          instagram: "@joejoseph",
        },
      },
      {
        id: "c4_e5",
        name: "AJ Gayathri",
        role: "Sponsorship Manager",
        image: ajGayathriImage,
        email: "gayathri.ee21@mbcet.ac.in",
        phone: "+91 98765 43213",
        social: {
          linkedin: "aj-gayathri",
        },
      },
    ],
  },
];