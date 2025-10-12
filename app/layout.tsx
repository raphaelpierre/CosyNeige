import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/hooks/useLanguage";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chalet-Balmotte810 - Luxury Chalet in Châtillon-sur-Cluses, French Alps",
  description: "Experience luxury alpine living at Chalet-Balmotte810, perfectly positioned between the Arve and Giffre valleys. Access to 5 major ski resorts including Grand Massif, Morzine, and Chamonix.",
  keywords: "luxury chalet, French Alps, Châtillon-sur-Cluses, Haute-Savoie, Grand Massif, ski chalet, alpine retreat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cream min-h-screen`}
        style={{ backgroundColor: '#FAFAF8' }}
      >
        <LanguageProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
