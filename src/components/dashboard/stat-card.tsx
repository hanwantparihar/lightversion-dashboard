"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatCardProps = {
  icon: React.ComponentType<{ size?: number }>;
  grad: string;
  value: string;
  label: string;
  change: string;
  up: boolean;
  spark: { i: number; v: number }[];
  color: string;
};

export function StatCard({
  icon: Icon,
  grad,
  value,
  label,
  change,
  up,
  spark,
  color,
}: StatCardProps) {
  const safeId = label.replace(/[^a-zA-Z]/g, "");
  return (
    <Card
      className="relative overflow-hidden border-t-[3px]"
      style={{ borderTopColor: color }}
    >
      <div className="flex items-center justify-between p-5">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl text-white"
          style={{ background: grad }}
        >
          <Icon size={22} />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold",
            up
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-rose-500/10 text-rose-500"
          )}
        >
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
      </div>
      <div className="px-5 pb-5">
        <div className="mb-1 text-[28px] font-extrabold tracking-tight">
          {value}
        </div>
        <div className="text-[13px] font-semibold text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[45px] opacity-70">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={spark}
            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`s${safeId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2.2}
              fill={`url(#s${safeId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
