"use client";

import { NOTIFICATION_TYPES, NotificationType } from "@/types/notifications";

type ShowToastOptions = {
  message: string;
  type?: NotificationType;
  duration?: number;
  id?: string;
};

export const useToast = () => {
  const emit = ({
    message,
    type = NOTIFICATION_TYPES.success,
    duration = 5000,
    id,
  }: ShowToastOptions) => {
    if (typeof window === "undefined") return;
    const event = new CustomEvent("app:toast", {
      detail: { id, message, type, duration },
    });
    window.dispatchEvent(event);
  };

  const showToast = (
    message: string,
    opts?: Omit<ShowToastOptions, "message">
  ) => emit({ message, ...opts });

  const showSuccessToast = (message: string, duration?: number) =>
    emit({ message, type: NOTIFICATION_TYPES.success, duration });

  const showErrorToast = (message: string, duration?: number) =>
    emit({ message, type: NOTIFICATION_TYPES.error, duration });

  const showInfoToast = (message: string, duration?: number) =>
    emit({ message, type: NOTIFICATION_TYPES.info, duration });

  const showWarningToast = (message: string, duration?: number) =>
    emit({ message, type: NOTIFICATION_TYPES.warning, duration });

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
};
