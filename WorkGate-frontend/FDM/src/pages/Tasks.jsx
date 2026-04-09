import { useState } from 'react';
import { tasks as initialTasks } from '../data/mockData';
import '../styles/components.css';

export default function Tasks() {
  const [items, setItems] = useState(initialTasks);
  const [filter, setFilter] = useState('All');

  const toggle = (id) => setItems(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const types = ['All', 'Onboarding', 'Operational', 'Upskilling'];
  const filtered = filter === 'All' ? items : items.filter(t => t.type === filter);
  const grouped = ['Onboarding', 'Operational', 'Upskilling'].reduce((acc, type) => {
    const group = filtered.filter(t => t.type === type);
    if (group.length) acc[type] = group;
    return acc;
  }, {});

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} className={`btn ${filter === t ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      {Object.entries(grouped).map(([type, group]) => (
        <div key={type} className="card" style={{ marginBottom: 14 }}>
          <div className="card-header"><span className="card-title">{type} Tasks</span></div>
          <div className="card-body" style={{ padding: '6px 20px' }}>
            {group.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: task.done ? 'var(--text-dim)' : 'var(--text)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{task.type} · {task.due}</div>
                </div>
                <span className={`pill pill-${task.priority}`}>{task.priority.toUpperCase()}</span>
                {task.done
                  ? <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--lime)', background: 'var(--lime-dim)', border: '1px solid var(--lime-border)', padding: '3px 10px', borderRadius: 6, flexShrink: 0 }}>✓ Completed</span>
                  : <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }} onClick={() => toggle(task.id)}>Mark as Complete</button>
                }
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
