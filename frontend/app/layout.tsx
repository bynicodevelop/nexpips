import type { Metadata } from "next";
import "./globals.css";

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
        {children}

        <footer className="py-10">
          <div className="mx-auto max-w-5xl px-6 text-sm text-base-content/80">
            © {new Date().getFullYear()} Tracker Trading — Tous droits réservés.
          </div>
        </footer>
      </body>
    </html>
  );
}
