const BRANDS = [
  "Téranga Bistro",
  "Baobab Pay",
  "Lagune Hôtels",
  "Niayes Agro",
  "Sandaga Market",
  "Plateau Immo",
  "Sahel Mobilité",
  "Cocody Santé",
];

/** Une copie de la liste des marques, séparées par un losange discret. */
function MarqueeRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden || undefined}
    >
      {BRANDS.map((brand) => (
        <span key={brand} className="flex items-center gap-12">
          <span className="font-display text-lg font-semibold text-muted/70">
            {brand}
          </span>
          <span className="text-line" aria-hidden>
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

/** Bandeau « Ils nous font confiance » : marques fictives ouest-africaines
 *  défilant en boucle sans couture (piste dupliquée), fondue sur les bords —
 *  même pattern que le marquee de la démo VOLT. */
export default function LogoMarquee() {
  return (
    <section className="border-y border-line bg-surface py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Ils nous font confiance
      </p>
      <div
        className="marquee-pausable mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex w-max animate-marquee-slow gap-12">
          <MarqueeRow />
          <MarqueeRow ariaHidden />
        </div>
      </div>
    </section>
  );
}
