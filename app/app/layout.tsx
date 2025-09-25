import type { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider } from "@shared/providers/FirebaseProvider";
import AnalyticsListenerProvider from "./providers/AnalyticsListenerProvider";
import { AuthProvider } from "./providers/AuthProvider";
import Header from "./shared/components/Header";

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
            <Header />
            <main className="max-w-5xl mx-auto py-6">{children}</main>
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
