"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertBox } from "@/components/common/alert-box";
import {
  ToastNotifications,
  TOAST_DURATION_MS,
  type ToastItem,
} from "@/components/common/toast-notifications";
import type { AlertVariant } from "@/components/ui/alert";

export type ShowAlertOptions = {
  title?: string;
  variant?: AlertVariant;
  buttonLabel?: string;
};

type AlertState = {
  open: boolean;
  message: string;
  title?: string;
  variant: AlertVariant;
  buttonLabel: string;
};

type AlertContextValue = {
  showAlert: (message: string, options?: ShowAlertOptions) => void;
  showToast: (message: string, variant?: AlertVariant) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

const INITIAL_STATE: AlertState = {
  open: false,
  message: "",
  variant: "primary",
  buttonLabel: "OK",
};

export function AlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlertState>(INITIAL_STATE);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const removeToast = useCallback((id: number) => {
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: AlertVariant = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, variant, message }]);

      const timer = setTimeout(() => removeToast(id), TOAST_DURATION_MS);
      toastTimers.current.set(id, timer);
    },
    [removeToast]
  );

  const closeAlert = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const showAlert = useCallback(
    (message: string, options?: ShowAlertOptions) => {
      const variant = options?.variant ?? "primary";

      if (variant === "success") {
        showToast(message, variant);
        return;
      }

      setState({
        open: true,
        message,
        title: options?.title,
        variant,
        buttonLabel: options?.buttonLabel ?? "OK",
      });
    },
    [showToast]
  );

  const value = useMemo(
    () => ({ showAlert, showToast }),
    [showAlert, showToast]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertBox
        open={state.open}
        message={state.message}
        title={state.title}
        variant={state.variant}
        buttonLabel={state.buttonLabel}
        onClose={closeAlert}
      />
      <ToastNotifications toasts={toasts} onDismiss={removeToast} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return ctx;
}
