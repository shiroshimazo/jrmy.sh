import { usePatch } from "@web-kits/audio/react";
import { minimal } from "../../audio/index";

export function useClickSound() {
  const patch = usePatch(minimal._patch);
  return (name) => patch?.play(name);
}
