import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@hugeicons/core-free-icons";
import { profile } from "./content";

// Looked up by the display label in profile.socials, so these keys must match
// those labels exactly — case included. Hugeicons spells two of them
// GithubIcon / LinkedinIcon, so the imports are aliased rather than keyed as
// they come. A casing drift here does not throw; it just makes a brand quietly
// disappear, which is what happened once already. Hence the dev check.
export const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  GitHub: GithubIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
};

if (import.meta.env.DEV) {
  const unmapped = profile.socials
    .filter((s) => !SOCIAL_ICONS[s.label])
    .map((s) => s.label);
  if (unmapped.length) {
    console.warn(
      `SOCIAL_ICONS has no icon for ${unmapped.join(", ")} — ` +
        "key it exactly as the label in profile.socials."
    );
  }
}