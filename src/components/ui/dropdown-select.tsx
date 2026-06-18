"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_VALUE = "__dropdown_empty__";

export type DropdownOption = {
  value: string;
  label: string;
};

export interface DropdownSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
}

function toInternalValue(value: string) {
  return value === "" ? EMPTY_VALUE : value;
}

function toExternalValue(value: string) {
  return value === EMPTY_VALUE ? "" : value;
}

function normalizeOptions(options: DropdownOption[]) {
  return options.map((option) =>
    option.value === ""
      ? { ...option, value: EMPTY_VALUE }
      : option
  );
}

export function DropdownSelect({
  value,
  onChange,
  options,
  className,
  style,
  placeholder = "Select…",
  disabled,
}: DropdownSelectProps) {
  const normalizedOptions = normalizeOptions(options);
  const internalValue = toInternalValue(value);

  return (
    <SelectPrimitive.Root
      value={internalValue}
      onValueChange={(next) => onChange(toExternalValue(next))}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-muted/50 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={style}
        aria-label={placeholder}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          position="popper"
          sideOffset={4}
        >
          <SelectPrimitive.Viewport className="p-1">
            {normalizedOptions.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check size={14} className="text-primary" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}