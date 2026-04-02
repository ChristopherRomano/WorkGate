import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser, tasks, leaveRequests, expenses, newsPosts } from '../data/mockData';
import '../styles/components.css';
import styles from './Dashboard.module.css';

function StatCard({ icon, value, label, delta, deltaType, highlight }) {
  return (
    <div className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statNum}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {delta && <div className={`${styles.statDelta} ${styles[deltaType]}`}>{delta}</div>}
    </div>
  );
}

function TaskRow({ task }) {
  const [done, setDone] = useState(task.done);
  return (
    <div className={styles.taskRow}>
      <div
        className={`${styles.check} ${done ? styles.checkDone : ''}`}
        onClick={() => setDone(d => !d)}
        role="checkbox"
        aria-checked={done}
      />
      <div className={styles.taskInfo}>
        <div className={`${styles.taskTitle} ${done ? styles.taskDone : ''}`}>{task.title}</div>
        <div className={styles.taskMeta}>{task.type} · {task.due}</div>
      </div>
      <span className={`pill pill-${task.priority}`}>{task.priority.toUpperCase()}</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const pendingTasks = tasks.filter(t => !t.done).length;

  return (
    <div className="animate-fade">
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon="⏱" value="38.5" label="Hours this week" delta="↑ 2.5h vs last week" deltaType="up" highlight />
        <StatCard icon="✓" value={pendingTasks} label="Tasks pending" delta="3 due this week" deltaType="warn" />
        <StatCard icon="📅" value={currentUser.leaveBalance} label="Leave days remaining" delta={`of ${currentUser.leaveTotal} total`} />
        <StatCard icon="🎯" value={currentUser.skillScore} label="Skill score" delta="↑ 3 this month" deltaType="up" />
      </div>

      <div className={styles.twoCol}>
        {/* Tasks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">My Tasks</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>View all</button>
          </div>
          <div className="card-body" style={{ padding: '8px 20px' }}>
            {tasks.slice(0, 4).map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        </div>

        {/* News */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">News Feed</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/news')}>View all</button>
          </div>
          <div className="card-body" style={{ padding: '4px 20px' }}>
            {newsPosts.slice(0, 2).map(p => (
              <div key={p.id} className={styles.postItem}>
                {p.pinned && <div className={styles.pinBadge}>📌 Pinned</div>}
                <div className={styles.postTitle}>{p.title}</div>
                <div className={styles.postExcerpt}>{p.excerpt}</div>
                <div className={styles.postFooter}>
                  <span>{p.author} · {p.date}</span>
                  <span className={styles.postTag}>{p.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.twoCol}>
        {/* Expenses */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Expenses</span>
          </div>
          <div className="card-body" style={{ padding: '8px 20px' }}>
            {expenses.slice(0, 3).map(e => (
              <div key={e.id} className={styles.expenseRow}>
                <div className={styles.expenseInfo}>
                  <div className={styles.expenseTitle}>{e.description}</div>
                  <div className={styles.expenseDate}>{e.date} · {e.project}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className={styles.expenseAmount}>{e.amount}</div>
                  <span className={`badge badge-${e.status}`}>{e.status.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Leave Requests</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leave')}>View all</button>
          </div>
          <div className="card-body">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Period</th><th>Days</th><th>Status</th></tr></thead>
                <tbody>
                  {leaveRequests.slice(0, 3).map(lr => (
                    <tr key={lr.id}>
                      <td><strong>{lr.start} – {lr.end}</strong></td>
                      <td>{lr.days}</td>
                      <td><span className={`badge badge-${lr.status}`}>{lr.status.toUpperCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
