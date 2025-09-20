import { emailingDocumentFactory, EmailingType } from "@/types/emailing";
import { EmailingSchema } from "@/validators/emailing";
import { useToast, useLog, useFirestore } from "@shared/hooks"; // Tout depuis shared

export const useEmailing = () => {
  const { addDocument, findDocumentByField } = useFirestore(); // Méthodes centralisées
  const { showErrorToast, showSuccessToast, showInfoToast } = useToast();
  const { warn, error: logError } = useLog({ ns: "Emailing" });

  const subscribeEmailing = async (emailingForm: EmailingType) => {
    try {
      EmailingSchema.parse(emailingForm);
    } catch (e) {
      warn("Emailing invalide:", e);
      showErrorToast("Email invalide. Merci de vérifier le format.");
      return { ok: false, reason: "invalid_email" };
    }

    const emailLower = emailingForm.email.toLowerCase();

    try {
      // Utiliser la méthode centralisée pour chercher l'email
      const existing = await findDocumentByField(
        "emailing",
        "email",
        emailLower
      );

      if (existing) {
        showInfoToast("Inscription enregistrée. Merci !");
        return { ok: true, id: existing.id, already: true };
      }

      // Utiliser la méthode centralisée pour ajouter le document
      const payload = emailingDocumentFactory(emailingForm.email, emailLower);
      const docRef = await addDocument("emailing", payload);

      showSuccessToast("Inscription enregistrée. Merci !");
      return { ok: true, id: docRef.id, already: false };
    } catch (error) {
      logError("Erreur lors de l'inscription emailing:", error);
      showErrorToast("Une erreur est survenue. Réessayez plus tard.");
      return { ok: false, reason: "exception", error };
    }
  };

  return { subscribeEmailing };
};
