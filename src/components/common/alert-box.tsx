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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AlertVariant } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ICONS: Record<AlertVariant, ReactNode> = {
  primary: <Info size={22} />,
  success: <CheckCircle2 size={22} />,
  danger: <XCircle size={22} />,
  warning: <AlertTriangle size={22} />,
  info: <Info size={22} />,
  dark: <ShieldCheck size={22} />,
};

const ICON_STYLES: Record<AlertVariant, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  dark: "bg-foreground/10 text-foreground",
};

const DEFAULT_TITLES: Record<AlertVariant, string> = {
  primary: "Notice",
  success: "Success",
  danger: "Error",
  warning: "Warning",
  info: "Information",
  dark: "Alert",
};

const BUTTON_VARIANTS: Record<
  AlertVariant,
  "default" | "success" | "destructive" | "warning" | "info"
> = {
  primary: "default",
  success: "success",
  danger: "destructive",
  warning: "warning",
  info: "info",
  dark: "default",
};

export interface AlertBoxProps {
  open: boolean;
  message: string;
  title?: string;
  variant?: AlertVariant;
  buttonLabel?: string;
  onClose: () => void;
}

export function AlertBox({
  open,
  message,
  title,
  variant = "primary",
  buttonLabel = "OK",
  onClose,
}: AlertBoxProps) {
  const displayTitle = title ?? DEFAULT_TITLES[variant];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm gap-0 p-0">
        <DialogHeader className="items-center space-y-0 border-0 px-6 pb-0 pt-6 text-center">
          <div
            className={cn(
              "mb-4 grid h-12 w-12 place-items-center rounded-full",
              ICON_STYLES[variant]
            )}
          >
            {ICONS[variant]}
          </div>
          <DialogTitle className="text-lg">{displayTitle}</DialogTitle>
          <DialogDescription className="pt-2 text-center text-sm text-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-center border-0 px-6 pb-6 pt-5 sm:justify-center">
          <Button
            type="button"
            size="sm"
            variant={BUTTON_VARIANTS[variant]}
            className="min-w-[88px]"
            onClick={onClose}
          >
            {buttonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
