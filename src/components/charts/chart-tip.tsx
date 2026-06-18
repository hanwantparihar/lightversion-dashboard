"use client";

export function ChartTip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string; fill?: string }[];
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-xs font-semibold shadow-lg">
      {label != null && (
        <div className="mb-1 text-[11.5px] text-muted-foreground">{label}</div>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ background: p.color || p.fill }}
          />
          <span className="capitalize">{p.name}:</span>
          <b className="ml-auto pl-3">
            {prefix}
            {typeof p.value === "number"
              ? p.value.toLocaleString()
              : p.value}
            {suffix}
          </b>
        </div>
      ))}
    </div>
  );
}
