"use client";

import { useState } from "react";

type Datum = { label: string; value: number };

const SIZE = 160;
const R_OUTER = 76;
const R_INNER = 48;
const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

/** Secteur annulaire entre deux angles (radians, 0 = midi). */
function arcPath(startAngle: number, endAngle: number) {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  // Cap léger : un cercle complet (2π) ne se dessine pas en un seul arc SVG.
  const end = Math.min(endAngle, startAngle + Math.PI * 2 - 0.001);
  const large = end - startAngle > Math.PI ? 1 : 0;
  const pt = (r: number, a: number) => {
    const angle = a - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  };
  return [
    `M${pt(R_OUTER, startAngle)}`,
    `A${R_OUTER},${R_OUTER} 0 ${large} 1 ${pt(R_OUTER, end)}`,
    `L${pt(R_INNER, end)}`,
    `A${R_INNER},${R_INNER} 0 ${large} 0 ${pt(R_INNER, startAngle)}`,
    "Z",
  ].join(" ");
}

/**
 * Donut (3 parts max) : gap de surface de 2 px entre tranches, légende
 * permanente, centre qui affiche le total — ou la tranche survolée/focalisée.
 */
export default function DonutChart({
  data,
  centerLabel,
  centerValue,
  formatValue,
  title,
}: {
  data: Datum[];
  centerLabel: string;
  centerValue: string;
  formatValue: (value: number) => string;
  title: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const slices = data.filter((d) => d.value > 0);

  const paths = slices.map((d, i) => {
    const before = slices.slice(0, i).reduce((sum, s) => sum + s.value, 0);
    const start = total > 0 ? (before / total) * Math.PI * 2 : 0;
    const sweep = total > 0 ? (d.value / total) * Math.PI * 2 : 0;
    return { d, index: data.indexOf(d), path: arcPath(start, start + sweep) };
  });

  const active = hovered !== null ? data[hovered] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={title}
          className="h-40 w-40"
        >
          {paths.map(({ d, index, path }) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
            return (
              <path
                key={d.label}
                d={path}
                fill={COLORS[index % COLORS.length]}
                stroke="var(--surface-raised)"
                strokeWidth={2}
                opacity={hovered === null || hovered === index ? 1 : 0.55}
                className="transition-opacity"
                tabIndex={0}
                aria-label={`${d.label} : ${formatValue(d.value)} (${pct} %)`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                style={{ outline: "none" }}
              />
            );
          })}
        </svg>
        <div
          role="status"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <span className="font-display text-lg font-semibold leading-tight">
            {active ? formatValue(active.value) : centerValue}
          </span>
          <span className="text-[10px] text-muted">
            {active ? active.label : centerLabel}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-1.5 text-xs">
        {data.map((d, i) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <li key={d.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ background: COLORS[i % COLORS.length] }}
                aria-hidden
              />
              <span className="flex-1 text-foreground">{d.label}</span>
              <span className="text-muted">{pct} %</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
