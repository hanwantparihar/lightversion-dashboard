"use client";

import { PageStack, KanbanBoard } from "@/components";
import { initialKanbanBoard } from "@/lib/kanban-data";

export default function KanbanPage() {
  return (
    <PageStack>
      <KanbanBoard initialColumns={initialKanbanBoard} />
    </PageStack>
  );
}
