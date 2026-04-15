import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchEmployees } from '../api/api';
import '../styles/components.css';
import styles from './SetTask.module.css';

const EMPTY_FORM = { title: '', priority: 'medium', type: 'Operational', due: '', description: '' };

export default function SetTask() {
  const { currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [assigned, setAssigned] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchEmployees().then(setEmployees).catch(() => {});
  }, []);

  const getEmployeeName = (emp) => {
    if (!emp) return '';
    const firstName = emp.firstName ?? emp.name ?? '';
    const lastName = emp.lastName ?? emp.surname ?? '';
    if (firstName || lastName) return [firstName, lastName].filter(Boolean).join(' ');
    return emp.name ?? '';
  };

  const visibleEmployees = employees.filter(e => e.managerEmail?.toLowerCase() === currentUser?.email?.toLowerCase());

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

    setAssigned(prev => [{
      id: `t-mgr-${Date.now()}`,
      employee: selected,
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      type: form.type,
      due: form.due,
    }, ...prev]);

    setForm(EMPTY_FORM);
    setSelected(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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

        {/* Right — recently assigned */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header"><span className="card-title">Recently Assigned</span></div>
          <div className={styles.recentBody}>
            {assigned.length === 0 && <div className={styles.recentEmpty}>No tasks assigned yet this session.</div>}
            {assigned.map(t => (
              <div key={t.id} className={styles.recentItem}>
                <div className={styles.recentHeader}>
                  <span className={styles.recentTitle}>{t.title}</span>
                  <span className={`pill pill-${t.priority}`}>{t.priority.toUpperCase()}</span>
                </div>
                <div className={styles.recentMeta}>→ {getEmployeeName(t.employee)} · {t.type} · Due {t.due}</div>
                <div className={styles.recentDesc}>{t.description}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
