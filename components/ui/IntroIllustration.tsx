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
    <div className="hidden lg:block">
      <Image
        src={src}
        alt={alt}
        {...(isString && width && height ? { width, height } : {})}
        className="max-w-sm h-auto"
      />
    </div>
  );
}
