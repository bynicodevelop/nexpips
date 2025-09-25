import z from "zod";

export const AuthFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis.")
    .pipe(z.email({ message: "Format d’email invalide" })),
  password: z
    .string()
    .min(6, "Minimum 6 caractères.")
    .max(100, "Maximum 100 caractères."),
});
