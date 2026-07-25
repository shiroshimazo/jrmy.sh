import {
  SiC,
  SiCplusplus,
  SiPhp,
  SiJavascript,
  SiReact,
  SiVite,
  SiNextdotjs,
  SiCss,
  SiNodedotjs,
  SiSupabase,
  SiMysql,
  SiGit,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

/**
 * Maps a skill label (exact string from content.js) to its brand icon.
 * Keys must match the strings in `skills[].items`.
 */
export const skillIcons = {
  Java: FaJava,
  C: SiC,
  "C++": SiCplusplus,
  PHP: SiPhp,
  JavaScript: SiJavascript,
  React: SiReact,
  Vite: SiVite,
  "Next.js": SiNextdotjs,
  "CSS Architecture": SiCss,
  "Node.js": SiNodedotjs,
  Supabase: SiSupabase,
  mySQL: SiMysql,
  Git: SiGit,
};
