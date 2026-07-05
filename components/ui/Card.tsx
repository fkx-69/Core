export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface-raised p-6 shadow-sm transition duration-200 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
