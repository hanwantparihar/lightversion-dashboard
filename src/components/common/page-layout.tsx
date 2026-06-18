import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageStackProps = {
  children: ReactNode;
  className?: string;
};

/** Vertical page stack with consistent spacing (replaces `.sy`). */
export function PageStack({ children, className }: PageStackProps) {
  return <div className={cn("sy", className)}>{children}</div>;
}

type PageGridProps = {
  children: ReactNode;
  cols?: 2 | 3 | 4 | "31";
  className?: string;
};

/** Responsive grid layout (replaces `.gr g-* g2`). */
export function PageGrid({ children, cols = 2, className }: PageGridProps) {
  const colClass =
    cols === 4 ? "g-4" : cols === 3 ? "g-3" : cols === "31" ? "g-31" : "g-2";

  return <div className={cn("gr", colClass, "g2", className)}>{children}</div>;
}
