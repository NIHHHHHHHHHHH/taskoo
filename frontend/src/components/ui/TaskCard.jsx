import { Trash2, Edit2, CheckCircle2, Circle } from "lucide-react";

export default function TaskCard({
  task,
  onDelete,
  onEdit,
  onToggleStatus,
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => onToggleStatus(task._id)} className="text-text-muted hover:text-primary transition-colors">
              {task.status === "completed" ? (
                <CheckCircle2 size={20} className="text-success" />
              ) : (
                <Circle size={20} />
              )}
            </button>
            <h3 className={`font-semibold ${task.status === "completed" ? "line-through text-text-muted" : "text-text"}`}>{task.title}</h3>
          </div>
          {task.description && (<p className="text-sm text-text-muted ml-7">{task.description}</p>)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(task)} className="text-text-muted hover:text-primary transition-colors">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(task._id)} className="text-text-muted hover:text-danger transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}