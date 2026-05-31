import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { fadeUp } from "./motion/motion-presets";
import { profile } from "../data/content";
import "./GithubContributions.css";

const USERNAME = "shiroshimazo";
const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Group the flat day list into week-columns (rows 0–6 = Sun–Sat).
function toWeeks(days) {
  const weeks = [];
  let week = new Array(7).fill(null);
  for (const day of days) {
    const dow = new Date(day.date).getDay();
    week[dow] = day;
    if (dow === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  }
  if (week.some(Boolean)) weeks.push(week);
  return weeks;
}

// A month label sits above the first week-column that opens a new month.
function monthLabels(weeks) {
  const labels = [];
  let last = -1;
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const m = new Date(first.date).getMonth();
    if (m !== last) {
      labels.push({ col: i, name: MONTHS[m] });
      last = m;
    }
  });
  return labels;
}

const githubUrl =
  profile.socials.find((s) => s.label === "GitHub")?.href ??
  `https://github.com/${USERNAME}`;

// "3 contributions on Jun 17, 2025"
function tipText(date, count) {
  const when = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const n = Number(count);
  return `${n} contribution${n === 1 ? "" : "s"} on ${when}`;
}

export default function GithubContributions() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  // Bumped on each scroll-in to remount the grid and replay the cell sweep.
  const [runId, setRunId] = useState(0);
  // One shared tooltip, positioned in viewport coords via event delegation.
  const [tip, setTip] = useState(null);

  // Read the hovered cell's data-* and place the tooltip above it.
  // Hovering a gap/empty cell keeps the last tip so it glides, not flickers.
  function handlePointer(e) {
    const cell = e.target.closest(".ghc__cell[data-date]");
    if (!cell) return;
    const r = cell.getBoundingClientRect();
    setTip({
      text: tipText(cell.dataset.date, cell.dataset.count),
      x: r.left + r.width / 2,
      y: r.top,
    });
  }

  useEffect(() => {
    let alive = true;
    fetch(API)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => alive && setData(json))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  const weeks = data ? toWeeks(data.contributions) : [];
  const labels = data ? monthLabels(weeks) : [];
  const total = data?.total?.lastYear ?? 0;

  return (
    <motion.section
      className="ghc"
      aria-label="GitHub contributions"
      {...fadeUp(0, 28)}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
    >
      <div className="ghc__head">
        <span className="label">GitHub Activity</span>
        {data && (
          <span className="label ghc__total">
            {total.toLocaleString()} contributions · last year
          </span>
        )}
      </div>

      {error && (
        <p className="body ghc__msg">
          Couldn’t load the contribution graph.{" "}
          <a className="ghc__link" href={githubUrl} target="_blank" rel="noreferrer">
            View on GitHub ↗
          </a>
        </p>
      )}

      {!error && !data && (
        <div className="ghc__grid ghc__grid--skeleton" aria-hidden="true">
          {Array.from({ length: 53 * 7 }).map((_, i) => (
            <span key={i} className="ghc__cell" data-level="0" />
          ))}
        </div>
      )}

      {!error && data && (
        <motion.a
          className="ghc__scroll"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${total.toLocaleString()} contributions in the last year — open ${USERNAME} on GitHub`}
          onViewportEnter={() => setRunId((n) => n + 1)}
          viewport={{ once: false, margin: "-8% 0px -8% 0px" }}
        >
          <div className="ghc__months" aria-hidden="true">
            {labels.map(({ col, name }) => (
              <span key={`${name}-${col}`} className="ghc__month" style={{ gridColumn: col + 1 }}>
                {name}
              </span>
            ))}
          </div>

          <div
            key={runId}
            className="ghc__grid"
            role="img"
            aria-label={`${total} contributions`}
            onPointerMove={handlePointer}
            onPointerLeave={() => setTip(null)}
          >
            {weeks.map((week, w) =>
              week.map((day, d) => (
                <span
                  key={`${w}-${d}`}
                  className="ghc__cell"
                  style={{ "--i": w * 7 + d }}
                  data-level={day ? day.level : "empty"}
                  data-date={day ? day.date : undefined}
                  data-count={day ? day.count : undefined}
                />
              ))
            )}
          </div>
        </motion.a>
      )}

      {!error && data && (
        <div className="ghc__legend" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="ghc__cell" data-level={l} />
          ))}
          <span>More</span>
        </div>
      )}

      {tip &&
        createPortal(
          <div
            className="ghc__tip"
            role="tooltip"
            style={{ left: tip.x, top: tip.y }}
          >
            {tip.text}
          </div>,
          document.body
        )}
    </motion.section>
  );
}
