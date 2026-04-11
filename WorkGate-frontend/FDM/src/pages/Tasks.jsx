import { useState } from 'react';
import { tasks as initialTasks } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';
import styles from './Tasks.module.css';

const PRIORITIES = ['high', 'medium', 'low'];
const TYPES = ['Onboarding', 'Operational', 'Upskilling'];

export default function Tasks() {
  const { currentUser } = useAuth();
  const isManager = currentUser?.role === 'Manager';

  const [items, setItems] = useState(initialTasks);
  const [filter, setFilter] = useState('All');
  const [draft, setDraft] = useState(null);

  const openTask = (task) => setDraft({ ...task });
  const closeOverlay = () => setDraft(null);

  const saveChanges = () => {
    setItems(prev => prev.map(t => t.id === draft.id ? { ...draft } : t));
    setDraft(null);
  };

  const deleteTask = () => {
    setItems(prev => prev.filter(t => t.id !== draft.id));
    setDraft(null);
  };

  const markComplete = () => {
    setItems(prev => prev.map(t => t.id === draft.id ? { ...t, done: true } : t));
    setDraft(null);
  };

  const types = ['All', 'Onboarding', 'Operational', 'Upskilling'];
  const filtered = filter === 'All' ? items : items.filter(t => t.type === filter);
  const grouped = ['Onboarding', 'Operational', 'Upskilling'].reduce((acc, type) => {
    const group = filtered.filter(t => t.type === type);
    if (group.length) acc[type] = group;
    return acc;
  }, {});

  return (
    <div className="animate-fade">
      <div className={styles.filters}>
        {types.map(t => (
          <button key={t} className={`btn ${filter === t ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      {Object.entries(grouped).map(([type, group]) => (
        <div key={type} className={`card ${styles.taskCard}`}>
          <div className="card-header"><span className="card-title">{type} Tasks</span></div>
          <div className={`card-body ${styles.taskBody}`}>
            {group.map(task => (
              <div key={task.id} className={styles.taskRow} onClick={() => openTask(task)}>
                <div className={styles.taskInfo}>
                  <div className={`${styles.taskTitle} ${task.done ? styles.done : ''}`}>{task.title}</div>
                  <div className={styles.taskMeta}>{task.type} · {task.due}</div>
                </div>
                <span className={`pill pill-${task.priority}`}>{task.priority.toUpperCase()}</span>
                {task.done && <span className={styles.completedBadge}>✓ Completed</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

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
                    <textarea className="field" style={{ minHeight: 80 }} value={draft.description ?? ''} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="No description" />
                  </div>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input className="field" type="date" value={draft.dueDate ?? ''} onChange={e => setDraft(d => ({ ...d, dueDate: e.target.value }))} />
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
                    <button className={`btn btn-ghost ${styles.deleteBtn}`} onClick={deleteTask}>Delete</button>
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