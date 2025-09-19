import { EmailingType } from "@/types/emailing";
import { useFirebase } from "./useFirebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { EmailingSchema } from "@/validators/emailing";
import { useToast } from "../hooks/useToats";

export const useEmailing = () => {
  const { getFirebaseFirestore } = useFirebase();
  const { showErrorToast, showSuccessToast, showInfoToast } = useToast();

  const subscribeEmailing = async (emailingForm: EmailingType) => {
    try {
      EmailingSchema.parse(emailingForm);
    } catch (e) {
      console.warn("Emailing invalide:", e);
      showErrorToast("Email invalide. Merci de vérifier le format.");
      return { ok: false, reason: "invalid_email" };
    }

    const firestore = await getFirebaseFirestore();

    if (!firestore) {
      console.warn("Firestore n'est pas initialisé.");
      showErrorToast("Service indisponible. Réessayez dans un instant.");
      return { ok: false, reason: "firestore_not_initialized" };
    }
    const emailLower = emailingForm.email.toLowerCase().trim();

    try {
      const emailingQuery = query(
        collection(firestore, "emailing"),
        where("email", "==", emailLower),
        limit(1)
      );
      const snap = await getDocs(emailingQuery);
      if (!snap.empty) {
        const existing = snap.docs[0];
        showInfoToast("Vous êtes déjà inscrit.");
        return {
          ok: true,
          already: true,
          id: existing.id,
          data: existing.data(),
        };
      }

      const payload = {
        ...emailingForm,
        emailLower,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firestore, "emailing"), payload);
      showSuccessToast("Inscription enregistrée. Merci !");
      return { ok: true, id: docRef.id, already: false };
    } catch (error) {
      console.error("Erreur lors de l'inscription emailing:", error);
      showErrorToast("Une erreur est survenue. Réessayez plus tard.");
      return { ok: false, reason: "exception", error };
    }
  };

  return { subscribeEmailing };
};
