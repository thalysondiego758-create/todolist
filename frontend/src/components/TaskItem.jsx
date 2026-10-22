import { Check, Pencil, Trash2, CalendarDays, AlertCircle } from "lucide-react";

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = String(dateString).slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const dueDate = task.due_date
    ? String(task.due_date).slice(0, 10)
    : null;

  const overdue = dueDate && dueDate < todayString && !task.completed;

  return (
    <article className={`task-item ${task.completed ? "completed" : ""}`}>
      <button
        className={`task-checkbox ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task)}
        aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
        type="button"
      >
        {task.completed && <Check size={16} />}
      </button>

      <div className="task-content">
        <span className={`task-title ${overdue ? "overdue" : ""}`}>
          {task.title}
        </span>

        {dueDate && (
          <span className={`task-date ${overdue ? "overdue-date" : ""}`}>
            <CalendarDays size={14} />
            {formatDate(dueDate)}
          </span>
        )}
      </div>

      {overdue && (
        <span className="overdue-badge">
          <AlertCircle size={13} />
          Em atraso
        </span>
      )}

      <div className="task-actions">
        <button type="button" onClick={() => onEdit(task)} aria-label="Editar tarefa">
          <Pencil size={17} />
        </button>
        <button type="button" onClick={() => onDelete(task)} aria-label="Excluir tarefa">
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}