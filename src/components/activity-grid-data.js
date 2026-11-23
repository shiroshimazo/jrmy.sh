const DAY = 86_400_000;
const YEAR_DAYS = 365;
const CELL_GAP = 3;
const MIN_CELL = 7;
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

function weekday(day) {
  return new Date(day * DAY).getUTCDay();
}

export function describeDay(day, unit) {
  const label = day.count === 1 ? unit : `${unit}s`;
  return `${day.count.toLocaleString()} ${label} on ${dateFormat.format(day.index * DAY)}`;
}

export function buildCalendar(data, now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY;
  const first = today - YEAR_DAYS + 1;
  const firstSunday = first - weekday(first);
  const entries = new Map();

  for (const entry of data) {
    if (typeof entry?.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) continue;
    const index = Date.parse(entry.date) / DAY;
    if (!(index >= first && index <= today)) continue;
    if (new Date(index * DAY).toISOString().slice(0, 10) !== entry.date) continue;
    if (!Number.isSafeInteger(entry.count) || entry.count < 0) continue;
    entries.set(index, entry);
  }

  const peak = Math.max(1, ...Array.from(entries.values(), ({ count }) => count));
  const days = Array.from({ length: YEAR_DAYS }, (_, offset) => {
    const index = first + offset;
    const { count = 0, level } = entries.get(index) ?? {};
    const column = Math.floor((index - firstSunday) / 7);
    return {
      index,
      column,
      row: (index - firstSunday) % 7,
      month: monthFormat.format(index * DAY),
      count,
      level: count === 0 ? 0 : Number.isInteger(level) && level >= 1 && level <= 4
        ? level
        : Math.ceil(4 * (count / peak)),
    };
  });

  return { days, today, weeks: days.at(-1).column + 1 };
}

export function fitCalendar(calendar, width) {
  const weeks = Math.min(calendar.weeks, Math.max(1, Math.floor((width + CELL_GAP) / (MIN_CELL + CELL_GAP))));
  const cell = Math.max(MIN_CELL, (width + CELL_GAP) / weeks - CELL_GAP);
  const firstColumn = calendar.weeks - weeks;
  const days = calendar.days.filter(({ column }) => column >= firstColumn);
  const rows = Array.from({ length: 7 }, () => []);
  const months = [];
  const ranges = [];
  let total = 0;
  let streak = 0;
  let longest = 0;
  let current = 0;

  for (const day of days) {
    const column = day.column - firstColumn;
    rows[day.row].push({ ...day, column });
    const range = ranges[day.level];
    ranges[day.level] = range
      ? [Math.min(range[0], day.count), Math.max(range[1], day.count)]
      : [day.count, day.count];
    if (months.at(-1)?.name !== day.month) {
      const labelColumn = Math.min(column, Math.max(0, weeks - Math.ceil(25 / (cell + CELL_GAP))));
      if (months.length && (labelColumn - months.at(-1).column) * (cell + CELL_GAP) < 25) {
        months.pop();
      }
      months.push({ name: day.month, column: labelColumn });
    }
    total += day.count;
    streak = day.count > 0 ? streak + 1 : 0;
    longest = Math.max(longest, streak);
    if (day.index === calendar.today - 1 || (day.index === calendar.today && day.count > 0)) {
      current = streak;
    }
  }

  const recent = calendar.days.slice(-7).reduce((sum, day) => sum + day.count, 0);
  const previous = calendar.days.slice(-14, -7).reduce((sum, day) => sum + day.count, 0);
  return {
    weeks, cell, rows, months, ranges, total, longest, current, firstColumn, days: days.length,
    first: days[0].index, change: recent - previous,
  };
}
