import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Core — Agence de développement logiciel",
    template: "%s | Core",
  },
  description:
    "Core conçoit des sites web, applications web et applications mobiles pour les entreprises d'Afrique de l'Ouest, de Dakar à Abidjan.",
};

// Applique le thème avant le premier paint : localStorage, sinon préférence système.
const themeInit = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t===null&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
      </body>
    </html>
  );
}
