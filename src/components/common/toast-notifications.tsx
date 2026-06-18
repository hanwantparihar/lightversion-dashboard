"use client";

import type { ReactNode } from "react";
import {
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import {
  Alert,
  AlertIcon,
  AlertContent,
  type AlertVariant,
} from "@/components/ui/alert";

export type ToastItem = {
  id: number;
  variant: AlertVariant;
  message: string;
};

export const TOAST_DURATION_MS = 4000;

const ICONS: Record<AlertVariant, ReactNode> = {
  primary: <Info size={16} />,
  success: <CheckCircle2 size={16} />,
  danger: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
  dark: <ShieldCheck size={16} />,
};

export interface ToastNotificationsProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastNotifications({ toasts, onDismiss }: ToastNotificationsProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex w-[340px] flex-col gap-2"
    >
      {toasts.map((t) => (
        <Alert
          key={t.id}
          variant={t.variant}
          dismissible
          onDismiss={() => onDismiss(t.id)}
          className="shadow-lg"
        >
          <AlertIcon>{ICONS[t.variant]}</AlertIcon>
          <AlertContent>{t.message}</AlertContent>
        </Alert>
      ))}
    </div>
  );
}
