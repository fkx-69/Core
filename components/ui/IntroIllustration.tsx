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
      <Image
        src={src}
        alt={alt}
        {...(isString && width && height ? { width, height } : {})}
        className="h-auto w-full max-w-md sm:max-w-lg lg:max-w-full"
      />
    </div>
  );
}
