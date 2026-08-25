import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LicenseMenuPortal from "./LicenseMenuPortal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://koblevski-vyna.com"),
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
        {children}
        <LicenseMenuPortal />
        <Analytics />
      </body>
    </html>
  );
}
