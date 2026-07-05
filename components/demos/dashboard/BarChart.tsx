"use client";

import { useState } from "react";

type Datum = { label: string; value: number };

const W = 480;
const H = 200;
const PAD = { top: 16, right: 8, bottom: 28, left: 8 };

/** Barre à sommet arrondi uniquement (rayon 4 px). */
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

/** Histogramme SVG maison — couleurs par tokens, donc thémable. */
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

  const max = Math.max(...data.map((d) => d.value), 1);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / data.length;
  const barW = Math.min(24, slot * 0.55);
  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={title}
        className="w-full"
      >
        {gridLines.map((g) => {
          const y = PAD.top + innerH * (1 - g);
          return (
            <line
              key={g}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y}
              y2={y}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
          );
        })}
        {data.map((d, i) => {
          const h = (d.value / max) * innerH;
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const y = PAD.top + innerH - h;
          return (
            <g key={d.label}>
              {/* Zone de survol pleine hauteur, plus confortable que la barre seule */}
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <path
                d={barPath(x, y, barW, h)}
                fill="var(--chart-1)"
                opacity={hovered === null || hovered === i ? 1 : 0.45}
                className="transition-opacity"
                pointerEvents="none"
              />
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
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface-raised px-2.5 py-1 text-xs shadow-md"
          style={{
            left: `${(((hovered + 0.5) * (innerW / data.length) + PAD.left) / W) * 100}%`,
          }}
        >
          <span className="font-medium">{data[hovered].label}</span>{" "}
          <span className="text-muted">{formatValue(data[hovered].value)}</span>
        </div>
      )}
    </div>
  );
}
