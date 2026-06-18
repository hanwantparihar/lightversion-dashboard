import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type ChartCardProps = {
  title: string;
  description?: string;
  height?: number;
  headerExtra?: ReactNode;
  children: ReactNode;
};

export function ChartCard({
  title,
  description,
  height = 280,
  headerExtra,
  children,
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader
        className={
          headerExtra
            ? "flex flex-row items-start justify-between space-y-0"
            : undefined
        }
      >
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {headerExtra}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>{children}</div>
      </CardContent>
    </Card>
  );
}
