import { ServerDate, serverDateFactory } from "./server-date";

export type EmailingType = {
  email: string;
};

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
