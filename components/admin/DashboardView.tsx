"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { DashboardRow, DashboardStats } from "@/lib/analytics/db";

type Props = {
  stats: DashboardStats | null;
  unavailable: boolean;
  geoIpConfigured: boolean;
  onLogout: () => Promise<void>;
};

type Dimension = "page" | "source" | "device" | "country";

const periodOptions: Array<7 | 30 | 90> = [7, 30, 90];
const numberFormatter = new Intl.NumberFormat("fr-FR");
const decimalFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});
const comparisonFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const updateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

function number(value: number): string {
  return numberFormatter.format(value);
}

function decimal(value: number): string {
  return decimalFormatter.format(value);
}

function dateLabel(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function updateLabel(value: number | undefined): string {
  if (!value) return "En attente";
  return updateFormatter.format(new Date(value));
}

function countryLabel(code: string): string {
  const normalized = code.toUpperCase();
  if (normalized === "UNKNOWN") return "Inconnu";
  if (!/^[A-Z]{2}$/.test(normalized)) return code || "Inconnu";
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" }).of(normalized) ?? normalized;
  } catch {
    return normalized;
  }
}

function pageLabel(value: string): string {
  if (value === "/") return "Accueil";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function dimensionLabel(value: string, dimension: Dimension): string {
  switch (dimension) {
    case "page":
      return pageLabel(value);
    case "source":
      return value.toLowerCase() === "direct" ? "Accès direct" : value || "Inconnu";
    case "device":
      return (
        {
          mobile: "Mobile",
          tablet: "Tablette",
          desktop: "Ordinateur",
          unknown: "Inconnu",
        }[value.toLowerCase()] ?? value
      );
    case "country":
      return countryLabel(value);
  }
}

function comparisonText(current: number, previous: number): string {
  if (current === previous) return "Stable vs période précédente";
  if (previous === 0) return current === 0 ? "Stable vs période précédente" : "Nouveau vs période précédente";

  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? "+" : "−";
  return `${sign}${comparisonFormatter.format(Math.abs(change))} % vs période précédente`;
}

function pagesPerVisit(pageviews: number, visits: number): number {
  return visits > 0 ? pageviews / visits : 0;
}

function chartLabelIndexes(length: number): number[] {
  if (length <= 1) return [0];
  const count = length <= 7 ? 3 : 5;
  return Array.from({ length: count }, (_, index) =>
    Math.round((index * (length - 1)) / (count - 1)),
  ).filter((index, position, indexes) => indexes.indexOf(index) === position);
}

function Chart({ stats }: { stats: DashboardStats }) {
  const chartId = useId();
  const titleId = `${chartId}-title`;
  const descriptionId = `${chartId}-description`;
  const chartFrameRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(720);
  const nonzeroRows = stats.trend.filter((row) => row.pageviews > 0 || row.visitors > 0);
  const hasData = nonzeroRows.length > 0;
  const isSparse = nonzeroRows.length === 1;
  const width = chartWidth;
  const height = chartWidth < 560 ? 220 : 260;
  const plotLeft = Math.min(42, Math.max(32, Math.round(width * 0.11)));
  const plotRight = width - 12;
  const plotTop = 24;
  const plotBottom = height - 40;
  const max = Math.max(1, ...stats.trend.flatMap((row) => [row.pageviews, row.visitors]));
  const tickValues = Array.from(new Set([max, Math.ceil(max / 2), 0]));
  const point = (value: number, index: number): { x: number; y: number } => {
    const x = stats.trend.length === 1
      ? (plotLeft + plotRight) / 2
      : plotLeft + (index / (stats.trend.length - 1)) * (plotRight - plotLeft);
    const y = plotBottom - (value / max) * (plotBottom - plotTop);
    return { x, y };
  };
  const points = stats.trend.map((row, index) => {
    const { x, y } = point(row.pageviews, index);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const visitorPoints = stats.trend.map((row, index) => {
    const { x, y } = point(row.visitors, index);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const labelIndexes = chartLabelIndexes(stats.trend.length);
  const selectedRow = activeIndex === null ? undefined : stats.trend[activeIndex];
  const selectedPoint = activeIndex === null ? undefined : point(selectedRow?.pageviews ?? 0, activeIndex);
  const tooltipPosition = selectedPoint
    ? Math.min(92, Math.max(8, ((selectedPoint.x - plotLeft) / (plotRight - plotLeft)) * 100))
    : 50;

  const setIndexFromPointer = (clientX: number, target: SVGRectElement) => {
    const bounds = target.getBoundingClientRect();
    if (bounds.width <= 0 || stats.trend.length === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - bounds.left) / bounds.width));
    setActiveIndex(Math.round(ratio * (stats.trend.length - 1)));
  };

  useEffect(() => {
    const element = chartFrameRef.current;
    if (!element) return;

    const updateWidth = () => {
      const measured = Math.round(element.getBoundingClientRect().width);
      if (measured > 0) setChartWidth((current) => (current === measured ? current : measured));
    };
    updateWidth();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasData, isSparse]);

  return (
    <div>
      {hasData && isSparse ? (
        <div
          role="img"
          aria-labelledby={titleId}
          className="flex min-h-[220px] items-center justify-center rounded-field border border-line bg-surface px-6 text-center"
        >
          <div>
            <p id={titleId} className="font-display text-lg font-semibold">Premières données collectées</p>
            <p className="mt-2 text-sm text-muted">
              Le premier signal date du {dateLabel(nonzeroRows[0]?.date ?? "")} : {number(nonzeroRows[0]?.pageviews ?? 0)} pages vues et {number(nonzeroRows[0]?.visitors ?? 0)} visiteur{(nonzeroRows[0]?.visitors ?? 0) > 1 ? "s" : ""}.
            </p>
            <p className="mt-1 text-xs text-muted">La tendance se dessinera après quelques jours de collecte.</p>
          </div>
        </div>
      ) : hasData ? (
        <div ref={chartFrameRef} className="relative min-h-[220px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-labelledby={`${titleId} ${descriptionId}`}
            preserveAspectRatio="xMidYMid meet"
            className="block h-[220px] w-full sm:h-[260px]"
          >
            <title id={titleId}>Pages vues et visiteurs par jour</title>
            <desc id={descriptionId}>
              Courbes des pages vues et visiteurs uniques sur les {stats.periodDays} derniers jours, du {dateLabel(stats.trend[0]?.date ?? "")} au {dateLabel(stats.trend.at(-1)?.date ?? "")}. Le tableau sous le graphique est une alternative accessible.
            </desc>
            {tickValues.map((value) => {
              const y = point(value, 0).y;
              return (
                <g key={value}>
                  <line x1={plotLeft} y1={y} x2={plotRight} y2={y} stroke="var(--chart-grid)" strokeWidth="1" />
                  <text x={plotLeft - 8} y={y + 4} textAnchor="end" fill="var(--chart-ink)" fontSize="11">
                    {number(value)}
                  </text>
                </g>
              );
            })}
            <polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={visitorPoints} fill="none" stroke="var(--chart-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" />
            {stats.trend.map((row, index) => {
              const pageviewPoint = point(row.pageviews, index);
              const visitorPoint = point(row.visitors, index);
              const selected = activeIndex === index;
              const hasPoint = row.pageviews > 0 || row.visitors > 0;
              return (
                <g key={row.date}>
                  {row.pageviews > 0 ? <circle cx={pageviewPoint.x} cy={pageviewPoint.y} r={selected ? 5 : 3.5} fill="var(--chart-1)" aria-hidden /> : null}
                  {row.visitors > 0 ? <circle cx={visitorPoint.x} cy={visitorPoint.y} r={selected ? 4 : 2.5} fill="var(--chart-2)" aria-hidden /> : null}
                  {labelIndexes.includes(index) ? (
                    <text x={pageviewPoint.x} y={height - 12} textAnchor="middle" fill="var(--chart-ink)" fontSize="11">
                      {dateLabel(row.date)}
                    </text>
                  ) : null}
                  {hasPoint ? (
                    <circle
                      cx={pageviewPoint.x}
                      cy={pageviewPoint.y}
                      r="12"
                      fill="transparent"
                      tabIndex={0}
                      aria-label={`${dateLabel(row.date)} : ${number(row.pageviews)} pages vues, ${number(row.visitors)} visiteurs`}
                      onFocus={() => setActiveIndex(index)}
                      onBlur={() => setActiveIndex(null)}
                    />
                  ) : null}
                </g>
              );
            })}
            <rect
              x={plotLeft}
              y={plotTop}
              width={plotRight - plotLeft}
              height={plotBottom - plotTop}
              fill="transparent"
              aria-hidden
              onPointerMove={(event) => setIndexFromPointer(event.clientX, event.currentTarget)}
              onPointerDown={(event) => setIndexFromPointer(event.clientX, event.currentTarget)}
              onPointerUp={(event) => {
                if (event.pointerType === "touch") setIndexFromPointer(event.clientX, event.currentTarget);
              }}
              onClick={(event) => setIndexFromPointer(event.clientX, event.currentTarget)}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse" || event.pointerType === "pen") setActiveIndex(null);
              }}
              onPointerCancel={(event) => {
                if (event.pointerType === "mouse" || event.pointerType === "pen") setActiveIndex(null);
              }}
            />
          </svg>
          {selectedRow && selectedPoint ? (
            <div
              className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-field border border-line bg-surface-raised px-3 py-2 text-xs shadow-card"
              style={{ left: `${tooltipPosition}%` }}
              role="status"
            >
              <p className="font-semibold">{dateLabel(selectedRow.date)}</p>
              <p className="mt-1 text-muted">{number(selectedRow.pageviews)} pages · {number(selectedRow.visitors)} visiteurs</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          role="img"
          aria-labelledby={titleId}
          className="flex min-h-[220px] items-center justify-center rounded-field border border-dashed border-line bg-surface px-6 text-center"
        >
          <div>
            <p id={titleId} className="font-medium">Aucune page vue sur cette période.</p>
            <p className="mt-1 text-sm text-muted">La tendance apparaîtra après les premiers événements consentis.</p>
          </div>
        </div>
      )}
      {hasData && !isSparse ? (
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted" aria-label="Légende du graphique">
          <span className="inline-flex shrink-0 items-center gap-2"><span className="size-2 rounded-full bg-chart-1" aria-hidden /> Pages vues</span>
          <span className="inline-flex shrink-0 items-center gap-2"><span className="size-2 rounded-full bg-chart-2" aria-hidden /> Visiteurs uniques</span>
        </div>
      ) : null}
      <details className="mt-4 rounded-field border border-line p-3">
        <summary className="cursor-pointer text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Voir les données du graphique</summary>
        <div className="mt-3 max-w-full overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-2 py-2 font-medium">Jour</th>
                <th className="px-2 py-2 font-medium">Visiteurs</th>
                <th className="px-2 py-2 font-medium">Pages vues</th>
              </tr>
            </thead>
            <tbody>
              {stats.trend.length > 0 ? stats.trend.map((row) => (
                <tr key={row.date} className="border-b border-line last:border-0">
                  <td className="whitespace-nowrap px-2 py-2">{dateLabel(row.date)}</td>
                  <td className="px-2 py-2">{number(row.visitors)}</td>
                  <td className="px-2 py-2">{number(row.pageviews)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-2 py-3 text-muted">Aucune donnée sur cette période.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function percentage(value: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.min(100, Math.max(0, (value / denominator) * 100));
}

function DimensionItems({
  rows,
  dimension,
  denominator,
}: {
  rows: DashboardRow[];
  dimension: Dimension;
  denominator: number;
}) {
  if (rows.length === 0) {
    return <p className="mt-5 text-sm text-muted">Aucune donnée pour cette période.</p>;
  }

  return (
    <ol className="mt-4 space-y-3">
      {rows.map((row) => {
        const label = dimensionLabel(row.label, dimension);
        const share = percentage(row.value, denominator);
        return (
          <li key={row.label} className="flex min-w-0 items-start gap-4 text-sm">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="min-w-0 truncate text-muted" title={label}>{label}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted">{share.toFixed(share % 1 === 0 ? 0 : 1).replace(".", ",")} %</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-line/60" aria-hidden>
                <span className="block h-full rounded-sm bg-accent/60" style={{ width: `${share}%` }} />
              </div>
            </div>
            <span className="shrink-0 font-semibold tabular-nums">{number(row.value)}</span>
          </li>
        );
      })}
    </ol>
  );
}

function CountryStatus({ configured }: { configured: boolean }) {
  return (
    <span role="status" className={`inline-flex shrink-0 items-center gap-1.5 rounded-field border px-2 py-1 text-[11px] font-medium leading-4 ${configured ? "border-ok/30 bg-ok-soft text-ok" : "border-warn/30 bg-warn-soft text-warn"}`}>
      <span className={`size-1.5 rounded-full ${configured ? "bg-ok" : "bg-warn"}`} aria-hidden />
      {configured ? "GeoIP active" : "Géolocalisation non configurée"}
    </span>
  );
}

function DimensionList({
  title,
  rows,
  dimension,
  denominator,
  geoIpConfigured,
}: {
  title: string;
  rows: DashboardRow[];
  dimension: Dimension;
  denominator: number;
  geoIpConfigured?: boolean;
}) {
  const headingId = useId();
  const status = dimension === "country" && geoIpConfigured !== undefined
    ? <CountryStatus configured={geoIpConfigured} />
    : null;
  return (
    <section className="min-w-0 rounded-field border border-line bg-surface-raised p-5" aria-labelledby={headingId}>
      <div className="flex items-start justify-between gap-3">
        <h2 id={headingId} className="font-display text-lg font-semibold">{title}</h2>
        {status}
      </div>
      <DimensionItems rows={rows} dimension={dimension} denominator={denominator} />
    </section>
  );
}

function DimensionDetails({
  title,
  rows,
  dimension,
  denominator,
  geoIpConfigured,
}: {
  title: string;
  rows: DashboardRow[];
  dimension: Dimension;
  denominator: number;
  geoIpConfigured?: boolean;
}) {
  const status = dimension === "country" && geoIpConfigured !== undefined
    ? <CountryStatus configured={geoIpConfigured} />
    : null;
  return (
    <details className="group/details px-4 first:pt-1 last:pb-1">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 font-display text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="flex shrink-0 items-center gap-3 font-sans font-normal">
          {status}
          <span aria-hidden className="grid size-6 place-items-center rounded-field border border-line text-base leading-none text-muted">
            <span className="group-open/details:hidden">+</span>
            <span className="hidden group-open/details:inline">−</span>
          </span>
        </span>
      </summary>
      <div className="pb-3">
        <DimensionItems rows={rows} dimension={dimension} denominator={denominator} />
      </div>
    </details>
  );
}

export default function DashboardView({ stats, unavailable, geoIpConfigured, onLogout }: Props) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  useEffect(() => {
    let lastRefreshAt = 0;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRefreshAt < 1_000) return;
      lastRefreshAt = now;
      router.refresh();
    };
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  const refreshNow = () => {
    startTransition(() => router.refresh());
  };

  const pagesPerVisitCurrent = stats ? pagesPerVisit(stats.pageviews, stats.visits) : 0;
  const pagesPerVisitPrevious = stats ? pagesPerVisit(stats.previousPageviews, stats.previousVisits) : 0;
  const kpis = stats ? [
    { title: "Visiteurs", value: number(stats.visitors), comparison: comparisonText(stats.visitors, stats.previousVisitors), hint: "visiteurs consentants", primary: true },
    { title: "Visites", value: number(stats.visits), comparison: comparisonText(stats.visits, stats.previousVisits), hint: "sessions avec page vue", primary: false },
    { title: "Pages vues", value: number(stats.pageviews), comparison: comparisonText(stats.pageviews, stats.previousPageviews), hint: "événements collectés", primary: false },
    { title: "Pages par visite", value: decimal(pagesPerVisitCurrent), comparison: comparisonText(pagesPerVisitCurrent, pagesPerVisitPrevious), hint: "moyenne par session", primary: false },
  ] as const : [];

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:py-10">
      <header className="border-b border-line pb-6">
        <div className="flex min-w-0 flex-col gap-4 rounded-field border border-line bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-field bg-accent font-display text-base font-bold text-accent-contrast" aria-hidden>
              C
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold">Core / administration</p>
              <p className="mt-0.5 text-xs text-muted">Espace privé · données consenties</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-2" aria-live="polite">
              <span className={`size-2 rounded-full ${stats ? "bg-ok" : "bg-line"}`} aria-hidden />
              {stats ? `${number(stats.activeVisitors)} visiteur${stats.activeVisitors === 1 ? "" : "s"} actif${stats.activeVisitors === 1 ? "" : "s"}` : "Statut indisponible"}
            </span>
            <span className="whitespace-nowrap">
              Mise à jour <time dateTime={stats ? new Date(stats.to).toISOString() : undefined}>{updateLabel(stats?.to)} UTC</time>
            </span>
            <button
              type="button"
              onClick={refreshNow}
              disabled={isRefreshing}
              aria-label="Actualiser les statistiques"
              className="inline-flex min-h-9 items-center justify-center rounded-field border border-line px-3 font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-wait disabled:opacity-60"
            >
              {isRefreshing ? "Actualisation…" : "Actualiser"}
            </button>
            <form action={onLogout} className="shrink-0">
              <button type="submit" className="inline-flex min-h-9 items-center justify-center rounded-field border border-line px-3 font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Se déconnecter</button>
            </form>
          </div>
        </div>
        <div className="mt-7 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Tableau de bord</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Audience consentie</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Ces chiffres couvrent uniquement les visiteurs ayant accepté la mesure d’audience. Les adresses IP et agents utilisateurs bruts ne sont jamais conservés.</p>
        </div>
      </header>
      {unavailable || !stats ? (
        <section className="mt-8 rounded-field border border-danger/30 bg-danger-soft p-6" role="alert">
          <h2 className="font-display text-lg font-semibold">Tableau de bord indisponible</h2>
          <p className="mt-2 text-sm leading-6 text-muted">La base de données d’audience n’est pas configurée ou n’est pas accessible. Vérifiez la configuration du serveur.</p>
        </section>
      ) : (
        <>
          <nav aria-label="Période" className="mt-6 flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-sm font-medium text-muted">Période :</span>
            <div className="grid min-w-0 flex-1 grid-cols-3 overflow-hidden rounded-field border border-line sm:flex sm:flex-none">
              {periodOptions.map((period) => {
                const selected = stats.periodDays === period;
                return (
                  <Link
                    key={period}
                    href={`/admin?periode=${period}`}
                    prefetch={false}
                    aria-current={selected ? "page" : undefined}
                    className={`inline-flex min-h-10 min-w-0 items-center justify-center whitespace-nowrap border-line px-2 text-sm font-semibold transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-4 ${period !== periodOptions[0] ? "border-l" : ""} ${selected ? "bg-accent text-accent-contrast" : "bg-surface-raised hover:bg-surface hover:text-accent"}`}
                  >
                    {period} jours
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <article key={kpi.title} className={`min-w-0 rounded-field border p-4 sm:p-5 ${kpi.primary ? "border-accent/25 bg-surface" : "border-line bg-surface-raised"}`}>
                <p className="text-sm text-muted">{kpi.title}</p>
                <p className="mt-2 font-display text-2xl font-semibold tabular-nums sm:text-3xl">{kpi.value}</p>
                <p className="mt-2 text-xs font-medium text-muted">{kpi.comparison}</p>
                <p className="mt-1 text-xs text-muted">{kpi.hint}</p>
              </article>
            ))}
          </div>
          <section className="mt-5 min-w-0 rounded-field border border-line bg-surface-raised p-4 sm:p-6" aria-labelledby="trend-section-title">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 id="trend-section-title" className="font-display text-lg font-semibold">Tendance quotidienne</h2>
                <p className="mt-1 text-sm text-muted">Visiteurs uniques et pages vues en UTC.</p>
              </div>
              <span className="text-xs text-muted">Actualisation automatique toutes les 60 s</span>
            </div>
            <div className="mt-5"><Chart stats={stats} /></div>
          </section>
          <section className="mt-5 rounded-field border border-line bg-surface-raised md:hidden" aria-labelledby="breakdown-mobile-title">
            <div className="border-b border-line px-4 py-4">
              <h2 id="breakdown-mobile-title" className="font-display text-lg font-semibold">Répartition de l’audience</h2>
              <p className="mt-1 text-sm text-muted">Parts calculées sur les pages vues ou les visites.</p>
            </div>
            <div className="divide-y divide-line">
              <DimensionDetails title="Pages populaires" rows={stats.topPages} dimension="page" denominator={stats.pageviews} />
              <DimensionDetails title="Sources" rows={stats.sources} dimension="source" denominator={stats.visits} />
              <DimensionDetails title="Appareils" rows={stats.devices} dimension="device" denominator={stats.visits} />
              <DimensionDetails title="Pays" rows={stats.countries} dimension="country" denominator={stats.visits} geoIpConfigured={geoIpConfigured} />
            </div>
          </section>
          <div className="mt-5 hidden min-w-0 gap-5 md:grid md:grid-cols-2">
            <DimensionList title="Pages populaires" rows={stats.topPages} dimension="page" denominator={stats.pageviews} />
            <DimensionList title="Sources" rows={stats.sources} dimension="source" denominator={stats.visits} />
            <DimensionList title="Appareils" rows={stats.devices} dimension="device" denominator={stats.visits} />
            <DimensionList title="Pays" rows={stats.countries} dimension="country" denominator={stats.visits} geoIpConfigured={geoIpConfigured} />
          </div>
        </>
      )}
      <footer className="mt-8 border-t border-line pt-5 text-xs text-muted">Rétention automatique : 90 jours. Aucune donnée historique n’a été importée.</footer>
    </main>
  );
}
