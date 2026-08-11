import { Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

/** Accordéon sans JavaScript : détails/summary natifs séparés par des filets,
 *  icône « + » pivotée en croix à l'ouverture. */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display font-semibold marker:hidden [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:py-5">
            {item.question}
            <Plus
              className="h-4 w-4 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
              aria-hidden
            />
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
