import { emailingDocumentFactory, EmailingType } from "@/types/emailing";
import { useFirebase } from "./useFirebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  Firestore,
} from "firebase/firestore";
import { EmailingSchema } from "@/validators/emailing";
import { useToast } from "../hooks/useToats";
import { useLog } from "./useLog";

export const useEmailing = () => {
  const { getFirebaseFirestore } = useFirebase();
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

    const firestore = await getFirebaseFirestore();

    if (!firestore) {
      warn("Firestore n'est pas initialisé.");
      showErrorToast("Service indisponible. Réessayez dans un instant.");
      return { ok: false, reason: "firestore_not_initialized" };
    }
    const emailLower = emailingForm.email.toLowerCase();

    try {
      const existing = await _findEmailingByEmail(emailLower, firestore);

      if (existing) {
        showInfoToast("Inscription enregistrée. Merci !");
        return { ok: true, id: existing.id, already: true };
      }

      const payload = emailingDocumentFactory(emailingForm.email, emailLower);
      const docRef = await addDoc(collection(firestore, "emailing"), payload);
      
      showSuccessToast("Inscription enregistrée. Merci !");
      return { ok: true, id: docRef.id, already: false };
    } catch (error) {
      logError("Erreur lors de l'inscription emailing:", error);
      showErrorToast("Une erreur est survenue. Réessayez plus tard.");
      return { ok: false, reason: "exception", error };
    }
  };

  const _findEmailingByEmail = async (
    emailLower: string,
    firestore: Firestore
  ) => {
    try {
      const emailingQuery = query(
        collection(firestore, "emailing"),
        where("email", "==", emailLower),
        limit(1)
      );
      const snap = await getDocs(emailingQuery);
      if (!snap.empty) {
        const existing = snap.docs[0];
        return { id: existing.id, data: existing.data() };
      }
      return null;
    } catch (error) {
      logError("Erreur lors de la recherche emailing:", error);
      return null;
    }
  };

  return { subscribeEmailing };
};
