"use client";

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@shared/components";

type Props = {
  label?: string;
  className?: string;
};

export function SignoutButton({ label = "Se déconnecter", className = "" }: Props) {
  const { signout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={loading}
      ariaBusy={loading}
      onClick={handleClick}
      loading={loading}
      className={className}
    >
      {loading ? "Déconnexion…" : label}
    </Button>
  );
}

export default SignoutButton;
