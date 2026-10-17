import gr11cert from "../assets/gr11cert.jpg";
import gr12cert from "../assets/gr12cert.jpg";

export const profile = {
  name: "Jeremy Malana",
  role: "Web Developer",
  status: "Student",
  // The single line under the name in the hero.
  heroRole: "Web Development | Student",
  // Hero copy: one lead paragraph, one supporting paragraph. Kept out of the
  // component so the words live with the rest of the profile data.
  introLead:
    "Remote from the Philippines — I build web interfaces that stay fast and legible under real use.",
  intro:
    "Second-year BSIT student at BestLink College, shipping full-stack work with React, Node and MySQL. Alongside coursework I run product listings and paid campaigns for a small e-commerce brand, which is where I learned that polish and performance are the same problem.",
  location: "Remote",
  email: "jrmymln@gmail.com",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/yosh1mur4h" },
    { label: "GitHub", href: "https://github.com/shiroshimazo" },
    { label: "Instagram", href: "https://www.instagram.com/jrmy.xsh/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jrmymlna/" },
  ],
};

export const skills = [
  { group: "Languages", items: ["Java", "C", "C++", "PHP", "JavaScript"] },
  { group: "Frameworks", items: ["React", "Vite", "Next.js", "Tailwind"] },
  { group: "Backend", items: ["Node.js", "Supabase", "MySQL"] },
  { group: "Design", items: ["Figma"] },
  { group: "AI", items: ["Codex", "Claude Code", "OpenCode"] },
  { group: "VCS Tool", items: ["Git"] },
];

export const experience = [
  {
    period: "2025 — Present",
    role: "2nd Year College — BSIT",
    company: "BestLink College of the Philippines",
    summary:
      "Currently pursuing a Bachelor of Science in Information Technology, focusing on software development and digital technologies.",
  },
  {
    period: "Oct 2024 — Now",
    role: "E-commerce Marketing Specialist",
    tag: "V.A",
    company:
      "Products Listings, Facebook Ads Manager, Pinterest Ads Manager and Products Creatives Making",
    summary:
      "Running product listings and paid campaigns end to end — building the catalogue, producing the creatives, and reading the numbers back to decide what runs next.",
    // `work: true` surfaces this row in the hero's Work list as professional
    // work; the school entries stay in the About timeline only. One array, two
    // renderers — so the hero and About can never disagree about the dates.
    work: true,
  },
  {
    period: "2024 — 2025",
    role: "Grade 12 SHS — I.C.T",
    company: "With High Honors",
    summary:
      "Completed Senior High School with specialization in Information and Communications Technology, gaining strong skills in programming, networking, and digital tools.",
    cert: gr12cert,
  },
  {
    period: "2023 — 2024",
    role: "Grade 11 SHS — I.C.T",
    company: "With High Honors",
    summary:
      "Studied junior year of Senior High School in ICT, developing foundational knowledge in computing, multimedia, and IT concepts.",
    cert: gr11cert,
  },
];

export const projects = [
  {
    title: "Order Management System",
    tag: "Application System",
    year: "2024",
    description:
      "A desktop application for managing customer orders, inventory, and transactions.",
    stack: ["Java", "JavaSwing", "MySQL"],
    repo: "https://github.com/shiroshimazo/OMS",
  },
  {
    title: "Employee Management System",
    tag: "CLI-Based System",
    year: "2026",
    description:
      "A command-line application to manage employee records and payroll.",
    stack: ["C++"],
    repo: "https://github.com/shiroshimazo/employee-payroll-system",
  },
  {
    title: "Order Management System V2",
    tag: "Web-Based System",
    year: "2026",
    description:
      "Web-based system for managing orders with enhanced features and user interface.",
    stack: ["Java", "JavaFX", "MySQL"],
    repo: "https://github.com/shiroshimazo/order-management-system-v2",
  },
  {
    title: "Pet Adoption System",
    tag: "UI Mockup",
    year: "2026",
    description:
      "UI mockup only, made in Figma, for pet listings, adoption applications, and adopter records.",
    stack: ["Figma"],
    repo: "https://github.com/shiroshimazo/pet-adoption-system",
  },
  {
    title: "Quiz Application System",
    tag: "Application System",
    year: "2026",
    description:
      "Desktop application for building quizzes, running timed attempts, and tracking scores.",
    stack: ["Java", "JavaSwing", "SQLite"],
    repo: "https://github.com/shiroshimazo/quizora",
  },
  {
    title: "RFID Student Attendance System",
    tag: "IoT-Based System",
    year: "2026",
    description:
      "RFID attendance system that logs successful and failed taps to a web dashboard and sends SMS notifications to parents.",
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "C++",
      "ESP32",
    ],
    repo: "https://github.com/shiroshimazo/rfid-attendance-web-system",
    href: "https://rfid-attendance-web-system.vercel.app",
  },
];
