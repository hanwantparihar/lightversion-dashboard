"use client";

import { Card } from "@/components/ui/card";

export function Placeholder({ title }: { title?: string }) {
  return (
    <Card className="p-12 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-gradient-to-br from-primary to-primary/80 text-[28px] font-extrabold text-white shadow-lg shadow-primary/40">
        {title?.[0] || "P"}
      </div>
      <h2 className="mb-1.5 text-xl font-extrabold">{title}</h2>
      <p className="font-semibold text-muted-foreground">
        Wire this section to your data.
      </p>
    </Card>
  );
}

export function PlaceholderPage({ title }: { title: string }) {
  return <Placeholder title={title} />;
}
