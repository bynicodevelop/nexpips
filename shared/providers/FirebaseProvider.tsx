"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLog, useFirebase } from "../hooks";

type FirebaseContextType = {
  isInitialized: boolean;
};

const FirebaseContext = createContext<FirebaseContextType>({
  isInitialized: false,
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const useFirebaseContext = () => useContext(FirebaseContext);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeFirebase } = useFirebase();
  const { info, warn, error: logError } = useLog();

  useEffect(() => {
    const init = async () => {
      try {
        const result = await initializeFirebase(firebaseConfig);
        if (result) {
          info("Firebase initialisé avec succès");
          setIsInitialized(true);
        } else {
          warn("Échec de l'initialisation Firebase");
        }
      } catch (error) {
        logError("Erreur lors de l'initialisation Firebase:", error);
      }
    };

    init();
  }, [initializeFirebase, info, warn, logError]);

  return (
    <FirebaseContext.Provider value={{ isInitialized }}>
      {children}
    </FirebaseContext.Provider>
  );
}