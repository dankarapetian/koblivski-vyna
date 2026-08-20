import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://koblivski-vyna.vercel.app"),
  title: "Коблівські Вина — замовлення вин онлайн",
  description: "Добірні білі, червоні, рожеві та ігристі вина. Зручне оформлення замовлення та доставка по Україні.",
  openGraph: {
    title: "Коблівські Вина",
    description: "Оберіть улюблений напій та оформіть замовлення без зайвих кроків.",
    url: "/",
    siteName: "Коблівські Вина",
    locale: "uk_UA",
    type: "website",
    images: [{ url: "/images/hero-wine.jpg", width: 1200, height: 630, alt: "Коблівські Вина" }],
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
        <Analytics />
      </body>
    </html>
  );
}
