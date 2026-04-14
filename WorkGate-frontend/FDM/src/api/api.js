const BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function loginUser(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ── Employees ─────────────────────────────────────────────────────────────────

export function fetchEmployees() {
  return request('/employees');
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export function fetchMyTasks(email) {
  return request(`/tasks/employee/${encodeURIComponent(email)}`);
}

export function assignTask({ managerEmail, employeeEmail, title, description, priority, dueDate, category }) {
  return request('/tasks/assign', {
    method: 'POST',
    body: JSON.stringify({ managerEmail, employeeEmail, title, description, priority, dueDate, category }),
  });
}

export function updateTask(taskId, { employeeEmail, title, description, priority, dueDate, category }) {
  return request(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({ employeeEmail, title, description, priority, dueDate, category }),
  });
}

export function completeTask(taskId, employeeEmail) {
  return request(`/tasks/${taskId}/complete`, {
    method: 'PUT',
    body: JSON.stringify({ employeeEmail }),
  });
}

export function deleteTask(taskId, employeeEmail) {
  return request(`/tasks/${taskId}`, {
    method: 'DELETE',
    body: JSON.stringify({ employeeEmail }),
  });
}

// ── Field mapping: backend Task → frontend task shape ─────────────────────────

export function mapTask(t) {
  return {
    id: t.taskId,
    title: t.title,
    description: t.description ?? '',
    done: t.completion,
    priority: t.priority?.toLowerCase() ?? 'medium',
    due: t.dueDate ?? '',
    type: t.category ?? 'Operational',
  };
}
