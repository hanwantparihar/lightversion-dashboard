"use client";

import { PageStack, KanbanBoard } from "@/components";
import { initialPipeline } from "@/lib/crm-data";

export default function PipelinePage() {
  return (
    <PageStack>
      <KanbanBoard
        initialColumns={initialPipeline}
        title="Sales Pipeline"
        enableDragDrop
      />
    </PageStack>
  );
}
