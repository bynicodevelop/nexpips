import type { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider } from "@shared/providers/FirebaseProvider";
import ToastComponent from "@shared/components/ToastComponent";
import AnalyticsListener from "./providers/AnalyticsListener";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Tracker de Trades",
  description: "Suivi de vos performances de trading",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tracker Trading",
    title: "Tracker de Trades",
    description: "Suivi de vos performances de trading",
    images: [
      {
        url: "/images/header-image.png",
        width: 1280,
        height: 720,
        alt: "Nexpips — Transforme tes idées de trades en résultats",
      },
    ],
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracker de Trades",
    description: "Suivi de vos performances de trading",
    images: ["/images/header-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <FirebaseProvider>
          {children}
          <footer className="py-10">
            <div className="mx-auto max-w-5xl px-6 text-sm text-base-content/80">
              © {new Date().getFullYear()} Tracker Trading — Tous droits réservés.
            </div>
          </footer>

          <ToastComponent />
          <AnalyticsListener />
        </FirebaseProvider>
      </body>
    </html>
  );
}
