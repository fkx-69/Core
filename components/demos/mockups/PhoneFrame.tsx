import { Signal, Wifi, BatteryFull } from "lucide-react";

/** Mockup de smartphone en CSS : bordure épaisse, encoche, barre de statut. */
export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-165 w-80 overflow-hidden rounded-[2.5rem] border-8 border-zinc-900 bg-background shadow-xl dark:border-zinc-700">
      <div className="relative flex h-full flex-col">
        {/* Encoche */}
        <div
          aria-hidden
          className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-700"
        />
        {/* Barre de statut */}
        <div className="flex items-center justify-between px-6 pb-1 pt-2.5 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="flex items-center gap-1 text-muted" aria-hidden>
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-4 w-4" />
          </span>
        </div>
        {/* Écran */}
        <div className="relative min-h-0 flex-1">{children}</div>
        {/* Indicateur home */}
        <div className="flex justify-center py-1.5" aria-hidden>
          <span className="h-1 w-28 rounded-full bg-foreground/30" />
        </div>
      </div>
    </div>
  );
}
