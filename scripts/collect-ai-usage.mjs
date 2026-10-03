// Collect local AI token usage from Claude Code + Codex CLI logs.
// Reads: ~/.claude/projects/**/*.jsonl, ~/.codex/sessions/**/**/rollout-*.jsonl
// Writes: src/data/ai-usage.json (aggregates only, no prompts)
// Run: node scripts/collect-ai-usage.mjs
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "src", "data", "ai-usage.json");

// $ per 1M tokens: [input, output]. Cache read ~10% input, cache write ~125% input.
const PRICING = [
  [/haiku/i, [1, 5]],
  [/sonnet/i, [3, 15]],
  [/opus/i, [15, 75]],
  [/minimax|mimo|deepseek|qwen|.*-free/i, [0, 0]],
  [/gpt-5/i, [1.25, 10]],
  [/gpt/i, [2, 8]],
];
const DEFAULT_PRICE = [2, 8];

function priceFor(model) {
  for (const [re, p] of PRICING) if (re.test(model)) return p;
  return DEFAULT_PRICE;
}

function walk(dir, out = []) {
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      try {
        if (e.isDirectory()) walk(p, out);
        else if (e.name.endsWith(".jsonl")) out.push(p);
      } catch { /* skip */ }
    }
  } catch { /* missing dir */ }
  return out;
}

function dayKey(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d)) return null;
  return d.toISOString().slice(0, 10);
}

// provider -> date -> model -> {input, output, cacheRead, cacheWrite}
const agg = new Map();
function add(provider, ts, model, u) {
  const day = dayKey(ts);
  if (!day || !u) return;
  if (!agg.has(provider)) agg.set(provider, new Map());
  const byDay = agg.get(provider);
  if (!byDay.has(day)) byDay.set(day, new Map());
  const byModel = byDay.get(day);
  const m = (model || "unknown").toLowerCase().replace(/\s+/g, "-");
  if (!byModel.has(m)) byModel.set(m, { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
  const r = byModel.get(m);
  r.input += u.input || 0;
  r.output += u.output || 0;
  r.cacheRead += u.cacheRead || 0;
  r.cacheWrite += u.cacheWrite || 0;
}

function parseClaude(files) {
  let msgs = 0;
  for (const f of files) {
    let txt;
    try { txt = fs.readFileSync(f, "utf8"); } catch { continue; }
    const lines = txt.split("\n");
    for (const ln of lines) {
      if (!ln.includes('"usage"')) continue;
      try {
        const j = JSON.parse(ln);
        const u = j.message?.usage;
        if (!u || j.type !== "assistant") continue;
        msgs++;
        add("claude", j.timestamp, j.message.model, {
          input: u.input_tokens || 0,
          output: u.output_tokens || 0,
          cacheRead: u.cache_read_input_tokens || 0,
          cacheWrite: u.cache_creation_input_tokens || 0,
        });
      } catch { /* partial line */ }
    }
  }
  return msgs;
}

function parseCodex(files) {
  let events = 0, withModel = 0;
  for (const f of files) {
    let txt;
    try { txt = fs.readFileSync(f, "utf8"); } catch { continue; }
    // model usually in a turn_context line; reuse last seen for following token events
    let model = "gpt-5-codex";
    for (const ln of txt.split("\n")) {
      if (!ln) continue;
      let j;
      try { j = JSON.parse(ln); } catch { continue; }
      if (j.type === "turn_context" && j.payload?.model) {
        model = String(j.payload.model);
        withModel++;
      }
      if (j.type === "event_msg" && j.payload?.type === "token_count") {
        const u = j.payload.info?.last_token_usage;
        if (!u) continue;
        events++;
        add("codex", j.timestamp, model, {
          input: u.input_tokens || 0,
          output: (u.output_tokens || 0) + (u.reasoning_output_tokens || 0),
          cacheRead: u.cached_input_tokens || 0,
          cacheWrite: u.cache_write_input_tokens || 0,
        });
      }
    }
  }
  return { events, withModel };
}

const home = os.homedir();
const claudeFiles = walk(path.join(home, ".claude", "projects"));
const codexFiles = walk(path.join(home, ".codex", "sessions")).filter((f) =>
  path.basename(f).startsWith("rollout-")
);

const claudeMsgs = parseClaude(claudeFiles);
const { events: codexEvents } = parseCodex(codexFiles);

// Flatten to daily + byModel with cost
const dailyMap = new Map(); // day -> {tokens, cost, input, output}
const modelMap = new Map(); // model -> {tokens, cost, input, output}
let totalInput = 0, totalOutput = 0;

for (const [, byDay] of agg) {
  for (const [day, byModel] of byDay) {
    if (!dailyMap.has(day)) dailyMap.set(day, { date: day, tokens: 0, cost: 0, input: 0, output: 0 });
    const d = dailyMap.get(day);
    for (const [model, r] of byModel) {
      const [pi, po] = priceFor(model);
      // cache read billed ~10% of input price, cache write ~125%
      const cost =
        ((r.input * pi + r.output * po + r.cacheRead * pi * 0.1 + r.cacheWrite * pi * 1.25) / 1e6);
      const tokens = r.input + r.output + r.cacheRead + r.cacheWrite;
      d.tokens += tokens; d.cost += cost; d.input += r.input; d.output += r.output;
      totalInput += r.input; totalOutput += r.output;
      if (!modelMap.has(model)) modelMap.set(model, { model, tokens: 0, cost: 0, input: 0, output: 0 });
      const m = modelMap.get(model);
      m.tokens += tokens; m.cost += cost; m.input += r.input; m.output += r.output;
    }
  }
}

const daily = [...dailyMap.values()].sort((a, b) => a.date.localeCompare(b.date));
const byModel = [...modelMap.values()].sort((a, b) => b.tokens - a.tokens);
const totalTokens = daily.reduce((s, d) => s + d.tokens, 0);
const totalCost = daily.reduce((s, d) => s + d.cost, 0);
const activeDays = daily.filter((d) => d.tokens > 0).length;
const biggest = daily.reduce((b, d) => (d.cost > (b?.cost ?? -1) ? d : b), null);
const favorite = byModel[0]?.model ?? null;

const payload = {
  generatedAt: new Date().toISOString(),
  sources: { claudeMsgs, codexEvents, claudeFiles: claudeFiles.length, codexFiles: codexFiles.length },
  range: daily.length ? { from: daily[0].date, to: daily[daily.length - 1].date } : null,
  totals: { totalTokens, inputTokens: totalInput, outputTokens: totalOutput, totalCost, activeDays, biggestDay: biggest, favoriteModel: favorite },
  daily,
  byModel,
  pricingNote: "Estimated cost from per-model $/1M table in scripts/collect-ai-usage.mjs. Free-tier models priced $0.",
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
// CI machines (Vercel) have no local CLI logs — keep committed snapshot.
if (!daily.length && fs.existsSync(OUT)) {
  console.log("no local logs found, kept existing src/data/ai-usage.json");
  process.exit(0);
}
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
console.log(`wrote ${OUT}: ${daily.length} days, ${(totalTokens / 1e9).toFixed(2)}B tokens, $${totalCost.toFixed(2)} est.`);
