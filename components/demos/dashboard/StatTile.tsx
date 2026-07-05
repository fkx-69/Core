import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export type Delta = {
  /** Texte signé, comparé à une période nommée : « +12,4 % vs mai ». */
  text: string;
  up: boolean;
  /** La direction est-elle une bonne nouvelle ? (une baisse peut l'être) */
  good: boolean;
};

export default function StatTile({
  label,
  value,
  hint,
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: Delta;
}) {
  const DeltaIcon = delta?.up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="rounded-field border border-line bg-surface-raised p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold sm:text-2xl">
        {value}
      </p>
      {delta && (
        <p
          className={`mt-0.5 flex items-center gap-0.5 text-xs font-medium ${
            delta.good ? "text-ok" : "text-danger"
          }`}
        >
          <DeltaIcon className="h-3.5 w-3.5" aria-hidden />
          {delta.text}
        </p>
      )}
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
