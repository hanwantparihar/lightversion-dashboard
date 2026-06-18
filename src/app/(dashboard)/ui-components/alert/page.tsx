"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Rocket,
  RefreshCw,
} from "lucide-react";
import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
  type AlertVariant,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ICONS: Record<AlertVariant, ReactNode> = {
  primary: <Info size={16} />,
  success: <CheckCircle2 size={16} />,
  danger:  <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info:    <Info size={16} />,
  dark:    <ShieldCheck size={16} />,
};

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader
        className={action ? "flex-row items-start justify-between space-y-0 pb-3" : "pb-3"}
      >
        <div className="space-y-1">
          <CardTitle className="text-[15px]">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">{children}</CardContent>
    </Card>
  );
}

// ─── Dismissible alert data ───────────────────────────────────────────────────

const DISMISSIBLE: {
  id: string;
  variant: AlertVariant;
  message: string;
}[] = [
  { id: "d1", variant: "success", message: "Your profile has been updated successfully!" },
  { id: "d2", variant: "danger",  message: "Failed to upload file. Maximum size is 10MB." },
  { id: "d3", variant: "warning", message: "Your session will expire in 5 minutes. Save your work." },
  { id: "d4", variant: "info",    message: "Tip: You can use keyboard shortcuts for faster navigation." },
];

// ─── Toast type ───────────────────────────────────────────────────────────────

type ToastItem = { id: number; variant: AlertVariant; message: string };

