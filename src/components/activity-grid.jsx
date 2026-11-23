import { useId, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { FiActivity, FiBarChart2, FiTrendingUp } from "react-icons/fi";
import { buildCalendar, describeDay, fitCalendar } from "./activity-grid-data";
import "./activity-grid.css";

const formatNumber = new Intl.NumberFormat("en-US");
const levels = ["No activity", "Low activity", "Moderate activity", "High activity", "Most activity"];
const arrows = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };

function describeLevel(level, range, unit) {
  if (!range || level === 0) return levels[level];
  const [min, max] = range;
  const count = min === max ? formatNumber.format(min) : `${formatNumber.format(min)}–${formatNumber.format(max)}`;
  return `${levels[level]}, ${count} ${max === 1 ? unit : `${unit}s`}`;
}

function Count({ value, entered, reduced }) {
  const number = useMotionValue(0);
  const text = useTransform(number, (latest) => formatNumber.format(Math.round(latest)));
  const formatted = formatNumber.format(value);

  useEffect(() => {
    if (reduced || !entered) return;
    const animation = animate(number, value, { duration: 0.55, ease: "easeOut" });
    return () => animation.stop();
  }, [number, value, entered, reduced]);

  if (reduced) return formatted;
  return (
    <>
      <span className="visually-hidden">{formatted}</span>
      <motion.span aria-hidden="true">{text}</motion.span>
    </>
  );
}

