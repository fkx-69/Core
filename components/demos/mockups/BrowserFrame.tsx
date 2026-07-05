import { ChevronLeft, ChevronRight, Lock, RotateCw } from "lucide-react";

/** Mockup de navigateur : barre d'outils, pastilles et fausse barre d'URL. */
export default function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-md">
      <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="hidden items-center gap-1 text-muted sm:flex" aria-hidden>
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 opacity-40" />
          <RotateCw className="h-3.5 w-3.5" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs text-muted">
          <Lock className="h-3 w-3 shrink-0" aria-hidden />
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
