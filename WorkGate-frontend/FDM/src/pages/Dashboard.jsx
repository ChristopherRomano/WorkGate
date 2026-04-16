import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasks, leaveRequests, expenses, newsPosts, employeeLeaveRequests, teamExpenses } from '../data/mockData';
import Modal from '../components/Modal';
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

const ROLE_LABEL = {
  employee:   'Employee',
  consultant: 'Consultant',
  manager:    'Manager',
  ittech:     'IT Technician',
  hr:         'HR Representative',
  admin:      'Administrator',
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDate() {
  const d = new Date();
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [openFeed, setOpenFeed] = useState(null); // 'news' | 'expenses' | 'leave'

  const isManager = currentUser?.role === 'manager';
  const showGreeting = !['ittech', 'hr'].includes(currentUser?.role);

  const firstName = currentUser?.firstName || currentUser?.name?.split(' ')[0] || 'there';

  // Counts for feed tiles
  const pendingLeave    = leaveRequests.filter(l => l.status === 'pending').length;
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const pinnedNews      = newsPosts.filter(p => p.pinned).length;

  // Manager pending counts
  const pendingTeamLeave    = employeeLeaveRequests.filter(l => l.status === 'pending').length;
  const pendingTeamExpenses = teamExpenses.filter(e => e.status === 'pending').length;

  const managerActions = [
    { icon: '📋', label: 'Leave Approvals',  sub: `${pendingTeamLeave} pending`,    path: '/app/leave-approval',   highlight: pendingTeamLeave > 0 },
    { icon: '💸', label: 'Expense Approval', sub: `${pendingTeamExpenses} pending`,  path: '/app/expense-approval', highlight: pendingTeamExpenses > 0 },
    { icon: '✎',  label: 'Set Task',          sub: 'Assign to your team',            path: '/app/set-task',         highlight: false },
    { icon: '📝', label: 'Create Posting',    sub: 'Share news with your team',      path: '/app/posting',          highlight: false },
  ];

  return (
    <div className="animate-fade">

      {/* ── Greeting ── */}
      {showGreeting && (
        <div className={styles.greeting}>
          <div className={styles.greetingText}>
            <div className={styles.greetingHello}>Hello, {firstName}</div>
            <div className={styles.greetingMeta}>
              <span className={styles.greetingRole}>{ROLE_LABEL[currentUser?.role] ?? 'FDM'}</span>
              <span className={styles.greetingDot}>·</span>
              <span>{formatDate()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Tasks (unchanged) ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">My Tasks</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/tasks')}>View all</button>
        </div>
        <div className="card-body" style={{ padding: '8px 20px' }}>
          {tasks.slice(0, 4).map(t => <TaskRow key={t.id} task={t} />)}
        </div>
      </div>

      {/* ── Feed tiles ── */}
      <div className={styles.feedRow}>
        {/* News */}
        <button className={styles.feedTile} onClick={() => setOpenFeed('news')}>
          <div className={styles.feedIcon}>📢</div>
          <div className={styles.feedLabel}>News Feed</div>
          <div className={styles.feedSub}>{newsPosts.length} posts{pinnedNews > 0 ? ` · ${pinnedNews} pinned` : ''}</div>
          <div className={styles.feedAction}>View Feed →</div>
        </button>

        {/* Expenses */}
        <button className={styles.feedTile} onClick={() => setOpenFeed('expenses')}>
          <div className={styles.feedIcon}>£</div>
          <div className={styles.feedLabel}>Expenses</div>
          <div className={styles.feedSub}>{expenses.length} claims{pendingExpenses > 0 ? ` · ${pendingExpenses} pending` : ''}</div>
          <div className={styles.feedAction}>View All →</div>
        </button>

        {/* Leave */}
        <button className={styles.feedTile} onClick={() => setOpenFeed('leave')}>
          <div className={styles.feedIcon}>📅</div>
          <div className={styles.feedLabel}>Leave</div>
          <div className={styles.feedSub}>{leaveRequests.length} requests{pendingLeave > 0 ? ` · ${pendingLeave} pending` : ''}</div>
          <div className={styles.feedAction}>View All →</div>
        </button>
      </div>

      {/* ── Manager tiles ── */}
      {isManager && (
        <div className={styles.managerSection}>
          <div className={styles.managerTitle}>Management</div>
          <div className={styles.managerGrid}>
            {managerActions.map(({ icon, label, sub, path, highlight }) => (
              <button
                key={label}
                className={`${styles.managerTile} ${highlight ? styles.managerTileHighlight : ''}`}
                onClick={() => navigate(path)}
              >
                <div className={styles.managerTileIcon}>{icon}</div>
                <div className={styles.managerTileLabel}>{label}</div>
                <div className={styles.managerTileSub}>{sub}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── News Feed Modal ── */}
      <Modal isOpen={openFeed === 'news'} onClose={() => setOpenFeed(null)} title="News Feed">
        <div className={styles.modalList}>
          {newsPosts.map(p => (
            <div key={p.id} className={styles.newsItem}>
              {p.pinned && <div className={styles.pinBadge}>📌 Pinned</div>}
              <div className={styles.newsTitle}>{p.title}</div>
              <div className={styles.newsExcerpt}>{p.excerpt}</div>
              <div className={styles.newsFooter}>
                <span>{p.author} · {p.date}</span>
                <span className={styles.newsTag}>{p.category}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => { setOpenFeed(null); navigate('/app/news'); }}>Open full news page</button>
          <button className="btn btn-ghost" onClick={() => setOpenFeed(null)}>Close</button>
        </div>
      </Modal>

      {/* ── Expenses Modal ── */}
      <Modal isOpen={openFeed === 'expenses'} onClose={() => setOpenFeed(null)} title="Expenses">
        <div className={styles.modalList}>
          {expenses.map(e => (
            <div key={e.id} className={styles.expenseItem}>
              <div className={styles.expenseInfo}>
                <div className={styles.expenseDesc}>{e.description}</div>
                <div className={styles.expenseMeta}>{e.date} · {e.project}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className={styles.expenseAmount}>{e.amount}</div>
                <span className={`badge badge-${e.status}`}>{e.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => { setOpenFeed(null); navigate('/app/expenses'); }}>Open full expenses page</button>
          <button className="btn btn-ghost" onClick={() => setOpenFeed(null)}>Close</button>
        </div>
      </Modal>

      {/* ── Leave Modal ── */}
      <Modal isOpen={openFeed === 'leave'} onClose={() => setOpenFeed(null)} title="Leave Requests">
        <div className={styles.modalList}>
          {leaveRequests.map(lr => (
            <div key={lr.id} className={styles.leaveItem}>
              <div className={styles.leavePeriod}>{lr.start} – {lr.end}</div>
              <div className={styles.leaveMeta}>{lr.days} day{lr.days !== 1 ? 's' : ''}</div>
              <span className={`badge badge-${lr.status}`}>{lr.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => { setOpenFeed(null); navigate('/app/leave'); }}>Open full leave page</button>
          <button className="btn btn-ghost" onClick={() => setOpenFeed(null)}>Close</button>
        </div>
      </Modal>

    </div>
  );
}
