import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  Firestore,
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { useLog } from "./useLog";

let firebaseApp: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;
let firestoreInstance: Firestore | null = null;

export const useFirebase = () => {
  const { warn } = useLog({ ns: "Firebase" });
  const initializeFirebase = async (firebaseConfig: Record<string, any>) => {
    if (!firebaseApp) {
      if (Object.values(firebaseConfig).some((v) => !v)) {
        warn("Configuration Firebase incomplète (variables manquantes).");
        return;
      }

      firebaseApp = getApps().length
        ? getApps()[0]
        : initializeApp(firebaseConfig);

      // Analytics uniquement dans le navigateur
      if (typeof window !== "undefined") {
        try {
          if (await isSupported()) {
            analyticsInstance = getAnalytics(firebaseApp);
          }
        } catch {
          // Ignorer si non supporté (ex: SSR)
        }
      }
    }

    firestoreInstance = getFirestore(firebaseApp);

    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true"
    ) {
      try {
        connectFirestoreEmulator(firestoreInstance, "localhost", 8080);
      } catch (e) {
        warn("Impossible de connecter Firestore à l'émulateur:", e);
      }
    }

    return {
      app: firebaseApp,
      analytics: analyticsInstance,
      firestore: firestoreInstance,
    };
  };

  const getFirebaseFirestore = (): Firestore | null => {
    return firestoreInstance;
  };

  return { initializeFirebase, getFirebaseFirestore };
};
