import type { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider } from "./providers/FirebaseProvider";
import ToastComponent from "./components/shared/ToastComponent";

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
          {children}
          <footer className="py-10">
            <div className="mx-auto max-w-5xl px-6 text-sm text-base-content/80">
              © {new Date().getFullYear()} Tracker Trading — Tous droits réservés.
            </div>
          </footer>

          <ToastComponent />
        </FirebaseProvider>
      </body>
    </html>
  );
}
