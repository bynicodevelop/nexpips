"use client";

import { useForm } from "react-hook-form";
import * as React from "react";
import { EmailingType } from "@/types/emailing";

export default function FormComponent({
  handleSubmit: onEmailSubmit,
  id = "email",
  placeholder = "Votre email",
  label = "Votre email",
  buttonText = "→ Rejoindre la liste d’attente",
  wrapperClassName = "flex w-full max-w-xl items-center gap-3",
  inputClassName = "input input-bordered flex-1",
  buttonClassName = "btn btn-primary font-semibold",
}: {
  handleSubmit: (emailingForm: EmailingType) => void;
  id?: string;
  placeholder?: string;
  label?: string;
  buttonText?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailingType>({
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = ({ email }: EmailingType) => {
    onEmailSubmit({ email });
    reset();
  };

  const emailError = errors.email;
  const errorId = `${id}-error`;

  return (
    <form
      className={`${wrapperClassName} fieldset flex-wrap`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="email"
        aria-required="true"
        autoComplete="email"
        placeholder={placeholder}
        aria-invalid={emailError ? "true" : "false"}
        aria-describedby={emailError ? errorId : undefined}
        className={inputClassName + (emailError ? " input-error" : "")}
        {...register("email", {
          required: "L’email est requis",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Format d’email invalide",
          },
          maxLength: { value: 254, message: "Email trop long" },
        })}
      />
      <button
        type="submit"
        className={
          buttonClassName +
          (isSubmitting ? " opacity-70 cursor-not-allowed" : "")
        }
        disabled={isSubmitting}
      >
        {buttonText}
      </button>
      {emailError && (
        <div className="basis-full">
            <p className="mt-1 text-sm text-error text-left" role="alert" aria-live="polite">
            {emailError.message}
          </p>
        </div>
      )}
    </form>
  );
}
