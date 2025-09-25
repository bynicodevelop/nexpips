"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useFirebase } from "@shared/hooks"; // pour récupérer getFirebaseAuth
import { useFirebaseContext } from "@shared/providers/FirebaseProvider"; // état init
import { useToast, useLog } from "@shared/hooks";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  refreshUser: async () => null,
});

export const useAuthContext = () => useContext(AuthContext);

type Props = {
  children: ReactNode;
  /**
   * Route de redirection après authentification (par défaut '/')
   */
  redirectAfterAuth?: string;
  /**
   * Route de redirection après déconnexion (par défaut '/signin')
   */
  redirectAfterSignout?: string;
  /**
   * Routes publiques accessibles sans être connecté (sinon navigation vers signin)
   * Note: on suppose que '/signin' et '/signup' sont toujours publics.
   */
  publicRoutes?: string[];
  /** Désactiver la logique de redirection automatique si besoin */
  disableRedirects?: boolean;
  /** Contenu affiché pendant le chargement initial ou pendant une redirection masquée */
  loadingFallback?: ReactNode;
};

export function AuthProvider({
  children,
  redirectAfterAuth = "/",
  redirectAfterSignout = "/signin",
  publicRoutes = ["/", "/signin", "/signup"],
  disableRedirects = false,
  loadingFallback = null,
}: Props) {
  const { getFirebaseAuth } = useFirebase();
  const { isInitialized } = useFirebaseContext();
  const { showSuccessToast, showInfoToast } = useToast();
  const { info, warn, error: logError } = useLog({ ns: "AuthProvider" });
  const router = useRouter();
  const pathname = usePathname() || "/";

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // loading initial tant qu'on n'a pas reçu le 1er event
  const previousUserRef = useRef<User | null>(null); // pour détecter transitions login/logout

  // Sets pour membership O(1) + normalisation.
  const { publicRoutesSet, authRoutesSet } = useMemo(() => {
    const normalize = (r: string) => (r === "/" ? r : r.replace(/\/$/, ""));
    const prs = new Set(publicRoutes.map(normalize));
    const auths = new Set(["/signin", "/signup"]);
    return { publicRoutesSet: prs, authRoutesSet: auths };
  }, [publicRoutes]);

  const isPublic = useCallback(
    (route: string) => {
      if (!route) return true;
      const cleaned = route === "/" ? "/" : route.replace(/\/$/, "");
      return publicRoutesSet.has(cleaned);
    },
    [publicRoutesSet]
  );

  // Expose un refresh manuel (rarement nécessaire)
  const refreshUser = useCallback(async () => {
    try {
      const auth = getFirebaseAuth();
      return auth?.currentUser ?? null;
    } catch (e) {
      logError("Erreur refreshUser", e);
      return null;
    }
  }, [getFirebaseAuth, logError]);

  // Abonnement Auth + redirections sur transition d'état
  useEffect(() => {
    if (!isInitialized) return;
    let unsub: (() => void) | undefined;
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        warn("Auth Firebase non disponible (peut-être SSR)");
        return;
      }
      unsub = onAuthStateChanged(auth, (nextUser) => {
        const prev = previousUserRef.current;
        const hasLoggedIn = !prev && nextUser;
        const hasLoggedOut = prev && !nextUser;

        // Mettre à jour état utilisateur
        setUser(nextUser);
        setLoading(false);

        if (disableRedirects) {
          previousUserRef.current = nextUser;
          return;
        }

        // Toasts sur transitions
        if (hasLoggedIn) {
          info("Utilisateur connecté", { uid: nextUser?.uid });
          showSuccessToast("Connexion réussie");
        } else if (hasLoggedOut) {
          info("Utilisateur déconnecté");
          showInfoToast("Déconnexion effectuée");
        }

        // Redirections basées sur l'état courant
        if (nextUser && authRoutesSet.has(pathname)) {
          router.replace(redirectAfterAuth);
        } else if (!nextUser && !isPublic(pathname)) {
          router.replace(redirectAfterSignout);
        }

        previousUserRef.current = nextUser;
      });
    } catch (e) {
      logError("Impossible d'attacher onAuthStateChanged", e);
      setLoading(false);
    }
    return () => unsub?.();
  }, [
    isInitialized,
    getFirebaseAuth,
    warn,
    logError,
    info,
    showSuccessToast,
    showInfoToast,
    disableRedirects,
    pathname,
    isPublic,
    router,
    redirectAfterAuth,
    redirectAfterSignout,
    authRoutesSet,
  ]);

  useEffect(() => {
    if (loading || disableRedirects) return;
    // User connecté => empêcher affichage pages auth
    if (user && authRoutesSet.has(pathname)) {
      router.replace(redirectAfterAuth);
      return;
    }
    // User déconnecté sur route protégée
    if (!user && !isPublic(pathname)) {
      router.replace(redirectAfterSignout);
    }
  }, [
    pathname,
    user,
    loading,
    disableRedirects,
    isPublic,
    router,
    redirectAfterAuth,
    redirectAfterSignout,
    authRoutesSet,
  ]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refreshUser,
    }),
    [user, loading, refreshUser]
  );

  const shouldHideContent = useMemo(() => {
    if (disableRedirects) return false;
    if (loading) return true;
    if (user && authRoutesSet.has(pathname)) return true;
    if (!user && !isPublic(pathname)) return true;
    return false;
  }, [disableRedirects, loading, user, pathname, isPublic, authRoutesSet]);

  return (
    <AuthContext.Provider value={value}>
      {shouldHideContent ? loadingFallback : children}
    </AuthContext.Provider>
  );
}
