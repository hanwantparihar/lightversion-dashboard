export function RingChart({
  pct,
  color,
  size = 72,
  stroke = 6,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const ci = 2 * Math.PI * r;
  const off = ci * (1 - pct / 100);
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={ci}
          strokeDashoffset={off}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-600"
        />
      </svg>
      <span className="absolute text-sm font-extrabold">{pct}%</span>
    </div>
  );
}

/** @deprecated Use RingChart */
export function Ring(props: Parameters<typeof RingChart>[0]) {
  return <RingChart {...props} />;
}
