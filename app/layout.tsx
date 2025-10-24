import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/hooks/useLanguage";
import { AuthProvider } from "@/lib/context/AuthContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import LocaleWrapper from "@/components/LocaleWrapper";
import { vacationRentalSchema, organizationSchema } from "./structured-data";

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
  description: "Experience luxury alpine living at Chalet-Balmotte810, perfectly positioned between the Arve and Giffre valleys. Access to 5 major ski resorts including Grand Massif, Portes du Soleil, and Chamonix.",
  keywords: "luxury chalet, French Alps, Châtillon-sur-Cluses, Haute-Savoie, Grand Massif, Portes du Soleil, ski chalet, alpine retreat",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: {
    title: "Chalet-Balmotte810 - Luxury Alpine Chalet",
    description: "Luxury 5-bedroom chalet in Haute-Savoie with jacuzzi. Access to 5 ski resorts: Grand Massif, Portes du Soleil, Chamonix.",
    url: "https://chalet-balmotte810.com",
    siteName: "Chalet-Balmotte810",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vacationRentalSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E293B" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cream min-h-screen`}
        style={{ backgroundColor: '#FAFAF8' }}
      >
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <LocaleWrapper>
                <Navigation />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </LocaleWrapper>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
