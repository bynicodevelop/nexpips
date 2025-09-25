"use client";

import Link from "next/link";
import { AuthForm } from "@/types/auth-form";
import AuthFormComponent from "@/app/shared/components/AuthFormComponent";
import { useAuth } from "@/app/hooks/useAuth";

export default function Signin() {
  const { signin } = useAuth();

  const onSubmit = async ({ email, password }: AuthForm) => {
    await signin({ email, password });
  };

  return (
    <div className="hero min-h-[calc(100vh-80px)] bg-base-200">
      <div className="hero-content w-full flex-col">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Se connecter</h1>
          <p className="py-2 text-base-content/70">
            Connectez-vous avec votre email et votre mot de passe.
          </p>
        </div>

        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <AuthFormComponent
            handleSubmit={onSubmit}
            buttonText="Se connecter"
          />
          <div className="px-8 pb-6 text-center text-sm">
            <span className="text-base-content/70">Pas encore de compte ? </span>
            <Link href="/signup" className="link link-primary">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
