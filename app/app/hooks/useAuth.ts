import { useFirebase, useToast } from "@shared/hooks";
import { AuthFormSchema } from "@/validators/auth-form";
import type { AuthForm } from "@/types/auth-form";
import { ZodError } from "zod";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

type Credentials = AuthForm;

export const useAuth = () => {
  const { getFirebaseAuth } = useFirebase();
  const { showErrorToast } = useToast();

  const ensureAuth = () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase Auth non initialisé.");
    return auth;
  };

  const runAuth = async <T>(op: () => Promise<T>): Promise<T> => {
    try {
      return await op();
    } catch (e) {
      showErrorToast("Une erreur est survenue");
      throw e;
    }
  };

  const validateOrToast = (credentials: Credentials): boolean => {
    try {
      AuthFormSchema.parse(credentials);
      return true;
    } catch (e: unknown) {
      let msg = "Email ou mot de passe invalide.";
      if (e instanceof ZodError) {
        msg = e.issues[0]?.message ?? msg;
      }
      showErrorToast(msg);
      return false;
    }
  };

  const signin = async ({ email, password }: Credentials): Promise<void> => {
    if (!validateOrToast({ email, password })) return;
    await runAuth(() => {
      const auth = ensureAuth();
      return signInWithEmailAndPassword(auth, email, password);
    });
  };

  const signup = async ({ email, password }: Credentials): Promise<void> => {
    if (!validateOrToast({ email, password })) return;
    await runAuth(() => {
      const auth = ensureAuth();
      console.log(auth);

      return createUserWithEmailAndPassword(auth, email, password);
    });
  };

  const signout = async (): Promise<void> => {
    return runAuth(async () => {
      const auth = ensureAuth();
      await signOut(auth);
    });
  };

  return { signin, signup, signout };
};
