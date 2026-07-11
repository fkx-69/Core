import Image, { type StaticImageData } from "next/image";

export default function IntroIllustration({
  src,
  alt = "",
  width,
  height,
}: {
  src: StaticImageData | string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  const isString = typeof src === "string";
  return (
    <div className="flex justify-center lg:justify-start">
      {/* Toujours en haut de page (intros Services/Portfolio/Contact) :
          chargement eager, c'est le LCP probable de ces pages. */}
      <Image
        src={src}
        alt={alt}
        {...(isString && width && height ? { width, height } : {})}
        loading="eager"
        sizes="(min-width: 1024px) 34rem, (min-width: 640px) 32rem, 100vw"
        className="h-auto w-full max-w-md sm:max-w-lg lg:max-w-full"
      />
    </div>
  );
}
