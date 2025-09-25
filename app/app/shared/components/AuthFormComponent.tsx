"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthForm } from "@/types/auth-form";
import { AuthFormSchema } from "@/validators/auth-form";

export default function AuthFormComponent({
  handleSubmit: onAuthSubmit,
  emailId = "email",
  passwordId = "password",
  emailPlaceholder = "vous@exemple.com",
  emailLabel = "Email",
  passwordLabel = "Mot de passe",
  buttonText = "Créer mon compte",
  formClassName = "card-body",
  inputClassName = "input input-bordered",
  buttonClassName = "btn btn-primary w-full",
}: {
  handleSubmit: (values: AuthForm) => void;
  emailId?: string;
  passwordId?: string;
  emailPlaceholder?: string;
  emailLabel?: string;
  passwordLabel?: string;
  buttonText?: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthForm>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = (values: AuthForm) => {
    onAuthSubmit(values);
    reset();
  };

  const emailError = errors.email;
  const passwordError = errors.password;
  const emailErrorId = `${emailId}-error`;
  const passwordErrorId = `${passwordId}-error`;

  return (
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="fieldset">
        <label className="fieldset-legend" htmlFor={emailId}>
          {emailLabel}
        </label>
        <input
          id={emailId}
          type="email"
          placeholder={emailPlaceholder}
          className={inputClassName + (emailError ? " input-error" : "")}
          aria-required="true"
          aria-invalid={emailError ? "true" : "false"}
          aria-describedby={emailError ? emailErrorId : undefined}
          autoComplete="email"
          {...register("email")}
        />
        {emailError && (
          <p id={emailErrorId} className="mt-1 text-sm text-error" role="alert" aria-live="polite">
            {emailError.message}
          </p>
        )}
      </div>

      <div className="fieldset">
        <label className="fieldset-legend" htmlFor={passwordId}>
          {passwordLabel}
        </label>
        <input
          id={passwordId}
          type="password"
          placeholder="••••••••"
          className={inputClassName + (passwordError ? " input-error" : "")}
          aria-required="true"
          aria-invalid={passwordError ? "true" : "false"}
          aria-describedby={passwordError ? passwordErrorId : undefined}
          minLength={6}
          autoComplete="new-password"
          {...register("password")}
        />
        <p className="label"> Minimum 6 caractères </p>
        {passwordError && (
          <p id={passwordErrorId} className="-mt-1 text-sm text-error" role="alert" aria-live="polite">
            {passwordError.message}
          </p>
        )}
      </div>

      <div className="form-control mt-4">
        <button
          type="submit"
          className={buttonClassName + (isSubmitting ? " opacity-70 cursor-not-allowed" : "")}
          disabled={isSubmitting}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