export function ActivityGrid({ title, data, palette = "ink", unit = "session", children }) {
  const id = useId();
  const plot = useRef(null);
  const [width, setWidth] = useState(0);
  const [tabDay, setTabDay] = useState(null);
  const [focusedDay, setFocusedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [focusedLevel, setFocusedLevel] = useState(null);
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const reduced = useReducedMotion();
  const entered = useInView(plot, { once: true, amount: 0.2 });
  const calendar = useMemo(() => buildCalendar(data), [data]);
  const grid = useMemo(() => fitCalendar(calendar, width), [calendar, width]);
  const dayLabels = useMemo(() => calendar.days.map((day) => describeDay(day, unit)), [calendar, unit]);
  const selectedDay = hoveredDay ?? focusedDay;
  const selectedLevel = hoveredLevel ?? focusedLevel;
  const yearStart = calendar.days[0].index;
  const activeDay = selectedDay !== null && selectedDay >= grid.first
    ? calendar.days[selectedDay - yearStart]
    : null;
  const activeColumn = activeDay && activeDay.column - grid.firstColumn;
  const tabStop = tabDay >= grid.first ? tabDay : calendar.today;
  const stats = [
    { label: `${unit}s`, value: grid.total, icon: FiBarChart2 },
    { label: "Longest streak", value: grid.longest, icon: FiTrendingUp },
    { label: "Current streak", value: grid.current, icon: FiActivity },
  ];

  useLayoutEffect(() => {
    const element = plot.current;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    setWidth(element.clientWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function handleKey(event) {
    if (event.key === "Escape") {
      setHoveredDay(null);
      setFocusedDay(null);
      return;
    }
    const step = arrows[event.key];
    if (!step) return;
    const cell = event.target.closest("[data-day]");
    if (!cell) return;

    event.preventDefault();
    setHoveredDay(null);
    const row = Number(cell.dataset.row);
    if ((step === -1 && row === 0) || (step === 1 && row === 6)) return;
    const next = Number(cell.dataset.day) + step;
    event.currentTarget.querySelector(`[data-day="${next}"]`)?.focus({ preventScroll: true });
  }

  return (
    <section
      className="activity-grid"
      aria-labelledby={id}
      data-palette={palette}
      data-entered={entered || reduced ? "" : undefined}
      style={{ "--cell": `${grid.cell}px`, "--weeks": grid.weeks }}
    >
      <div className="activity-grid__heading">
        <h2 id={id}>{title}</h2>
        {children}
      </div>
      <div className="activity-grid__summary">
        <strong className="activity-grid__total">
          <Count value={grid.total} entered={entered} reduced={reduced} />
        </strong>
        <span className="activity-grid__chip activity-grid__chip--change" data-negative={grid.change < 0 ? "" : undefined}>
          {grid.change > 0 ? "+" : ""}{formatNumber.format(grid.change)} vs prior 7 days
        </span>
        <span className="activity-grid__chip">
          {grid.weeks === calendar.weeks ? "Last year" : `Last ${grid.days} days`}
        </span>
      </div>

      <div className="activity-grid__calendar">
        <div className="activity-grid__weekdays" aria-hidden="true">
          <span>Mon</span><span>Wed</span><span>Fri</span>
        </div>
        <div className="activity-grid__plot" ref={plot}>
          <div className="activity-grid__months" aria-hidden="true">
            {grid.months.map(({ name, column }) => (
              <span key={column} style={{ "--column": column }}>{name}</span>
            ))}
          </div>
          <p id={`${id}-keys`} className="visually-hidden">Use arrow keys to move between days.</p>
          <div
            className="activity-grid__days"
            role="grid"
            aria-label={`${title} calendar`}
            aria-describedby={`${id}-keys`}
            aria-rowcount={7}
            aria-colcount={grid.weeks}
            onKeyDown={handleKey}
            onPointerOver={(event) => {
              const cell = event.target.closest("[data-day]");
              if (event.pointerType !== "touch" && cell) setHoveredDay(Number(cell.dataset.day));
            }}
            onPointerLeave={() => setHoveredDay(null)}
            onBlur={() => setFocusedDay(null)}
          >
            {grid.rows.map((row, index) => (
              <div className="activity-grid__row" role="row" aria-rowindex={index + 1} key={index}>
                {row.map((day) => {
                  const dimmed = selectedLevel !== null
                    ? day.level !== selectedLevel
                    : activeDay && day.row !== activeDay.row && day.column !== activeColumn;

                  return (
                    <span
                      key={day.index}
                      className="activity-grid__cell"
                      role="gridcell"
                      aria-colindex={day.column + 1}
                      aria-current={day.index === calendar.today ? "date" : undefined}
                      aria-label={dayLabels[day.index - yearStart]}
                      data-day={day.index}
                      data-row={day.row}
                      data-level={day.level}
                      data-dimmed={dimmed ? "" : undefined}
                      style={{ gridColumn: day.column + 1, "--delay": `${(day.column + day.row) * 6}ms` }}
                      tabIndex={day.index === tabStop ? 0 : -1}
                      onFocus={() => {
                        setTabDay(day.index);
                        setFocusedDay(day.index);
                      }}
                      onClick={(event) => event.currentTarget.focus({ preventScroll: true })}
                    />
                  );
                })}
              </div>
            ))}
            {activeDay && selectedLevel === null && (
              <div
                className="activity-grid__tip"
                aria-hidden="true"
                style={{ "--column": activeColumn, "--row": activeDay.row }}
              >
                {dayLabels[activeDay.index - yearStart]}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="activity-grid__legend" role="group" aria-label="Activity levels">
        <span>Less</span>
        {levels.map((name, level) => {
          const label = describeLevel(level, grid.ranges[level], unit);
          return (
            <button
              type="button"
              key={name}
              className="activity-grid__step"
              aria-label={label}
              title={label}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setHoveredLevel(level);
              }}
              onPointerLeave={() => setHoveredLevel(null)}
              onFocus={() => setFocusedLevel(level)}
              onBlur={() => setFocusedLevel(null)}
              onClick={() => setFocusedLevel(level)}
            >
              <span className="activity-grid__cell" data-level={level} />
            </button>
          );
        })}
        <span>More</span>
      </div>

      <dl className="activity-grid__stats">
        {stats.map(({ label, value, icon: Icon }, index) => (
          <div key={label}>
            <span className="activity-grid__icon" aria-hidden="true" style={{ "--delay": `${index * 45}ms` }}>
              <Icon size={16} />
            </span>
            <dt>{label}</dt>
            <dd><Count value={value} entered={entered} reduced={reduced} /></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
