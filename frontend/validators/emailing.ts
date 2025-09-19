import z from "zod";

export const EmailingSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "L’email est requis" })
    .max(254, { message: "Email trop long" })
    .pipe(z.email({ message: "Format d’email invalide" })),
});
