import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LicenseMenuPortal from "./LicenseMenuPortal";
import "./globals.css";

const SITE_URL = "https://www.koblevski-vyna.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Коблевські вина — натуральні вина та напої",
  description:
    "Коблевські вина — натуральні білі, червоні, рожеві, ігристі та розливні вина. Ознайомтесь з асортиментом, цінами та оформіть замовлення онлайн.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Коблевські вина — натуральні вина та напої",
    description:
      "Натуральні білі, червоні, рожеві, ігристі та розливні вина. Асортимент, ціни та замовлення онлайн.",
    url: "/",
    siteName: "Коблевські вина",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/images/hero-wine.jpg",
        width: 1200,
        height: 630,
        alt: "Коблевські вина",
      },
    ],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LiquorStore",
  "@id": `${SITE_URL}/#store`,
  name: "Коблевські Вина",
  url: `${SITE_URL}/`,
  telephone: "+380679110368",
  image: `${SITE_URL}/images/hero-wine.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "вулиця Степова, 3",
    addressLocality: "Коблеве",
    addressRegion: "Миколаївська область",
    postalCode: "57454",
    addressCountry: "UA",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
        "https://schema.org/Saturday",
        "https://schema.org/Sunday",
      ],
      opens: "08:00",
      closes: "22:30",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
        <LicenseMenuPortal />
        <Analytics />
      </body>
    </html>
  );
}
