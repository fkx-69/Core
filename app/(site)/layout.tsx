import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Chrome du site Core (header + footer). Les pages démo (/demos/*) vivent
 * hors de ce groupe : elles se présentent comme de vrais sites autonomes.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
