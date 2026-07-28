import {
  SiC,
  SiCplusplus,
  SiPhp,
  SiJavascript,
  SiReact,
  SiVite,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiSupabase,
  SiMysql,
  SiFigma,
  SiClaudecode,
  SiOpencode,
  SiGit,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
// Simple Icons carries no OpenAI mark, so Codex borrows Remix's.
import { RiOpenaiFill } from "react-icons/ri";

/**
 * Maps a skill label to its brand icon. Keys mirror the strings in
 * `skills[].items` and `projects[].stack` from content.js.
 */
const icons = {
  Java: FaJava,
  C: SiC,
  "C++": SiCplusplus,
  PHP: SiPhp,
  JavaScript: SiJavascript,
  React: SiReact,
  Vite: SiVite,
  "Next.js": SiNextdotjs,
  Tailwind: SiTailwindcss,
  "Node.js": SiNodedotjs,
  Supabase: SiSupabase,
  mySQL: SiMysql,
  Figma: SiFigma,
  Codex: RiOpenaiFill,
  "Claude Code": SiClaudecode,
  "Open Code": SiOpencode,
  Git: SiGit,
};

/** Java's UI toolkits ship with the language and have no separate brand mark. */
const aliases = {
  javaswing: FaJava,
  javafx: FaJava,
};

// Project stacks and the skills list don't always agree on case
// ("MySQL" vs "mySQL"), so resolve on a lowercased key.
const byKey = new Map(
  Object.entries(icons).map(([label, Icon]) => [label.toLowerCase(), Icon])
);

/** Returns the icon component for a label, or undefined if it has none. */
export function getSkillIcon(label) {
  const key = label.toLowerCase();
  return byKey.get(key) ?? aliases[key];
}
