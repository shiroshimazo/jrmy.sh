import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCalendar, describeDay, fitCalendar } from "./activity-grid-data.js";

test("fits recent weeks and recalculates visible totals and streaks", () => {
  const calendar = buildCalendar([
    { date: "2025-11-24", count: 9, level: 4 },
    { date: "2026-11-16", count: 2 },
    { date: "2026-11-21", count: 3 },
    { date: "2026-11-22", count: 5 },
    { date: "2026-11-30", count: 5 },
    { date: "2026-02-30", count: 5 },
  ], new Date(2026, 10, 23, 1));

  const desktop = fitCalendar(calendar, 620);
  const mobile = fitCalendar(calendar, 80);
  assert.equal(desktop.days, 365);
  assert.equal(desktop.weeks, 53);
  assert.equal(desktop.total, 19);
  assert.equal(mobile.weeks, 8);
  assert.equal(mobile.total, 10);
  assert.ok(desktop.cell > mobile.cell);
  assert.equal(mobile.current, 2);
  assert.equal(mobile.longest, 2);
  assert.equal(mobile.change, 6);
  assert.equal(describeDay(mobile.rows[1].at(-1), "contribution"), "0 contributions on Nov 23, 2026");
  assert.equal(mobile.rows[1].at(-1).column, 7);
  assert.equal(mobile.rows[6].at(-1).column, 6);
});
