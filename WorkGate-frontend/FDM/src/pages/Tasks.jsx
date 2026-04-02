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
              <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <div
                  onClick={() => toggle(task.id)}
                  style={{
                    width: 17, height: 17, borderRadius: 4, flexShrink: 0, marginTop: 2, cursor: 'pointer',
                    border: task.done ? 'none' : '2px solid var(--border-bright)',
                    background: task.done ? 'var(--lime)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {task.done && <span style={{ color: 'var(--black)', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: task.done ? 'var(--text-dim)' : 'var(--text)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{task.type} · {task.due}</div>
                </div>
                <span className={`pill pill-${task.priority}`}>{task.priority.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
