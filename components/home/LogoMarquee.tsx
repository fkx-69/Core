/**
 * Marques fictives ouest-africaines, chacune avec son propre traitement
 * typographique — un mur de logos crédible plutôt qu'une liste uniforme.
 * Monochrome muted : les « logos » restent en retrait, comme sur un vrai
 * bandeau de confiance.
 */
const BRANDS: { id: string; logo: React.ReactNode }[] = [
  {
    id: "teranga",
    logo: <span className="font-serif text-xl italic">Téranga Bistro</span>,
  },
  {
    id: "baobab",
    logo: (
      <span className="font-display text-lg font-bold tracking-tight">
        baobab<span className="opacity-50">·</span>pay
      </span>
    ),
  },
  {
    id: "lagune",
    logo: (
      <span className="font-serif text-sm uppercase tracking-[0.35em]">
        Lagune Hôtels
      </span>
    ),
  },
  {
    id: "niayes",
    logo: (
      <span className="font-display text-lg font-semibold uppercase">
        Niayes<span className="font-light"> Agro</span>
      </span>
    ),
  },
  {
    id: "sandaga",
    logo: (
      <span className="font-mono text-base font-semibold uppercase tracking-widest">
        Sandaga&nbsp;Mkt
      </span>
    ),
  },
  {
    id: "plateau",
    logo: (
      <span className="text-lg font-light uppercase tracking-[0.18em]">
        Plateau<span className="font-semibold">Immo</span>
      </span>
    ),
  },
  {
    id: "sahel",
    logo: (
      <span className="font-display text-lg font-bold italic">
        Sahel Mobilité <span aria-hidden>≫</span>
      </span>
    ),
  },
  {
    id: "cocody",
    logo: (
      <span className="text-lg font-semibold">
        Cocody Santé <span className="opacity-60" aria-hidden>+</span>
      </span>
    ),
  },
];

/** Une copie de la liste des logotypes (piste dupliquée pour la boucle). */
function MarqueeRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-baseline gap-16 pr-16"
      aria-hidden={ariaHidden || undefined}
    >
      {BRANDS.map((brand) => (
        <span key={brand.id} className="whitespace-nowrap text-muted/70">
          {brand.logo}
        </span>
      ))}
    </div>
  );
}

/** Bandeau « Ils nous font confiance » : logotypes fictifs ouest-africains
 *  défilant en boucle sans couture (piste dupliquée), fondus sur les bords —
 *  même pattern que le marquee de la démo VOLT. */
export default function LogoMarquee() {
  return (
    <section className="border-y border-line bg-surface py-10">
      <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        <span aria-hidden className="h-px w-6 bg-line" />
        Ils nous font confiance
        <span aria-hidden className="h-px w-6 bg-line" />
      </p>
      <div
        className="marquee-pausable mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex w-max animate-marquee-slow">
          <MarqueeRow />
          <MarqueeRow ariaHidden />
        </div>
      </div>
    </section>
  );
}
