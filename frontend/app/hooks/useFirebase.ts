import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

let firebaseApp: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const useFirebase = () => {
  const initializeFirebase = async () => {
    if (!firebaseApp) {
      if (Object.values(firebaseConfig).some((v) => !v)) {
        console.warn(
          "Configuration Firebase incomplète (variables manquantes)."
        );
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

    return { app: firebaseApp, analytics: analyticsInstance };
  };

  return { initializeFirebase };
};
