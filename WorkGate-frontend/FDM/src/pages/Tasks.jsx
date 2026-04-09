import { useState } from 'react';
import { tasks as initialTasks } from '../data/mockData';
import '../styles/components.css';
import styles from './Tasks.module.css';

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
              <div key={task.id} className={styles.taskRow}>
                <div className={styles.taskInfo}>
                  <div className={`${styles.taskTitle} ${task.done ? styles.done : ''}`}>{task.title}</div>
                  <div className={styles.taskMeta}>{task.type} · {task.due}</div>
                </div>
                <span className={`pill pill-${task.priority}`}>{task.priority.toUpperCase()}</span>
                {task.done
                  ? <span className={styles.completedBadge}>✓ Completed</span>
                  : <button className={`btn btn-ghost btn-sm ${styles.completeBtn}`} onClick={() => toggle(task.id)}>Mark as Complete</button>
                }
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
