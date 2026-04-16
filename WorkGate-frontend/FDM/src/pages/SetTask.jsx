import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchEmployees, fetchMyTasks, mapTask } from '../api/api';
import '../styles/components.css';
import styles from './SetTask.module.css';

const EMPTY_FORM = { title: '', priority: 'medium', type: 'Operational', due: '', description: '' };

export default function SetTask() {
  const { currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchEmployees().then(setEmployees).catch(() => {});
  }, []);

  const visibleEmployees = employees.filter(e => e.managerEmail?.toLowerCase() === currentUser?.email?.toLowerCase());

  const refreshTasks = useCallback(() => {
    if (visibleEmployees.length === 0) return;
    setTasksLoading(true);
    Promise.all(visibleEmployees.map(emp => fetchMyTasks(emp.email).catch(() => [])))
      .then(results => {
        const emailToEmp = Object.fromEntries(visibleEmployees.map(e => [e.email?.toLowerCase(), e]));
        const flat = results.flat().map(t => ({
          ...mapTask(t),
          employeeEmail: t.employeeEmail,
          emp: emailToEmp[t.employeeEmail?.toLowerCase()],
        }));
        flat.sort((a, b) => {
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(a.due) - new Date(b.due);
        });
        setAssignedTasks(flat);
      })
      .finally(() => setTasksLoading(false));
  }, [visibleEmployees.map(e => e.email).join(',')]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const getEmployeeName = (emp) => {
    if (!emp) return '';
    const firstName = emp.firstName ?? emp.name ?? '';
    const lastName = emp.lastName ?? emp.surname ?? '';
    if (firstName || lastName) return [firstName, lastName].filter(Boolean).join(' ');
    return emp.name ?? '';
  };

  const isPastDue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const validateForm = () => {
    const errors = [];
    if (!selected) errors.push('Select an employee before assigning a task.');
    if (form.title.trim().length < 3) errors.push('Title must be at least 3 characters.');
    if (form.description.trim().length < 10) errors.push('Description must be at least 10 characters.');
    if (!form.due) errors.push('Due date is required.');
    else if (isPastDue(form.due)) errors.push('Due date cannot be in the past.');
    return errors;
  };

  const filtered = search.trim()
    ? visibleEmployees.filter(e => {
      const query = search.toLowerCase();
      const name = getEmployeeName(e).toLowerCase();
      return name.includes(query) || e.email?.toLowerCase().includes(query);
    })
    : [];

  const selectEmployee = (emp) => { setSelected(emp); setSearch(''); };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const createRequest = async (title, priority, content, category, due, employee) => {
    const request = {
      employeeName: employee?.email ?? getEmployeeName(employee),
      description: content,
      title,
      priority: priority.toUpperCase(),
      category: category.toUpperCase(),
      dueDate: due,
    };

    const response = await fetch('http://localhost:8080/api/newTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to create ticket');
    }

    return response.text();
  };

  const submit = async () => {
    const errors = validateForm();
    if (errors.length) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setSubmitError(null);

    try {
      await createRequest(form.title, form.priority, form.description, form.type, form.due, selected);
    } catch (error) {
      setSubmitError(error.message);
      return;
    }

    setForm(EMPTY_FORM);
    setSelected(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    refreshTasks();
  };

  return (
    <div className="animate-fade">
      <div className={styles.layout}>

        {/* Left — assign form */}
        <div className="card">
          <div className="card-header"><span className="card-title">Assign Task</span></div>
          <div className={styles.formBody}>

            <div className={`form-group ${styles.employeeSearch}`}>
              <label>Employee</label>
              {selected ? (
                <div className={styles.selectedEmployee}>
                  <div className={styles.selectedAvatar}>{selected.initials}</div>
                  <div className={styles.selectedInfo}>
                    <div className={styles.selectedName}>{getEmployeeName(selected)}</div>
                    <div className={styles.selectedMeta}>{selected.role}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Change</button>
                </div>
              ) : (
                <>
                  <input className="field" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} autoComplete="off" />
                  {filtered.length > 0 && (
                    <div className={styles.dropdown}>
                      {filtered.map(emp => (
                        <div key={emp.id} className={styles.dropdownItem} onClick={() => selectEmployee(emp)}>
                          <div className={styles.dropdownAvatar}>{emp.initials}</div>
                          <div>
                            <div className={styles.dropdownName}>{getEmployeeName(emp)}</div>
                            <div className={styles.dropdownMeta}>{emp.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {search.trim() && filtered.length === 0 && (
                    <div className={styles.noResults}>No employees found.</div>
                  )}
                </>
              )}
            </div>

            <div className="form-group">
              <label>Task Title</label>
              <input className="field" placeholder="e.g. Complete onboarding checklist" {...field('title')} />
            </div>

            <div className={styles.twoCol}>
              <div className="form-group">
                <label>Priority</label>
                <select className="field" {...field('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="field" {...field('type')}>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Operational">Operational</option>
                  <option value="Upskilling">Upskilling</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input className="field" type="date" {...field('due')} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="field" style={{ minHeight: 130 }} placeholder="Describe the task in detail…" {...field('description')} />
            </div>

            {validationErrors.length > 0 && (
              <div className={styles.errorBanner}>
                {validationErrors.map((err, idx) => <div key={idx}>{err}</div>)}
              </div>
            )}
            {submitError && <div className={styles.errorBanner}>{submitError}</div>}

            <button className={`btn btn-primary ${styles.assignBtn}`} onClick={submit}>
              Assign Task
            </button>
          </div>
        </div>

        {/* Right — all assigned tasks */}
        <div className={`card ${styles.assignedCard}`}>
          <div className="card-header"><span className="card-title">Assigned Tasks</span></div>
          <div className={styles.recentBody}>
            {tasksLoading && <div className={styles.recentEmpty}>Loading…</div>}
            {!tasksLoading && assignedTasks.length === 0 && (
              <div className={styles.recentEmpty}>No tasks assigned to your employees yet.</div>
            )}
            {!tasksLoading && assignedTasks.map(t => (
              <div key={t.id} className={`${styles.recentItem} ${t.done ? styles.recentDone : ''}`}>
                <div className={styles.recentHeader}>
                  <span className={styles.recentTitle}>{t.title}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className={`pill pill-${t.priority}`}>{t.priority.toUpperCase()}</span>
                    {t.done
                      ? <span className={styles.completedBadge}>✓ Done</span>
                      : <span className={styles.pendingBadge}>Pending</span>}
                  </div>
                </div>
                <div className={styles.recentMeta}>
                  → {getEmployeeName(t.emp) || t.employeeEmail} · {t.type}{t.due ? ` · Due ${new Date(t.due + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
                </div>
                {t.description && <div className={styles.recentDesc}>{t.description}</div>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}