"use client";

import { useState } from "react";

type Datum = { label: string; value: number };

const W = 480;
const H = 210;
const PAD = { top: 20, right: 8, bottom: 28, left: 44 };

/** Barre à sommet arrondi uniquement (4 px), carrée à la ligne de base. */
function barPath(x: number, y: number, w: number, h: number, r = 4) {
  const radius = Math.min(r, h);
  return [
    `M${x},${y + h}`,
    `V${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `H${x + w - radius}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `V${y + h}`,
    "Z",
  ].join(" ");
}

/** Arrondit le max à un pas « propre » pour des graduations lisibles. */
function niceMax(max: number, steps: number) {
  const rawStep = max / steps;
  const pow = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * pow >= rawStep)! * pow;
  return step * steps;
}

const tickFmt = (v: number) =>
  v >= 1000 ? `${(v / 1000).toLocaleString("fr-FR")} k€` : `${v} €`;

/**
 * Histogramme SVG mono-série : teinte unique (slot 1), graduations propres,
 * grille en filet plein, label direct sélectif sur le dernier mois (le mois
 * vivant), survol et focus clavier par colonne avec infobulle.
 */
export default function BarChart({
  data,
  formatValue,
  title,
}: {
  data: Datum[];
  formatValue: (value: number) => string;
  title: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const TICKS = 4;
  const max = niceMax(Math.max(...data.map((d) => d.value), 1), TICKS);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / data.length;
  const barW = Math.min(24, slot * 0.55);
  const last = data.length - 1;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={title}
        className="w-full"
      >
        {Array.from({ length: TICKS + 1 }, (_, t) => {
          const y = PAD.top + innerH * (1 - t / TICKS);
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                stroke="var(--chart-grid)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize={10}
                fill="var(--chart-ink)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {tickFmt((max * t) / TICKS)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.value / max) * innerH;
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const y = PAD.top + innerH - h;
          return (
            <g key={d.label}>
              {/* Cible de survol/focus pleine colonne, plus large que la barre */}
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                aria-label={`${d.label} : ${formatValue(d.value)}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                style={{ outline: "none" }}
              />
              <path
                d={barPath(x, y, barW, h)}
                fill="var(--chart-1)"
                opacity={hovered === null || hovered === i ? 1 : 0.45}
                className="transition-opacity"
                pointerEvents="none"
              />
              {/* Label direct sélectif : uniquement le mois vivant */}
              {i === last && hovered === null && (
                <text
                  x={PAD.left + slot * i + slot / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--foreground)"
                >
                  {formatValue(d.value)}
                </text>
              )}
              <text
                x={PAD.left + slot * i + slot / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={11}
                fill="var(--chart-ink)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {hovered !== null && (
        <div
          role="status"
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-field border border-line bg-surface-raised px-2.5 py-1 text-xs shadow-overlay"
          style={{
            left: `${(((hovered + 0.5) * (innerW / data.length) + PAD.left) / W) * 100}%`,
          }}
        >
          <span className="font-semibold">{formatValue(data[hovered].value)}</span>{" "}
          <span className="text-muted">{data[hovered].label}</span>
        </div>
      )}
    </div>
  );
}
