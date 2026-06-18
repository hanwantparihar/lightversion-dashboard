export function AvatarInitials({ bg, initials }: { bg: string; initials: string }) {
  return (
    <div
      className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg text-[11.5px] font-extrabold text-white"
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
}

/** @deprecated Use AvatarInitials */
export function PI({ bg, t }: { bg: string; t: string }) {
  return <AvatarInitials bg={bg} initials={t} />;
}
