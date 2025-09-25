import type { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider } from "@shared/providers/FirebaseProvider";
import AnalyticsListenerProvider from "./providers/AnalyticsListenerProvider";
import { AuthProvider } from "./providers/AuthProvider";

export const metadata: Metadata = {
  title: "Tracker de Trades",
  description: "Suivi de vos performances de trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <FirebaseProvider>
          <AuthProvider
            publicRoutes={["/signin", "/signup"]}
            redirectAfterSignout="/signin"
            redirectAfterAuth="/"
          >
            {children}
            <footer className="py-10">
              <div className="mx-auto max-w-5xl px-6 text-sm text-base-content/80">
                © {new Date().getFullYear()} Tracker Trading — Tous droits réservés.
              </div>
            </footer>
            <AnalyticsListenerProvider />
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
