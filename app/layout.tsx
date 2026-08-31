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
  title: "Коблевські Вина — замовлення вин онлайн",
  description:
    "Добірні білі, червоні, рожеві та ігристі вина. Залиште заявку на замовлення — продавець підтвердить наявність та умови отримання.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
    title: "Коблевські Вина — замовлення вин онлайн",
    description:
      "Добірні білі, червоні, рожеві та ігристі вина. Залиште заявку на замовлення — продавець підтвердить наявність та умови отримання.",
    url: "/",
    siteName: "Коблевські Вина",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/images/hero-wine.jpg",
        width: 1200,
        height: 630,
        alt: "Коблевські Вина",
      },
    ],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Коблевські Вина",
  alternateName: "Коблевські вина",
  inLanguage: "uk-UA",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
