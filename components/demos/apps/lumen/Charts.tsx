"use client";

import { useState } from "react";
import { formatFcfa, formatFcfaCompact } from "./data";

type Datum = { label: string; value: number };

/* Palette data-viz de l'app : cuivre pour le vivant, sable pour le passé,
   olive et or pour les catégories — jamais les tokens Core. */
const DONUT_COLORS = ["var(--lumen-copper)", "var(--lumen-olive)", "var(--lumen-gold)"];

const W = 480;
const H = 210;
const PAD = { top: 24, right: 8, bottom: 28, left: 48 };

/** Barre-bâtonnet entièrement arrondie (style éditorial, pas histogramme plein). */
function barPath(x: number, y: number, w: number, h: number) {
  const r = w / 2;
  if (h <= r) return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
  return [
    `M${x},${y + h}`,
    `V${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `H${x + w - r}`,
    `Q${x + w},${y} ${x + w},${y + r}`,
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

/**
 * Histogramme SVG mono-série : bâtonnets fins arrondis, mois passés en sable,
 * mois vivant en cuivre, ligne d'objectif en pointillés, survol et focus
 * clavier par colonne avec infobulle.
 */
export function RevenueBars({ data, target }: { data: Datum[]; target?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const TICKS = 4;
  const max = niceMax(Math.max(...data.map((d) => d.value), target ?? 0, 1), TICKS);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / data.length;
  const barW = Math.min(18, slot * 0.36);
  const last = data.length - 1;
  const targetY = target ? PAD.top + innerH * (1 - target / max) : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Chiffre d'affaires mensuel, de janvier à juin"
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
                stroke={t === 0 ? "var(--lumen-line)" : "var(--lumen-grid)"}
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize={10}
                fill="var(--lumen-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {t === 0 ? "0" : formatFcfaCompact((max * t) / TICKS)}
              </text>
            </g>
          );
        })}
        {/* Ligne d'objectif : le cap du mois, en pointillés olive. */}
        {targetY !== null && target && (
          <g>
            <line x1={PAD.left} x2={W - PAD.right} y1={targetY} y2={targetY} stroke="var(--lumen-olive)" strokeWidth={1} strokeDasharray="4 4" opacity={0.8} />
            {/* Label à gauche : la barre vivante et son étiquette occupent la droite. */}
            <text x={PAD.left + 2} y={targetY - 5} textAnchor="start" fontSize={9.5} fontWeight={700} fill="var(--lumen-olive)" style={{ fontVariantNumeric: "tabular-nums" }}>
              objectif {formatFcfaCompact(target)}
            </text>
          </g>
        )}
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
                aria-label={`${d.label} : ${formatFcfa(d.value)}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                style={{ outline: "none" }}
              />
              <path
                d={barPath(x, y, barW, h)}
                fill={i === last ? "var(--lumen-copper)" : "var(--lumen-sand)"}
                opacity={hovered === null || hovered === i ? 1 : 0.45}
                className="transition-opacity"
                pointerEvents="none"
              />
              {/* Label direct sélectif : uniquement le mois vivant, en serif display */}
              {i === last && hovered === null && (
                <text
                  x={PAD.left + slot * i + slot / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize={12.5}
                  fontWeight={600}
                  fill="var(--lumen-copper-deep)"
                  style={{ fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-lumen-display)" }}
                >
                  {`${formatFcfaCompact(d.value)} FCFA`}
                </text>
              )}
              <text
                x={PAD.left + slot * i + slot / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={11}
                fill={i === last ? "var(--lumen-ink)" : "var(--lumen-muted)"}
                fontWeight={i === last ? 700 : 400}
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
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--lumen-line)] bg-[var(--lumen-panel)] px-2.5 py-1 text-xs text-[var(--lumen-ink)] shadow-[0_8px_20px_-8px_rgba(38,33,25,0.25)]"
          style={{
            left: `${(((hovered + 0.5) * (innerW / data.length) + PAD.left) / W) * 100}%`,
          }}
        >
          <span className="font-bold tabular-nums">{formatFcfa(data[hovered].value)}</span>{" "}
          <span className="text-[var(--lumen-muted)]">{data[hovered].label}</span>
        </div>
      )}
    </div>
  );
}

const SIZE = 160;
const R_OUTER = 76;
const R_INNER = 52;

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
 * Donut SVG (3 parts max) : gap de 2 px entre tranches, centre en fonte
 * display qui affiche le total — ou la tranche survolée/focalisée — et
 * légende chiffrée à droite.
 */
export function CategoryDonut({ data }: { data: Datum[] }) {
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
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Répartition du chiffre d'affaires de juin par catégorie"
          className="size-32 @xl:size-36"
        >
          {paths.map(({ d, index, path }) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
            return (
              <path
                key={d.label}
                d={path}
                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                stroke="var(--lumen-panel)"
                strokeWidth={2.5}
                opacity={hovered === null || hovered === index ? 1 : 0.5}
                className="transition-opacity"
                tabIndex={0}
                aria-label={`${d.label} : ${formatFcfa(d.value)} (${pct} %)`}
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
          <span className="font-[family-name:var(--font-lumen-display)] text-xl font-semibold leading-tight tabular-nums">
            {formatFcfaCompact(active ? active.value : total)}
          </span>
          <span className="max-w-20 truncate text-[10px] text-[var(--lumen-muted)]">
            {active ? active.label : "FCFA en juin"}
          </span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2.5 text-xs">
        {data.map((d, i) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <li key={d.label} className="flex items-baseline gap-2">
              <span
                className="size-2.5 shrink-0 translate-y-px rounded-full"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-[var(--lumen-muted)]">
                {d.label}
              </span>
              <span className="font-bold tabular-nums text-[var(--lumen-ink)]">
                {formatFcfaCompact(d.value)}
              </span>
              <span className="w-9 text-right tabular-nums text-[var(--lumen-muted)]">
                {pct} %
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
