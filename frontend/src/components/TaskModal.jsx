import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function TaskModal({ open, task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editing = Boolean(task);

  useEffect(() => {
    if (!open) return;

    setTitle(task?.title ?? "");
    setDueDate(
      task?.due_date ? String(task.due_date).slice(0, 10) : ""
    );
    setError("");
    setSaving(false);
  }, [open, task]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("O título da tarefa é obrigatório.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        title: title.trim(),
        dueDate: dueDate || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Não foi possível salvar a tarefa.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <header className="modal-header">
          <h2 id="task-modal-title">
            {editing ? "Edit Task" : "Create Task"}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <label htmlFor="task-title">Task name</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            maxLength={255}
            autoFocus
          />

          <label htmlFor="task-due-date">Due date (optional)</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />

          {error && <p className="form-error" role="alert">{error}</p>}

          <footer className="modal-footer">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save changes" : "Create task"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}