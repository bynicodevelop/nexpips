"use client";

import React, { forwardRef } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "ghost"
  | "outline"
  | "info"
  | "success"
  | "warning"
  | "error";

type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  ariaBusy?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  dash?: boolean; // style dash DaisyUI
  soft?: boolean; // style soft
}

const variantToClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  neutral: "btn-neutral",
  ghost: "btn-ghost",
  outline: "btn-outline",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
};

const sizeToClass: Record<ButtonSize, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      ariaBusy,
      leftIcon,
      rightIcon,
      disabled,
      dash = false,
      soft = false,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const variantClass = variantToClass[variant];
    const sizeClass = sizeToClass[size];
    const styleModifier = dash ? "btn-dash" : soft ? "btn-soft" : "";

    const classes = [
      "btn",
      variantClass,
      sizeClass,
      styleModifier,
      fullWidth ? "btn-block" : "",
      loading ? "pointer-events-none" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
  aria-busy={(ariaBusy ?? loading) || undefined}
        {...rest}
      >
        {loading && <span className="loading loading-spinner loading-sm" aria-hidden />}
        {!loading && leftIcon ? <span className="mr-1 inline-flex">{leftIcon}</span> : null}
        <span className="inline-flex items-center gap-1">{children}</span>
        {!loading && rightIcon ? <span className="ml-1 inline-flex">{rightIcon}</span> : null}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
