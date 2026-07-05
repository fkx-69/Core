import Image, { type StaticImageData } from "next/image";

export default function IntroIllustration({
  src,
  alt = "",
}: {
  src: StaticImageData;
  alt?: string;
}) {
  return (
    <div className="hidden lg:block">
      <Image src={src} alt={alt} className="max-w-sm" />
    </div>
  );
}
