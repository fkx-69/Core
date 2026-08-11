import Hero from "@/components/home/Hero";
import ServicesPreview from "@/components/home/ServicesPreview";
import WhyUs from "@/components/home/WhyUs";
import PortfolioTeaser from "@/components/home/PortfolioTeaser";
import CtaBanner from "@/components/shared/CtaBanner";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildPageMetadata,
  getHomeStructuredData,
  siteConfig,
} from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  pathname: "/",
  titleAbsolute: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={getHomeStructuredData()} />
      <Hero />
      <ServicesPreview />
      <WhyUs />
      <PortfolioTeaser />
      <CtaBanner
        title="Un projet en tête ?"
        text="Parlons de votre produit et de vos objectifs. Nous vous aidons à clarifier les prochaines étapes techniques."
      />
    </>
  );
}
