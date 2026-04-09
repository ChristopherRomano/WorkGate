import { useState } from 'react';
import { employees } from '../data/mockData';
import '../styles/components.css';

const EMPTY_FORM = { title: '', priority: 'medium', type: 'Operational', due: '', description: '' };

export default function SetTask() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [assigned, setAssigned] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const filtered = search.trim()
    ? employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const selectEmployee = (emp) => {
    setSelected(emp);
    setSearch('');
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const canSubmit = selected && form.title.trim() && form.description.trim() && form.due;

  const submit = () => {
    if (!canSubmit) return;
    const newTask = {
      id: `t-mgr-${Date.now()}`,
      employee: selected,
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      type: form.type,
      due: form.due,
      assignedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setAssigned(prev => [newTask, ...prev]);
    setForm(EMPTY_FORM);
    setSelected(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Left — assign form */}
        <div className="card">
          <div className="card-header"><span className="card-title">Assign Task</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '24px' }}>

            {/* Employee search */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Employee</label>
              {selected ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface-3)', border: '1px solid var(--lime-border)', borderRadius: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--lime-dim)', border: '1px solid var(--lime-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--lime)', flexShrink: 0 }}>
                    {selected.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{selected.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>{selected.role} · {selected.client}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Change</button>
                </div>
              ) : (
                <>
                  <input
                    className="field"
                    placeholder="Search by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoComplete="off"
                  />
                  {filtered.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface-2)', border: '1px solid var(--border-bright)', borderRadius: 8, zIndex: 10, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', marginTop: 4 }}>
                      {filtered.map(emp => (
                        <div
                          key={emp.id}
                          onClick={() => selectEmployee(emp)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--lime)', flexShrink: 0 }}>
                            {emp.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{emp.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>{emp.role} · {emp.client}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {search.trim() && filtered.length === 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface-2)', border: '1px solid var(--border-bright)', borderRadius: 8, zIndex: 10, padding: '12px 16px', marginTop: 4, fontSize: 13, color: 'var(--text-dim)' }}>
                      No employees found.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Task fields */}
            <div className="form-group">
              <label>Task Title</label>
              <input className="field" placeholder="e.g. Complete onboarding checklist" {...field('title')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
              <textarea className="field" style={{ minHeight: 130 }} placeholder="Describe the task in detail..." {...field('description')} />
            </div>

            {showSuccess && (
              <div style={{ fontSize: 13, color: 'var(--lime)', background: 'var(--lime-dim)', border: '1px solid var(--lime-border)', borderRadius: 8, padding: '10px 14px', marginBottom: 4 }}>
                Task assigned successfully.
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={submit} disabled={!canSubmit}>
              Assign Task
            </button>
          </div>
        </div>

        {/* Right — recently assigned */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header"><span className="card-title">Recently Assigned</span></div>
          <div style={{ padding: '8px 24px' }}>
            {assigned.length === 0 && (
              <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>No tasks assigned yet this session.</div>
            )}
            {assigned.map(t => (
              <div key={t.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{t.title}</span>
                  <span className={`pill pill-${t.priority}`}>{t.priority.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--mono)', marginBottom: 4 }}>
                  → {t.employee.name} · {t.type} · Due {t.due}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
