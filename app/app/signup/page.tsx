"use client";

import Link from "next/link";
import { AuthForm } from "@/types/auth-form";
import AuthFormComponent from "@/app/shared/components/AuthFormComponent";
import { useAuth } from "@/app/hooks/useAuth";

export default function Signup() {
  const { signup } = useAuth();

  const onSubmit = async ({ email, password }: AuthForm) => {
    await signup({ email, password });
  };

  return (
    <div className="hero min-h-[calc(100vh-80px)] bg-base-200">
      <div className="hero-content w-full flex-col">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <p className="py-2 text-base-content/70">
            Inscrivez-vous avec votre email et un mot de passe.
          </p>
        </div>

        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <AuthFormComponent handleSubmit={onSubmit} />
          <div className="px-8 pb-6 text-center text-sm">
            <span className="text-base-content/70">Déjà un compte ? </span>
            <Link href="/signin" className="link link-primary">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
