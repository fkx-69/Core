export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p
          className={`mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span aria-hidden className="h-px w-6 bg-accent/60" />
          {eyebrow}
          {align === "center" && (
            <span aria-hidden className="h-px w-6 bg-accent/60" />
          )}
        </p>
      )}
      <Tag className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {intro && <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
