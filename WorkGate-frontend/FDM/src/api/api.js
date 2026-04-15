const BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function loginUser(username, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ── Employees ─────────────────────────────────────────────────────────────────

export function fetchEmployees() {
  return request('/employees');
}

export function fetchManagers() {
  return request('/employees/managers');
}

export function fetchEmployeeProfile(email) {
  return request(`/employees/profile?email=${encodeURIComponent(email)}`);
}

export function updateEmployeeProfile(profile) {
  return request('/employees/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}

export function updateEmployeeSkills(email, keySkills) {
  return request('/employees/profile', {
    method: 'PUT',
    body: JSON.stringify({ email, keySkills }),
  });
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

// ── Admin ─────────────────────────────────────────────────────────────────────

export function createEmployee({ email, username, name, initials, role, tag, managerEmail, password }) {
  return request('/employees/createEmployee', {
    method: 'POST',
    body: JSON.stringify({ email, username, name, initials, role, tag, managerEmail, password }),
  });
}

export function updateEmployeeManager(email, managerEmail) {
  return request(`/employees/${encodeURIComponent(email)}/manager`, {
    method: 'PUT',
    body: JSON.stringify({ managerEmail }),
  });
}

export function deactivateEmployee(email) {
  return request(`/admin/employees/${encodeURIComponent(email)}/deactivate`, { method: 'PUT' });
}

export function reactivateEmployee(email) {
  return request(`/admin/employees/${encodeURIComponent(email)}/reactivate`, { method: 'PUT' });
}

export function deleteEmployee(email) {
  return request(`/admin/employees/${encodeURIComponent(email)}`, { method: 'DELETE' });
}

// ── IT Tickets ────────────────────────────────────────────────────────────────

export function fetchItTickets() {
  return request('/it-tickets');
}

export function createItTicket({ username, title, description, category }) {
  return request('/it-tickets', {
    method: 'POST',
    body: JSON.stringify({ username, title, description, category }),
  });
}

export function claimTicket(id, techEmail) {
  return request(`/it-tickets/${id}/claim`, {
    method: 'PUT',
    body: JSON.stringify({ techEmail }),
  });
}

export function advanceTicket(id) {
  return request(`/it-tickets/${id}/advance`, { method: 'PUT' });
}

export function unlockAccount(email) {
  return request(`/admin/employees/${encodeURIComponent(email)}/unlock`, { method: 'PUT' });
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export function fetchPosts() {
  return request('/allPosts');
}

export function createPost({ title, content, pinned, visibility, authorUsername }) {
  return request('/createPost', {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      pinned,
      visibility: visibility.toUpperCase(),
      authorUsername,
      timePosted: Date.now(),
    }),
  });
}

export function deletePost(id) {
  return request(`/posts/${id}`, { method: 'DELETE' });
}

// ── Client Codes ──────────────────────────────────────────────────────────────

export function fetchClientCodes() {
  return request('/client-codes');
}

export function addClientCode({ code, client, sector }) {
  return request('/client-codes', {
    method: 'POST',
    body: JSON.stringify({ code, client, sector }),
  });
}

export function removeClientCode(code) {
  return request(`/client-codes/${encodeURIComponent(code)}`, { method: 'DELETE' });
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
