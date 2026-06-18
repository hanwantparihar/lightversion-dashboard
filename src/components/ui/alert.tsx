import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Color map ────────────────────────────────────────────────────────────────
// All variants use CSS custom properties (--primary, --success, --warning, --info,
// --destructive) wired in src/config/colors.ts → change hex values there to
// update every alert across the project simultaneously.

const VARIANT_MAP = {
  primary: {
    default: "border-l-4 border-primary bg-primary/10 text-primary",
    outline: "border border-primary text-primary",
    solid:   "bg-primary text-primary-foreground",
  },
  success: {
    default: "border-l-4 border-success bg-success/10 text-success",
    outline: "border border-success text-success",
    solid:   "bg-success text-success-foreground",
  },
  danger: {
    default: "border-l-4 border-destructive bg-destructive/10 text-destructive",
    outline: "border border-destructive text-destructive",
    solid:   "bg-destructive text-destructive-foreground",
  },
  warning: {
    default: "border-l-4 border-warning bg-warning/10 text-warning",
    outline: "border border-warning text-warning",
    solid:   "bg-warning text-warning-foreground",
  },
  info: {
    default: "border-l-4 border-info bg-info/10 text-info",
    outline: "border border-info text-info",
    solid:   "bg-info text-info-foreground",
  },
  dark: {
    default: "border-l-4 border-foreground/40 bg-foreground/5 text-foreground",
    outline: "border border-foreground/30 text-foreground",
    solid:   "bg-foreground text-background",
  },
} as const;

export type AlertVariant   = keyof typeof VARIANT_MAP;
export type AlertStyleType = "default" | "outline" | "solid";

// ─── Alert root ───────────────────────────────────────────────────────────────

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:    AlertVariant;
  alertStyle?: AlertStyleType;
  dismissible?: boolean;
  onDismiss?:  () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant    = "primary",
      alertStyle = "default",
      dismissible,
      onDismiss,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-lg px-4 py-3 text-sm leading-relaxed",
        VARIANT_MAP[variant][alertStyle],
        dismissible && "pr-10",
        className
      )}
      {...props}
    >
      {children}

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="absolute right-3 top-3 rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
);
Alert.displayName = "Alert";

// ─── Sub-components ───────────────────────────────────────────────────────────

const AlertIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("mt-0.5 shrink-0", className)} {...props} />
));
AlertIcon.displayName = "AlertIcon";

const AlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
));
AlertContent.displayName = "AlertContent";

const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-1 font-bold leading-snug", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-3 flex flex-wrap gap-2", className)}
    {...props}
  />
));
AlertActions.displayName = "AlertActions";

export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
};
