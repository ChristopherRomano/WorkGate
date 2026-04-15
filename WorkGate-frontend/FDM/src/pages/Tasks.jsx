import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMyTasks, completeTask, deleteTask, updateTask, assignTask, mapTask } from '../api/api';
import '../styles/components.css';
import styles from './Tasks.module.css';

const PRIORITIES = ['high', 'medium', 'low'];
const TYPES = ['Onboarding', 'Operational', 'Upskilling'];

export default function Tasks() {
  const { currentUser } = useAuth();
  const isManager = currentUser?.role === 'manager';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [draft, setDraft] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium', type: 'Onboarding' });
  const [addErrors, setAddErrors] = useState([]);

  useEffect(() => {
    if (!currentUser?.email) return;
    setLoading(true);
    fetchMyTasks(currentUser.email)
      .then(data => setItems(data.map(mapTask)))
      .catch(() => setError('Could not load tasks.'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const addTask = async () => {
    const errors = [];
    if (newTask.title.trim().length < 3) errors.push('Title must be at least 3 characters.');
    if (newTask.description.trim().length < 10) errors.push('Description must be at least 10 characters.');
    if (!newTask.dueDate) errors.push('Due date is required.');
    else if (new Date(newTask.dueDate) < new Date(new Date().toDateString())) errors.push('Due date cannot be in the past.');
    if (errors.length) { setAddErrors(errors); return; }

    try {
      const res = await assignTask({
        managerEmail: currentUser.email,
        employeeEmail: currentUser.email,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority.toUpperCase(),
        dueDate: newTask.dueDate,
        category: newTask.type,
      });
      setItems(prev => [...prev, mapTask({
        taskId: res.taskId,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        completion: false,
        priority: newTask.priority.toUpperCase(),
        dueDate: newTask.dueDate,
        category: newTask.type,
      })]);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', type: 'Onboarding' });
      setAddErrors([]);
      setAdding(false);
    } catch (e) {
      setAddErrors([e.message]);
    }
  };

  const closeOverlay = () => setDraft(null);

  const saveChanges = async () => {
    try {
      await updateTask(draft.id, {
        employeeEmail: currentUser.email,
        title: draft.title,
        description: draft.description,
        priority: draft.priority.toUpperCase(),
        dueDate: draft.due,
        category: draft.type,
      });
      setItems(prev => prev.map(t => t.id === draft.id ? { ...draft } : t));
      setDraft(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(draft.id, currentUser.email);
      setItems(prev => prev.filter(t => t.id !== draft.id));
      setDraft(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const markComplete = async () => {
    try {
      await completeTask(draft.id, currentUser.email);
      setItems(prev => prev.map(t => t.id === draft.id ? { ...t, done: true } : t));
      setDraft(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const types = ['All', 'Onboarding', 'Operational', 'Upskilling'];
  const filtered = filter === 'All' ? items : items.filter(t => t.type === filter);
  const grouped = ['Onboarding', 'Operational', 'Upskilling'].reduce((acc, type) => {
    const group = filtered.filter(t => t.type === type);
    if (group.length) acc[type] = group;
    return acc;
  }, {});

  if (loading) return <div className="animate-fade" style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading tasks…</div>;
  if (error)   return <div className="animate-fade" style={{ padding: '2rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="animate-fade">
      <div className={styles.topBar}>
        <div className={styles.filters}>
          {types.map(t => (
            <button key={t} className={`btn ${filter === t ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>
        {isManager && (
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>+ Add Task</button>
        )}
      </div>

      {Object.entries(grouped).map(([type, group]) => (
        <div key={type} className={`card ${styles.taskCard}`}>
          <div className="card-header"><span className="card-title">{type} Tasks</span></div>
          <div className={`card-body ${styles.taskBody}`}>
            {group.map(task => (
              <div
                key={task.id}
                className={styles.taskRow}
                onClick={!isManager ? () => setDraft({ ...task }) : undefined}
                style={!isManager ? { cursor: 'pointer' } : undefined}
              >
                <div className={styles.taskInfo}>
                  <div className={`${styles.taskTitle} ${task.done ? styles.done : ''}`}>{task.title}</div>
                  <div className={styles.taskMeta}>{task.type} · {task.due}</div>
                </div>
                {!isManager && <span className={`pill pill-${task.priority}`}>{task.priority.toUpperCase()}</span>}
                {task.done && <span className={styles.completedBadge}>✓ Completed</span>}
                {isManager && (
                  <button className={styles.editIconBtn} onClick={() => setDraft({ ...task })} title="Edit task">✏️</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(grouped).length === 0 && (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No tasks assigned yet.
          </div>
        </div>
      )}

      {adding && (
        <div className="modal-overlay" onClick={() => { setAdding(false); setAddErrors([]); }}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">ADD TASK</span>
              <button className="modal-close" onClick={() => { setAdding(false); setAddErrors([]); }}>×</button>
            </div>
            {addErrors.length > 0 && (
              <div className={styles.errorBar}>{addErrors.map((e, i) => <div key={i}>{e}</div>)}</div>
            )}
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input className="field" value={newTask.title} onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))} placeholder="Task title" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="field" style={{ minHeight: 80 }} value={newTask.description} onChange={e => setNewTask(n => ({ ...n, description: e.target.value }))} placeholder="Task description" />
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input className="field" type="date" value={newTask.dueDate} onChange={e => setNewTask(n => ({ ...n, dueDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select className="field" value={newTask.priority} onChange={e => setNewTask(n => ({ ...n, priority: e.target.value }))}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="field" value={newTask.type} onChange={e => setNewTask(n => ({ ...n, type: e.target.value }))}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={addTask}>Add Task</button>
                  <button className="btn btn-ghost" onClick={() => { setAdding(false); setAddErrors([]); }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {draft && (
        <div className="modal-overlay" onClick={closeOverlay}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{isManager ? 'EDIT TASK' : 'TASK DETAIL'}</span>
              <button className="modal-close" onClick={closeOverlay}>×</button>
            </div>
            <div className="modal-body">
              {isManager ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title</label>
                    <input className="field" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="field" style={{ minHeight: 80 }} value={draft.description ?? ''} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
                  </div>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input className="field" type="date" value={draft.due ?? ''} onChange={e => setDraft(d => ({ ...d, due: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Priority</label>
                      <select className="field" value={draft.priority} onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select className="field" value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button className="btn btn-primary" onClick={saveChanges}>Save Changes</button>
                    <button className={`btn btn-ghost ${styles.deleteBtn}`} onClick={handleDelete}>Delete</button>
                    <button className="btn btn-ghost" onClick={closeOverlay}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className={styles.detailView}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Title</span>
                    <span className={styles.detailValue}>{draft.title}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Description</span>
                    <span className={styles.detailValue}>{draft.description || '—'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Due Date</span>
                    <span className={styles.detailValue}>{draft.due}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Priority</span>
                    <span className={`pill pill-${draft.priority}`}>{draft.priority.toUpperCase()}</span>
                  </div>
                  <div className="modal-actions" style={{ marginTop: 16 }}>
                    {!draft.done && <button className="btn btn-primary" onClick={markComplete}>Mark as Complete</button>}
                    <button className="btn btn-ghost" onClick={closeOverlay}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
