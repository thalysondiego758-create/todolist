const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3333"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Não foi possível realizar a operação.";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      // Algumas respostas não possuem corpo JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const tasksApi = {
  list({ search = "", status = "all" } = {}) {
    const params = new URLSearchParams({ search, status });

    return request(`/api/tasks?${params.toString()}`);
  },

  create(task) {
    return request("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  update(id, changes) {
    return request(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    });
  },

  remove(id) {
    return request(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },
};