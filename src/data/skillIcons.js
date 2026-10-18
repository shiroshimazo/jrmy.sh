import { SiEspressif, SiTypescript } from "react-icons/si";
import {
  C,
  Canva,
  ClaudeCode,
  Codex,
  Cplusplus,
  Figma,
  Git,
  Java,
  Javascript,
  Motion,
  Mysql,
  Nextjs,
  Nodedotjs,
  Opencode,
  Php,
  React,
  Shadcnui,
  Supabase,
  Tailwind,
  Vite,
} from "../components/BrandMarks";

// TypeScript and ESP32 have no inlined mark yet, so they still come from the
// icon package rather than being drawn here.
const icons = {
  Java,
  C,
  "C++": Cplusplus,
  PHP: Php,
  "JavaScript": Javascript,
  React,
  Vite,
  Motion,
  "shadcn/ui": Shadcnui,
  "Next.js": Nextjs,
  Tailwind,
  "Node.js": Nodedotjs,
  Supabase,
  MySQL: Mysql,
  Figma,
  Canva,
  Codex,
  "Claude Code": ClaudeCode,
  OpenCode: Opencode,
  Git,
  TypeScript: SiTypescript,
  ESP32: SiEspressif,
};

/** Labels that share a mark with an entry above. */
const aliases = {
  // Java's UI toolkits ship with the language and have no separate brand mark.
  javaswing: Java,
  javafx: Java,
  "tailwind css": Tailwind,
  // Earlier copy of the site spelled it with a space.
  "open code": Opencode,
};

// Project stacks and the skills list don't always agree on case
// ("MySQL" vs "mysql"), so resolve on a lowercased key.
const byKey = new Map(
  Object.entries(icons).map(([label, Icon]) => [label.toLowerCase(), Icon])
);

/**
 * Maps a skill label to its brand mark. Keys mirror the strings in
 * `skills[].items` and `projects[].stack` from content.js.
 */
export function getSkillIcon(label) {
  const key = label.toLowerCase();
  return byKey.get(key) ?? aliases[key];
}