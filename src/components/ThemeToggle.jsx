import { useState } from "react";
import { useClickSound } from "../hooks/useClickSound";
import "./ThemeToggle.css";

const STORAGE_KEY = "jrmy-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

// Every write to the document goes through here, and it is deliberately a
// plain function rather than a useEffect. startViewTransition snapshots the
// old root, runs its callback, then snapshots the new one — so the swap has
// to land synchronously inside that callback. An effect would fire after both
// snapshots were already taken and the wipe would animate nothing.
function applyTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  // Keep native UI (scrollbars, form controls) on the chosen theme rather than
  // the OS one the index.html default advertises.
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute("content", next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* localStorage disabled — ignore */
  }
}

function runSwap(next) {
  const root = document.documentElement;

  // Safari < 18, Firefox. No API, plain swap — the 280ms colour transitions in
  // index.css carry it.
  if (!document.startViewTransition) {
    applyTheme(next);
    return;
  }

  // index.css puts a 280ms colour transition on .app, .nav, .card and friends.
  // For the length of the wipe those are animating *behind an opaque
  // snapshot* — nobody can see a single frame of them, but every one of those
  // elements still repaints on every frame and takes main-thread time the wipe
  // wants. Suppressing them is what stops the two from stuttering each other.
  root.setAttribute("data-wiping", "");

  const wipe = document.startViewTransition(() => applyTheme(next));
  // `finished` resolves when the reveal completes and rejects if the transition
  // is skipped mid-flight (a second click, a navigation). finally covers both,
  // so the attribute can never get stuck and leave the page transitionless.
  wipe.finished.finally(() => root.removeAttribute("data-wiping"));
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const play = useClickSound();

  // No mount effect: the inline script in index.html applies the stored theme
  // before first paint, so there is nothing left to reconcile on mount.
  const isDark = theme === "dark";
  const next = isDark ? "light" : "dark";

  const handleToggle = () => {
    play(isDark ? "toggle-off" : "toggle-on");
    setTheme(next);

    // The wipe is the animation now. A view transition snapshots the entire
    // root element, which means anything animating inside it — including a
    // moon/sun cross-fade — is baked into the two static snapshots and never
    // seen. So there is deliberately no per-icon tween here.
    runSwap(next);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        aria-hidden="true"
        focusable="false"
      >
        {isDark ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        )}
      </svg>
    </button>
  );
}