const TOAST_MESSAGES: Record<AlertVariant, string> = {
  primary: "Primary notification for the user.",
  success: "Operation completed successfully!",
  danger:  "An error occurred. Please try again.",
  warning: "Warning: Your session is about to expire.",
  info:    "Info: A new update is available.",
  dark:    "System maintenance message.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AlertPage() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [toasts,    setToasts]    = useState<ToastItem[]>([]);

  const dismiss       = (id: string) => setDismissed((p) => new Set([...p, id]));
  const resetSection  = ()           => setDismissed(new Set());
  const resetAll      = ()           => { setDismissed(new Set()); setToasts([]); };

  function addToast(variant: AlertVariant) {
    const id = Date.now();
    setToasts((p) => [...p, { id, variant, message: TOAST_MESSAGES[variant] }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }

  const removeToast = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  const allDismissed = DISMISSIBLE.every((a) => dismissed.has(a.id));

  return (
    <div className="space-y-6">

      {/* ── Page-level Reset All ─────────────────────────────────────── */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RefreshCw size={13} />
          Reset All
        </Button>
      </div>

      {/* ── 1. Default Alerts ────────────────────────────────────────── */}
      <SectionCard
        title="Default Alerts"
        description="Standard alerts for different message types with left border accent."
      >
        <Alert variant="primary">
          <AlertIcon>{ICONS.primary}</AlertIcon>
          <AlertContent>
            <strong>Primary:</strong> This is a primary alert with important information for the user.
          </AlertContent>
        </Alert>

        <Alert variant="success">
          <AlertIcon>{ICONS.success}</AlertIcon>
          <AlertContent>
            <strong>Success:</strong> Your changes have been saved successfully. Everything is up to date.
          </AlertContent>
        </Alert>

        <Alert variant="danger">
          <AlertIcon>{ICONS.danger}</AlertIcon>
          <AlertContent>
            <strong>Danger:</strong> There was an error processing your request. Please try again later.
          </AlertContent>
        </Alert>

        <Alert variant="warning">
          <AlertIcon>{ICONS.warning}</AlertIcon>
          <AlertContent>
            <strong>Warning:</strong> Your subscription will expire in 3 days. Please renew to continue.
          </AlertContent>
        </Alert>

        <Alert variant="info">
          <AlertIcon>{ICONS.info}</AlertIcon>
          <AlertContent>
            <strong>Info:</strong> A new software update is available. Version 2.5.0 includes performance improvements.
          </AlertContent>
        </Alert>

        <Alert variant="dark">
          <AlertIcon>{ICONS.dark}</AlertIcon>
          <AlertContent>
            <strong>Dark:</strong> System maintenance is scheduled for this weekend. Plan accordingly.
          </AlertContent>
        </Alert>
      </SectionCard>

      {/* ── 2. Dismissible Alerts ────────────────────────────────────── */}
      <SectionCard
        title="Dismissible Alerts"
        description="Click the close button to dismiss each alert. Use the Reset button to restore them."
        action={
          <Button variant="outline" size="sm" onClick={resetSection} className="shrink-0">
            <RefreshCw size={13} />
            Reset
          </Button>
        }
      >
        {DISMISSIBLE.map((a) =>
          dismissed.has(a.id) ? null : (
            <Alert
              key={a.id}
              variant={a.variant}
              dismissible
              onDismiss={() => dismiss(a.id)}
            >
              <AlertIcon>{ICONS[a.variant]}</AlertIcon>
              <AlertContent>{a.message}</AlertContent>
            </Alert>
          )
        )}

        {allDismissed && (
          <p className="py-3 text-center text-sm text-muted-foreground">
            All alerts dismissed.{" "}
            <button
              type="button"
              onClick={resetSection}
              className="font-semibold text-primary hover:underline"
            >
              Reset
            </button>{" "}
            to restore them.
          </p>
        )}
      </SectionCard>

      {/* ── 3. Alerts with Links  |  Alerts with Rich Content ────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Alerts with Links */}
        <SectionCard title="Alerts with Links">
          <Alert variant="primary">
            <AlertIcon>{ICONS.primary}</AlertIcon>
            <AlertContent>
              A new version is available.{" "}
              <a href="#" className="font-bold underline underline-offset-2 hover:opacity-80">
                Update now
              </a>
            </AlertContent>
          </Alert>

          <Alert variant="success">
            <AlertIcon>{ICONS.success}</AlertIcon>
            <AlertContent>
              Account verified.{" "}
              <a href="#" className="font-bold underline underline-offset-2 hover:opacity-80">
                Go to dashboard
              </a>
            </AlertContent>
          </Alert>

          <Alert variant="danger">
            <AlertIcon>{ICONS.danger}</AlertIcon>
            <AlertContent>
              Payment failed.{" "}
              <a href="#" className="font-bold underline underline-offset-2 hover:opacity-80">
                Retry payment
              </a>
            </AlertContent>
          </Alert>
        </SectionCard>

        {/* Alerts with Rich Content */}
        <SectionCard title="Alerts with Rich Content">
          <Alert variant="success">
            <AlertIcon className="mt-1">{ICONS.success}</AlertIcon>
            <AlertContent>
              <AlertTitle>Order Confirmed!</AlertTitle>
              <AlertDescription>
                Your order #ORD-1847 has been placed successfully. You will receive a
                confirmation email shortly with tracking details. Expected delivery:
                March 7, 2026.
              </AlertDescription>
              <AlertActions>
                <Button size="sm" variant="success">Track Order</Button>
              </AlertActions>
            </AlertContent>
          </Alert>

          <Alert variant="warning">
            <AlertIcon className="mt-1">{ICONS.warning}</AlertIcon>
            <AlertContent>
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                Your account security needs attention. We detected an unusual login from
                a new device. Please verify your identity to continue using all features.
              </AlertDescription>
              <AlertActions>
                <Button size="sm" variant="warning">Verify Now</Button>
                <Button size="sm" variant="outline">Not Me</Button>
              </AlertActions>
            </AlertContent>
          </Alert>
        </SectionCard>

      </div>

      {/* ── 4. Outlined Alerts ───────────────────────────────────────── */}
      <SectionCard
        title="Outlined Alerts"
        description="Lighter alerts with just a colored border for a more subtle appearance."
      >
        <Alert variant="primary" alertStyle="outline">
          <AlertIcon>{ICONS.primary}</AlertIcon>
          <AlertContent>This is an outlined primary alert. Clean and minimal styling.</AlertContent>
        </Alert>

        <Alert variant="success" alertStyle="outline">
          <AlertIcon>{ICONS.success}</AlertIcon>
          <AlertContent>Operation completed successfully with outlined styling.</AlertContent>
        </Alert>

        <Alert variant="danger" alertStyle="outline">
          <AlertIcon>{ICONS.danger}</AlertIcon>
          <AlertContent>An error occurred. This is an outlined danger alert variant.</AlertContent>
        </Alert>

        <Alert variant="warning" alertStyle="outline">
          <AlertIcon>{ICONS.warning}</AlertIcon>
          <AlertContent>Caution required. Outlined warning alert for less critical messages.</AlertContent>
        </Alert>
      </SectionCard>

      {/* ── 5. Solid Alerts ──────────────────────────────────────────── */}
      <SectionCard
        title="Solid Alerts"
        description="Solid background alerts for maximum visibility and emphasis."
      >
        <Alert variant="primary" alertStyle="solid">
          <AlertIcon>{ICONS.primary}</AlertIcon>
          <AlertContent>This is a solid primary alert with white text on colored background.</AlertContent>
        </Alert>

        <Alert variant="success" alertStyle="solid">
          <AlertIcon>{ICONS.success}</AlertIcon>
          <AlertContent>Success! All systems are operational and running smoothly.</AlertContent>
        </Alert>

        <Alert variant="danger" alertStyle="solid">
          <AlertIcon>{ICONS.danger}</AlertIcon>
          <AlertContent>Critical error detected. Immediate action is required.</AlertContent>
        </Alert>

        <Alert variant="warning" alertStyle="solid">
          <AlertIcon>{ICONS.warning}</AlertIcon>
          <AlertContent>Warning: Storage usage is approaching 90% capacity.</AlertContent>
        </Alert>

        <Alert variant="info" alertStyle="solid">
          <AlertIcon><Rocket size={16} /></AlertIcon>
          <AlertContent>New feature launched! Check out the improved dashboard analytics.</AlertContent>
        </Alert>
      </SectionCard>

      {/* ── 6. Toast Notifications ───────────────────────────────────── */}
      <SectionCard
        title="Toast Notifications"
        description="Click a button to show a toast notification that auto-hides after 4 seconds."
      >
        <div className="flex flex-wrap gap-2.5">
          <Button size="sm" variant="success" onClick={() => addToast("success")}>
            <CheckCircle2 size={14} />
            Success Toast
          </Button>
          <Button size="sm" variant="destructive" onClick={() => addToast("danger")}>
            <XCircle size={14} />
            Error Toast
          </Button>
          <Button size="sm" variant="warning" onClick={() => addToast("warning")}>
            <AlertTriangle size={14} />
            Warning Toast
          </Button>
          <Button size="sm" variant="info" onClick={() => addToast("info")}>
            <Info size={14} />
            Info Toast
          </Button>
        </div>
      </SectionCard>

      {/* ── Toast container (fixed, bottom-right) ────────────────────── */}
      {toasts.length > 0 && (
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
              onDismiss={() => removeToast(t.id)}
              className="shadow-lg"
            >
              <AlertIcon>{ICONS[t.variant]}</AlertIcon>
              <AlertContent>{t.message}</AlertContent>
            </Alert>
          ))}
        </div>
      )}

    </div>
  );
}
