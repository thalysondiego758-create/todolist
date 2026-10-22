import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  ListTodo,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

import { tasksApi } from "./services/api";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await tasksApi.list({ search, status });

      setTasks(data.tasks);
      setTotal(Number(data.total) || 0);
      setCompleted(Number(data.completed) || 0);
    } catch (err) {
      setError(err.message || "Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleSave(taskData) {
    if (editingTask) {
      await tasksApi.update(editingTask.id, taskData);
    } else {
      await tasksApi.create(taskData);
    }

    setModalOpen(false);
    setEditingTask(null);
    await loadTasks();
  }

  async function handleToggle(task) {
    try {
      await tasksApi.update(task.id, {
        completed: !Boolean(task.completed),
      });
      await loadTasks();
    } catch (err) {
      setError(err.message || "Não foi possível atualizar a tarefa.");
    }
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(
      `Deseja excluir a tarefa "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      await tasksApi.remove(task.id);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Não foi possível excluir a tarefa.");
    }
  }

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Taskflow - início">
          <span className="brand-icon"><ListTodo size={23} /></span>
          <span>Taskflow<span className="brand-dot">.</span></span>
        </a>

        <span className="topbar-label">PERSONAL WORKSPACE</span>
      </header>

      <section className="dashboard">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>My Tasks<span>.</span></h1>
            <p className="page-description">
              Organize your day, one task at a time.
            </p>
          </div>

          <button className="button-primary desktop-create" onClick={openCreateModal}>
            <Plus size={18} /> New Task
          </button>
        </div>

        <section className="stats-grid" aria-label="Resumo das tarefas">
          <article className="stat-card">
            <div className="stat-icon purple"><ClipboardList size={20} /></div>
            <div>
              <p>Total tasks</p>
              <strong>{total}</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon green"><CheckCircle2 size={20} /></div>
            <div>
              <p>Completed</p>
              <strong>{completed}</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon orange"><ListTodo size={20} /></div>
            <div>
              <p>Pending</p>
              <strong>{Math.max(0, total - completed)}</strong>
            </div>
          </article>
        </section>

        <section className="tasks-panel">
          <div className="tasks-panel-heading">
            <div>
              <h2>Tasks</h2>
              <p>Manage and track your progress</p>
            </div>

            <button
              className="icon-button refresh-button"
              onClick={loadTasks}
              disabled={loading}
              aria-label="Atualizar tarefas"
              title="Atualizar"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search tasks..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                aria-label="Buscar tarefas"
              />
            </div>

            <div className="filter-tabs" aria-label="Filtrar tarefas">
              <button
                className={status === "pending" ? "active" : ""}
                onClick={() => setStatus("pending")}
              >
                Pending
              </button>
              <button
                className={status === "all" ? "active" : ""}
                onClick={() => setStatus("all")}
              >
                All tasks
              </button>
              <button
                className={status === "completed" ? "active" : ""}
                onClick={() => setStatus("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button onClick={loadTasks}>Tentar novamente</button>
            </div>
          )}

          <TaskList
            tasks={tasks}
            loading={loading}
            search={search}
            status={status}
            onToggle={handleToggle}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />

          {!loading && tasks.length > 0 && (
            <footer className="list-footer">
              Showing {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              <span>{completed} of {total} completed</span>
            </footer>
          )}
        </section>
      </section>

      <button
        className="floating-add"
        onClick={openCreateModal}
        aria-label="Criar tarefa"
        title="Criar tarefa"
      >
        <Plus size={27} />
      </button>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
      />
    </main>
  );
}