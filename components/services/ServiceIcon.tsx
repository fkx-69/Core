import { Globe, LayoutDashboard, Puzzle, Smartphone } from "lucide-react";
import type { Service } from "@/lib/services-data";

const icons: Record<Service["icon"], typeof Globe> = {
  globe: Globe,
  "layout-dashboard": LayoutDashboard,
  smartphone: Smartphone,
  puzzle: Puzzle,
};

/** Icône d'un service dans une pastille accentuée. */
export default function ServiceIcon({
  icon,
  className = "",
}: {
  icon: Service["icon"];
  className?: string;
}) {
  const Icon = icons[icon];
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-field bg-accent-soft text-accent ${className}`}
      aria-hidden
    >
      <Icon className="h-6 w-6" />
    </span>
  );
}
