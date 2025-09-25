import { EmailingSchema } from "@/validators/emailing";
import { ServerDate, serverDateFactory } from "@shared/types/server-date";
import z from "zod";

export type EmailingType = z.infer<typeof EmailingSchema>;

export type EmailingDocument = EmailingType &
  ServerDate & {
    emailLower: string;
  };

export const emailingDocumentFactory = (
  email: string,
  emailLower: string
): EmailingDocument => ({
  email,
  emailLower,
  ...serverDateFactory(),
});
