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
let initPromise: Promise<void> | null = null;

const IS_BROWSER = typeof window !== "undefined";
const IS_EMULATOR = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true";

export const useFirebase = () => {
  const { warn } = useLog({ ns: "Firebase" });
  const initializeFirebase = async (firebaseConfig: Record<string, any>) => {
    if (!initPromise) {
      initPromise = (async () => {
        const hasMissing = Object.values(firebaseConfig).some((v) => !v);
        if (!firebaseApp) {
          if (hasMissing) {
            warn("Configuration Firebase incomplète (variables manquantes).");
            return;
          }

          firebaseApp = getApps().length
            ? getApps()[0]
            : initializeApp(firebaseConfig);

          // Analytics uniquement dans le navigateur
          if (IS_BROWSER) {
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

        if (IS_BROWSER && IS_EMULATOR) {
          try {
            connectFirestoreEmulator(firestoreInstance, "localhost", 8080);
          } catch (e) {
            warn("Impossible de connecter Firestore à l'émulateur:", e);
          }
        }
      })();
    }

    await initPromise;

    return {
      app: firebaseApp,
      analytics: analyticsInstance,
      firestore: firestoreInstance,
    };
  };

  const getFirebaseAnalytics = (): Analytics | null => {
    return analyticsInstance;
  };

  const getFirebaseFirestore = (): Firestore | null => {
    return firestoreInstance;
  };

  return {
    initializeFirebase,
    getFirebaseFirestore,
    getFirebaseAnalytics,
  };
};
