import { useNavigate } from 'react-router-dom';
import { tasks, leaveRequests, newsPosts } from '../data/mockData';
import '../styles/components.css';
import styles from './Dashboard.module.css';

function TaskRow({ task }) {
  return (
    <div className={styles.taskRow}>
      <div className={`${styles.check} ${task.done ? styles.checkDone : ''}`} />
      <div className={styles.taskInfo}>
        <div className={`${styles.taskTitle} ${task.done ? styles.taskDone : ''}`}>{task.title}</div>
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
      <div className={styles.twoCol}>
        {/* Tasks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">My Tasks</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/tasks')}>View all</button>
          </div>
          <div className="card-body" style={{ padding: '8px 20px' }}>
            {tasks.slice(0, 4).map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        </div>

        {/* News */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">News Feed</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/news')}>View all</button>
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

      {/* Leave */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Leave Requests</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/leave')}>View all</button>
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
  );
}
