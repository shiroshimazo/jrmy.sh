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
    period: "2024 — Present",
    role: "Frontend Engineer",
    company: "Independent",
    summary:
      "Designing and building portfolio-grade interfaces, internal tools, and component systems for client projects.",
  },
  {
    period: "2022 — 2024",
    role: "Full-Stack Developer",
    company: "Self-directed",
    summary:
      "Shipped end-to-end web apps in React + Node, with a focus on performance, accessibility, and clean information design.",
  },
  {
    period: "2020 — 2022",
    role: "B.Sc. Computer Science",
    company: "University",
    summary:
      "Foundations in algorithms, systems, distributed computing, and human-computer interaction.",
  },
];

export const projects = [
  {
    title: "Atlas",
    tag: "Interface system",
    year: "2025",
    description:
      "A typography-first dashboard kit. Tokens, primitives, and dense data layouts engineered for clarity at scale.",
    stack: ["React", "TypeScript", "Vite"],
    href: "#",
    repo: "#",
  },
  {
    title: "Signal",
    tag: "Realtime app",
    year: "2025",
    description:
      "Latency-sensitive collaboration layer with operational-transform sync and presence. Sub-frame input handling.",
    stack: ["Node", "WebSocket", "Postgres"],
    href: "#",
    repo: "#",
  },
  {
    title: "Mono",
    tag: "CLI tool",
    year: "2024",
    description:
      "A monorepo task runner with deterministic caching. Designed for fast feedback and predictable CI.",
    stack: ["Go", "BoltDB"],
    href: "#",
    repo: "#",
  },
  {
    title: "Specimen",
    tag: "Type tester",
    year: "2024",
    description:
      "Browser-based typeface specimen tool. Variable-axis controls, OpenType inspection, exportable layouts.",
    stack: ["React", "Canvas"],
    href: "#",
    repo: "#",
  },
];
