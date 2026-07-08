import Hero from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
import ServicesPreview from "@/components/home/ServicesPreview";
import WhyUs from "@/components/home/WhyUs";
import KeyFigures from "@/components/home/KeyFigures";
import PortfolioTeaser from "@/components/home/PortfolioTeaser";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/shared/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <ServicesPreview />
      <WhyUs />
      <KeyFigures />
      <PortfolioTeaser />
      <Testimonials />
      <CtaBanner
        title="Un projet en tête ?"
        text="Parlons de votre produit, de vos délais et de votre budget. Nous vous répondons avec un premier avis technique et une estimation honnête, en FCFA."
      />
    </>
  );
}
