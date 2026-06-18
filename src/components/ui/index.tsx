"use client";

import * as React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./card";
import { Badge } from "./badge";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Progress } from "./progress";
import { Tabs as TabsRoot, TabsList, TabsTrigger } from "./tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { CheckboxPrimitive } from "./checkbox";
import { SwitchPrimitive } from "./switch";
import { DropdownSelect } from "./dropdown-select";
import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
  type AlertVariant,
  type AlertStyleType,
} from "./alert";

export {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  Badge,
  Input,
  Textarea,
  Label,
  Progress,
  TabsList,
  TabsTrigger,
  DropdownSelect,
};

export type { DropdownOption } from "./dropdown-select";

export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
};
export type { AlertVariant, AlertStyleType };

export function Checkbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked?: boolean;
  onChange?: () => void;
  label?: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-0.5">
      <CheckboxPrimitive
        checked={checked}
        onCheckedChange={onChange}
        className="mt-0.5"
      />
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-semibold">{label}</div>}
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>
      )}
    </label>
  );
}

export function Switch({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: () => void;
}) {
  return <SwitchPrimitive checked={checked} onCheckedChange={onChange} />;
}

export function Radio({
  checked,
  onChange,
  label,
}: {
  checked?: boolean;
  onChange?: () => void;
  label?: string;
}) {
  return (
    <label
      className="flex cursor-pointer items-center gap-2.5 py-0.5"
      onClick={onChange}
    >
      <div
        className={cn(
          "grid h-4 w-4 place-items-center rounded-full border-2 border-input bg-background",
          checked && "border-primary"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-primary" />}
      </div>
      {label && <span className="text-sm font-semibold">{label}</span>}
    </label>
  );
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [local, setLocal] = useState(defaultValue ?? "");
  const current = value ?? local;
  const change = onValueChange ?? setLocal;

  return (
    <TabsRoot value={current} onValueChange={change} className={className}>
      {children}
    </TabsRoot>
  );
}

export function Modal({
  open,
  onClose,
  title,
  size = "default",
  centered,
  children,
  footer,
  staticBd,
}: {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  size?: "sm" | "default" | "lg" | "xl" | "full";
  centered?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode | false;
  staticBd?: boolean;
}) {
  const sizeClass = {
    sm: "max-w-sm",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[calc(100vw-48px)] h-[calc(100vh-48px)]",
  }[size];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent
        className={cn(sizeClass, centered && "items-center")}
        onPointerDownOutside={staticBd ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={staticBd ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle>{title}</DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-lg hover:bg-destructive hover:text-destructive-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </Button>
        </DialogHeader>
        <div className="px-5 pb-2 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
        {footer !== false && (
          <DialogFooter>
            {footer || (
              <>
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
                <Button size="sm" onClick={onClose}>
                  Save
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
