export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-card border border-line bg-surface-raised p-6 shadow-card transition duration-200 hover:border-accent/40 ${className}`}
    >
      {children}
    </div>
  );
}
