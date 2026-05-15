export const profile = {
  name: "Jeremy",
  role: "Web Developer",
  status: "Student",
  tagline: "Building precise, minimal interfaces and resilient systems.",
  intro:
    "I design and ship full-stack products with an emphasis on clarity, performance, and craft. Currently focused on developer-facing tools and interface systems.",
  location: "Remote",
  email: "jrmymln@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/shiroshimazo" },
    { label: "Instagram", href: "https://www.instagram.com/jrmymlna" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jrmymlna/" },
  ],
};

export const skills = [
  { group: "Languages", items: ["Java", "C", "C++", "PHP", "JavaScript"] },
  { group: "Frontend", items: ["React", "Vite", "Next.js", "CSS Architecture"] },
  { group: "Backend", items: ["Node.js", "Supabase", "mySQL"] },
  { group: "Tooling", items: ["Git"] },
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
    period: "2024 — Present",
    role: "V.A / Freelancing",
    company: "Product Listing · Ads (Pinterest & Facebook) · Creatives",
    summary:
      "Managing online product listings, creating engaging ads, and designing visual content for social media platforms.",
  },
  {
    period: "2024 — 2025",
    role: "Grade 12 SHS — I.C.T",
    company: "With High Honors",
    summary:
      "Completed Senior High School with specialization in Information and Communications Technology, gaining strong skills in programming, networking, and digital tools.",
  },
  {
    period: "2023 — 2024",
    role: "Grade 11 SHS — I.C.T",
    company: "With High Honors",
    summary:
      "Studied junior year of Senior High School in ICT, developing foundational knowledge in computing, multimedia, and IT concepts.",
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
    title: "Barbershop Management System",
    tag: "Web-Based System",
    year: "Ongoing",
    description:
      "Upcoming web app for scheduling, customer management, and services tracking.",
    stack: ["React", "Supabase"],
    repo: "https://github.com/shiroshimazo/barbershop-management-system",
    upcoming: true,
  },
];
