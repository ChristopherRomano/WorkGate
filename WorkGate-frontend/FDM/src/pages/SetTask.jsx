import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchEmployees, assignTask } from '../api/api';
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
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchEmployees().then(setEmployees).catch(() => {});
  }, []);

  const filtered = search.trim()
    ? employees.filter(e => e.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const selectEmployee = (emp) => { setSelected(emp); setSearch(''); };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const canSubmit = selected && form.title.trim() && form.description.trim() && form.due;

  const createRequest = async (title,priority,content,category) => {
  
      const request = {
          employeeName: "john",
          description : content,
          title: title,
          priority: priority.toUpperCase(),
          category: category.toUpperCase(),
      };
      try {
          const response = await fetch("http://localhost:8080/api/newTask", {
              method: "POST",
              headers: {
              "Content-Type": "application/json"
              },
              body: JSON.stringify(request)
          });
          if (!response.ok) {
              throw new Error("Failed to create ticket");
          }
          } 
      catch (error) {
          console.error(error);
      }
    };

  const submit = () => {
    if (!canSubmit) return;
    setAssigned(prev => [{
      id: `t-mgr-${Date.now()}`,
      employee: selected,
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      type: form.type,
      due: form.due,
    }, ...prev]);
    createRequest(form.title,form.priority,form.description,form.type);
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
                    <div className={styles.selectedName}>{selected.name}</div>
                    <div className={styles.selectedMeta}>{selected.role}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Change</button>
                </div>
              ) : (
                <>
                  <input className="field" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} autoComplete="off" />
                  {filtered.length > 0 && (
                    <div className={styles.dropdown}>
                      {filtered.map(emp => (
                        <div key={emp.id} className={styles.dropdownItem} onClick={() => selectEmployee(emp)}>
                          <div className={styles.dropdownAvatar}>{emp.initials}</div>
                          <div>
                            <div className={styles.dropdownName}>{emp.name}</div>
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

            {showSuccess && <div className={styles.successBanner}>Task assigned successfully.</div>}
            {submitError && <div className={styles.errorBanner}>{submitError}</div>}

            <button className={`btn btn-primary ${styles.assignBtn}`} onClick={submit} disabled={!canSubmit}>
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
                <div className={styles.recentMeta}>→ {t.employee.name} · {t.type} · Due {t.due}</div>
                <div className={styles.recentDesc}>{t.description}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
