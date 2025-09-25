"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "../../providers/AuthProvider";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`btn btn-ghost btn-sm ${active ? "btn-active" : ""}`}
      prefetch
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return null;

  return (
    <header className="border-b border-base-300 bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/60">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight" prefetch>
            Tracker Trading
          </Link>
        </div>
        <nav className="flex items-center gap-1 ml-auto">
          <NavLink href="/settings" label="Paramètres" />
        </nav>
      </div>
    </header>
  );
}
