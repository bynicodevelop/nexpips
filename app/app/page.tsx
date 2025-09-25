
"use client";

import { useAuthContext } from "./providers/AuthProvider";
import SignoutButton from "./shared/components/SignoutButton";

export default function Home() {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Application</h1>
        <p className="text-sm text-base-content/70">
          {isAuthenticated
            ? `Connecté en tant que ${user?.email ?? user?.uid}`
            : "Utilisateur non authentifié"}
        </p>
      </div>

      {isAuthenticated && (
        <div>
          <SignoutButton />
        </div>
      )}
    </div>
  );
}
