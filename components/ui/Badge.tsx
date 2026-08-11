export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-field border border-line bg-surface-raised px-3 py-1 text-xs font-medium text-muted transition-colors duration-200 hover:border-accent/50 hover:text-foreground">
      {children}
    </span>
  );
}
