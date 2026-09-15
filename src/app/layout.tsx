import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "RIO & CO., rénovation tout corps d'état avec Maxime Rio. Spécialiste plomberie, salle de bain, cuisine et rénovation complète. Un seul interlocuteur, un chantier maîtrisé.",
  keywords: [
    "rénovation tout corps d'état",
    "plombier",
    "rénovation salle de bain",
    "rénovation cuisine",
    "artisan rénovation",
    "Maxime Rio",
  ],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Rénovation tout corps d'état & plomberie. Un artisan, un engagement : la qualité jusqu'au dernier détail.",
    url: siteConfig.baseUrl,
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: siteConfig.name,
  description: siteConfig.tagline,
  founder: siteConfig.founder,
  url: siteConfig.baseUrl,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
  },
  areaServed: siteConfig.address.zone,
  knowsAbout: ["Plomberie", "Rénovation tout corps d'état", "Salle de bain", "Cuisine"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
