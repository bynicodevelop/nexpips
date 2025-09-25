import { AuthFormSchema } from "@/validators/auth-form";
import z from "zod";

export type AuthForm = z.infer<typeof AuthFormSchema>;
