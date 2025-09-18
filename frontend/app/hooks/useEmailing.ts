import { EmailingType } from "@/types/emailing";

export const useEmailing = () => {
  const subscribeEmailing = async (emailingForm: EmailingType) => {
    console.log("Subscribing email:", emailingForm.email);
  };

  return { subscribeEmailing };
};
