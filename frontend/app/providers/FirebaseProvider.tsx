"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useFirebase } from "@/app/hooks/useFirebase";

/**
 * Etends ce type quand tu ajouteras vraiment Firebase:
 */
type FirebaseContextType = {
  initialized: boolean;
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { initializeFirebase } = useFirebase();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeFirebase();
      setInitialized(true);
    };
    
    initialize();
  }, [initializeFirebase]);

  const value = useMemo<FirebaseContextType>(
    () => ({ initialized }),
    [initialized]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseContext() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error(
      "useFirebaseContext doit être utilisé à l'intérieur de <FirebaseProvider>."
    );
  }
  return ctx;
}