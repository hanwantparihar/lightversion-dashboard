import { Eye, Edit3, Trash2 } from "lucide-react";

type TableActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TableActions({ onView, onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="fc g2">
      <button
        type="button"
        className="ab"
        aria-label="View"
        onClick={onView}
      >
        <Eye size={14} />
      </button>
      <button
        type="button"
        className="ab"
        aria-label="Edit"
        onClick={onEdit}
      >
        <Edit3 size={14} />
      </button>
      <button
        type="button"
        className="ab dl"
        aria-label="Delete"
        onClick={onDelete}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
