import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { fadeUp } from "./motion/motion-presets";
import { profile } from "../data/content";
import { useClickSound } from "../hooks/useClickSound";
import "./GithubContributions.css";

const USERNAME = "shiroshimazo";
const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// "2025-10-19" → local Date. `new Date(str)` parses as UTC midnight, which
// lands on the previous day for anyone west of UTC — that shifts every cell
// one row and moves the month boundaries with it.
function parseDay(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// The API hands back a trailing 365-day window, which starts mid-month.
// Trim the ragged head so the chart opens on a month boundary — Nov → Oct
// — and every group is a whole month.
function trimToWholeMonths(days) {
  if (!days.length) return days;
  const first = parseDay(days[0].date);
  if (first.getDate() === 1) return days;
  const start = new Date(first.getFullYear(), first.getMonth() + 1, 1);
  return days.filter((d) => parseDay(d.date) >= start);
}

// Group the days into months, and inside each month into the week-columns
// that month touches. A week straddling two months shows up in both —
// March's column holds the 29th–31st, April's column holds the 1st–4th —
// so a month's boxes never hold a day that isn't its own.
function toMonthGroups(days) {
  const groups = [];
  let col = 0;
  for (const day of days) {
    const d = parseDay(day.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, name: MONTHS[d.getMonth()], columns: new Map() };
      groups.push(group);
    }
    // Sunday of this day's week — the column the day sits in.
    const sunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
    const weekKey = `${sunday.getFullYear()}-${sunday.getMonth()}-${sunday.getDate()}`;
    let column = group.columns.get(weekKey);
    if (!column) {
      column = { week: new Array(7).fill(null), col };
      group.columns.set(weekKey, column);
      col += 1;
    }
    column.week[d.getDay()] = day;
  }
  return groups.map((g) => ({
    name: g.name,
    weeks: [...g.columns.values()],
  }));
}

const githubUrl =
  profile.socials.find((s) => s.label === "GitHub")?.href ??
  `https://github.com/${USERNAME}`;

// "3 contributions on Jun 17, 2025"
function tipText(date, count) {
  const when = parseDay(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const n = Number(count);
  return `${n} contribution${n === 1 ? "" : "s"} on ${when}`;
}

// The API hands out levels, not thresholds — so read the real count range
// each shade covers straight off the year's data.
function levelRanges(days) {
  const ranges = {};
  for (const day of days) {
    const level = Number(day.level);
    const count = Number(day.count);
    const seen = ranges[level];
    if (!seen) ranges[level] = { min: count, max: count };
    else {
      if (count < seen.min) seen.min = count;
      if (count > seen.max) seen.max = count;
    }
  }
  return ranges;
}

// "4–7 contributions" — what a legend swatch stands for.
function swatchText(range) {
  if (!range) return "No days at this level";
  if (range.max === 0) return "No contributions";
  if (range.min === range.max) {
    return `${range.min} contribution${range.min === 1 ? "" : "s"}`;
  }
  return `${range.min}–${range.max} contributions`;
}

export default function GithubContributions() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [runId, setRunId] = useState(0);
  const [tip, setTip] = useState(null);
  const [focus, setFocus] = useState(null);
  const play = useClickSound();

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

  // The trimmed window is what the graph shows, so the headline counts
  // what is actually on screen.
  const days = data ? trimToWholeMonths(data.contributions) : [];
  const groups = toMonthGroups(days);
  const ranges = levelRanges(days);
  const total = days.reduce((sum, d) => sum + Number(d.count || 0), 0);

  return (
    <motion.section
      className="ghc"
      aria-label="GitHub contributions"
      {...fadeUp()}
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
          <a className="ghc__link" href={githubUrl} target="_blank" rel="noreferrer" onClick={() => play("tap")}>
            View on GitHub ↗
          </a>
        </p>
      )}

      {!error && !data && <div className="ghc__skeleton" aria-hidden="true" />}

      {!error && data && (
        <motion.a
          className="ghc__scroll"
          // With syncTouch on, Lenis preventDefaults the touchmove and would
          // swallow the sideways drag on this strip. Horizontal-only opt-out:
          // the graph still scrolls natively under a finger, while a vertical
          // drag over it keeps scrolling the page.
          data-lenis-prevent-horizontal
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${total.toLocaleString()} contributions in the last year — open ${USERNAME} on GitHub`}
          onClick={() => play("tap")}
          onViewportEnter={() => setRunId((n) => n + 1)}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        >
          <div
            key={runId}
            className="ghc__chart"
            role="img"
            aria-label={`${total} contributions`}
            data-focus={focus === null ? undefined : focus}
            onPointerMove={handlePointer}
            onPointerLeave={() => setTip(null)}
          >
            {groups.map((group) => (
              <div className="ghc__group" key={group.name}>
                <div className="ghc__weeks">
                  {group.weeks.map(({ week, col }) =>
                    week.map((day, d) => (
                      <span
                        key={`${col}-${d}`}
                        className="ghc__cell"
                        style={{ "--i": col * 7 + d }}
                        data-level={day ? day.level : "empty"}
                        data-date={day ? day.date : undefined}
                        data-count={day ? day.count : undefined}
                      />
                    ))
                  )}
                </div>
                <span className="ghc__month">{group.name}</span>
              </div>
            ))}
          </div>
        </motion.a>
      )}

      {!error && data && (
        <div
          className="ghc__legend"
          aria-hidden="true"
          onPointerLeave={() => {
            setFocus(null);
            setTip(null);
          }}
        >
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className="ghc__cell ghc__swatch"
              data-level={l}
              onPointerEnter={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setFocus(l);
                setTip({
                  text: swatchText(ranges[l]),
                  x: r.left + r.width / 2,
                  y: r.top,
                });
              }}
            />
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
