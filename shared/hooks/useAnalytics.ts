import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { useLog } from "./useLog";
import { useFirebase } from "./useFirebase";

export const useAnalytics = () => {
  const { warn, info } = useLog({ ns: "Analytics" });
  const { getFirebaseAnalytics } = useFirebase();
  const isLocal =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true";

  const logEvent = (
    eventName: string,
    eventParams?: Record<string, unknown>
  ) => {
    if (isLocal) {
      info("[local]", eventName, eventParams ?? {});
      return;
    }

    const analytics = getFirebaseAnalytics();
    if (!analytics) {
      warn(
        "Analytics indisponible (non supporté, SSR, ou Firebase non initialisé)"
      );
      return;
    }
    try {
      firebaseLogEvent(analytics, eventName as any, eventParams as any);
    } catch {
      // ignorer pour ne pas casser l'UX
    }
  };

  const logPageView = (pageName?: string, extra?: Record<string, unknown>) => {
    const title = typeof document !== "undefined" ? document.title : undefined;
    const path =
      pageName ||
      (typeof window !== "undefined" ? window.location.pathname : undefined);
    const locationHref =
      typeof window !== "undefined" ? window.location.href : undefined;

    logEvent("page_view", {
      page_title: title,
      page_path: path,
      page_location: locationHref,
      ...(extra ?? {}),
    });
  };

  return {
    logEvent,
    logPageView,
  } as const;
};
