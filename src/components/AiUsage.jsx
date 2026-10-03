import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./motion/motion-presets";
import data from "../data/ai-usage.json";
import "./AiUsage.css";

function fmtTokens(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

function fmtMoney(n) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDay(iso) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

function fmtRange(from, to) {
  const a = new Date(from + "T00:00:00Z");
  const b = new Date(to + "T00:00:00Z");
  const opts = { day: "2-digit", month: "short", timeZone: "UTC" };
  const sameYear = a.getUTCFullYear() === b.getUTCFullYear();
  const left = a.toLocaleDateString("en-GB", opts);
  const right = b.toLocaleDateString("en-GB", { ...opts, year: "numeric" });
  return sameYear ? `${left} – ${right}` : `${left} ${a.getUTCFullYear()} – ${right}`;
}

// Provider glyph: monochrome, no extra deps.
function glyph(model) {
  if (/claude/i.test(model)) return "A";
  if (/gpt|codex|openai/i.test(model)) return "◉";
  if (/mimo/i.test(model)) return "▣";
  if (/minimax/i.test(model)) return "≋";
  if (/deepseek/i.test(model)) return "◈";
  if (/qwen/i.test(model)) return "〜";
  return "○";
}

function pathFor(values, w, h, pad) {
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  return values
    .map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function AiUsage() {
  const [hover, setHover] = useState(null);
  const { totals, daily, byModel, range } = data;

  const chart = useMemo(() => {
    const tokens = daily.map((d) => d.tokens);
    const cost = daily.map((d) => d.cost);
    const W = 640, H = 220, PAD = 8;
    return {
      W, H,
      tokensPath: pathFor(tokens, W, H, PAD),
      costPath: pathFor(cost, W, H, PAD),
      areaPath: `${pathFor(tokens, W, H, PAD)} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`,
    };
  }, [daily]);

  if (!daily.length) return null;

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const i = Math.round(x * (daily.length - 1));
    setHover(Math.max(0, Math.min(daily.length - 1, i)));
  };

  const stats = [
    { label: "Total Tokens", value: fmtTokens(totals.totalTokens) },
    { label: "Input Tokens", value: fmtTokens(totals.inputTokens) },
    { label: "Output Tokens", value: fmtTokens(totals.outputTokens) },
    { label: "Total Cost", value: fmtMoney(totals.totalCost) },
    { label: "Active Days", value: `${totals.activeDays}` },
    {
      label: "Biggest Day",
      value: totals.biggestDay ? fmtMoney(totals.biggestDay.cost) : "—",
      sub: totals.biggestDay ? fmtDay(totals.biggestDay.date) : null,
    },
  ];

  return (
    <motion.section className="aiu" aria-label="AI token usage" {...fadeUp()}>
      <div className="aiu__head">
        <span className="label aiu__fav">
          Favorite model <strong>{totals.favoriteModel}</strong>
        </span>
        {range && <span className="label aiu__range">{fmtRange(range.from, range.to)}</span>}
      </div>

      <div className="aiu__stats">
        {stats.map((s) => (
          <div key={s.label} className="aiu__card">
            <span className="aiu__card-label">{s.label}</span>
            <span className="aiu__card-value">{s.value}</span>
            {s.sub && <span className="aiu__card-sub">{s.sub}</span>}
          </div>
        ))}
      </div>

      <div className="aiu__chart" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${chart.W} ${chart.H}`} role="img" aria-label="Tokens and cost per day">
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line
              key={f}
              x1="0" x2={chart.W}
              y1={chart.H * f} y2={chart.H * f}
              className="aiu__grid"
              strokeDasharray="3 5"
            />
          ))}
          <path d={chart.areaPath} className="aiu__area" />
          <path d={chart.costPath} className="aiu__line aiu__line--cost" />
          <path d={chart.tokensPath} className="aiu__line aiu__line--tokens" />
          {hover !== null && (
            <line
              x1={(hover / Math.max(daily.length - 1, 1)) * (chart.W - 16) + 8}
              x2={(hover / Math.max(daily.length - 1, 1)) * (chart.W - 16) + 8}
              y1="0" y2={chart.H}
              className="aiu__cursor"
            />
          )}
        </svg>
        <div className="aiu__legend">
          <span><i className="aiu__dot aiu__dot--tokens" />Tokens</span>
          <span><i className="aiu__dot aiu__dot--cost" />Cost</span>
          {hover !== null && (
            <span className="aiu__hover">
              {fmtDay(daily[hover].date)} · {fmtTokens(daily[hover].tokens)} · {fmtMoney(daily[hover].cost)}
            </span>
          )}
        </div>
      </div>

      <div className="aiu__table" role="table" aria-label="Usage by model">
        <div className="aiu__row aiu__row--head" role="row">
          <span role="columnheader">Model</span>
          <span role="columnheader">Tokens</span>
          <span role="columnheader">Cost</span>
        </div>
        {byModel.map((m) => (
          <div key={m.model} className="aiu__row" role="row">
            <span className="aiu__model" role="cell">
              <span className="aiu__glyph" aria-hidden="true">{glyph(m.model)}</span>
              {m.model}
            </span>
            <span role="cell">{fmtTokens(m.tokens)}</span>
            <span role="cell">{fmtMoney(m.cost)}</span>
          </div>
        ))}
      </div>

      <p className="aiu__foot">
        Local Claude Code + Codex CLI logs only. Cost estimated. Refresh:{" "}
        {new Date(data.generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
      </p>
    </motion.section>
  );
}
