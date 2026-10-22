
import { ClipboardList } from "lucide-react";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  loading,
  search,
  status,
  onToggle,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return <div className="list-message">Carregando tarefas...</div>;
  }

  if (tasks.length === 0) {
    if (search.trim()) {
      return (
        <div className="empty-state">
          <ClipboardList size={40} />
          <h3>No tasks found</h3>
          <p>Try another search term.</p>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="empty-state">
          <ClipboardList size={40} />
          <h3>You have no pending tasks.</h3>
        </div>
      );
    }

    return (
      <div className="empty-state">
        <ClipboardList size={40} />
        <h3>No tasks yet</h3>
        <p>Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}