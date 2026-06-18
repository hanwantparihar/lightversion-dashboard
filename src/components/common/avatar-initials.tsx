import { cn } from "@/lib/utils";

export function AvatarInitials({
  bg,
  initials,
  src,
  className,
}: {
  bg: string;
  initials: string;
  src?: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn(
          "h-[34px] w-[34px] shrink-0 rounded-lg object-cover",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg text-[11.5px] font-extrabold text-white",
        className
      )}
      style={{ background: bg }}
    >
      {initials || "?"}
    </div>
  );
}

/** @deprecated Use AvatarInitials */
export function PI({ bg, t }: { bg: string; t: string }) {
  return <AvatarInitials bg={bg} initials={t} />;
}
