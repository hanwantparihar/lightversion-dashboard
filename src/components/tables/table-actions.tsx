import { Eye, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type TableActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TableActions({ onView, onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="fc g2">
      <Button
        type="button"
        variant="info"
        size="icon"
        aria-label="View"
        onClick={onView}
      >
        <Eye />
      </Button>
      <Button
        type="button"
        variant="success"
        size="icon"
        aria-label="Edit"
        onClick={onEdit}
      >
        <Edit3 />
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        aria-label="Delete"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
