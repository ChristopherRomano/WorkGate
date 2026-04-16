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

const ROLE_LABEL = { employee:'Employee', consultant:'Consultant', manager:'Manager', ittech:'IT Technician', hr:'HR Representative' };
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function fmtDate() { const d = new Date(); return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`; }

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [openFeed, setOpenFeed] = useState(null);

  const role = currentUser?.role;
  const isManager = role === 'manager';
  const showGreeting = !['ittech','hr'].includes(role);
  const firstName = currentUser?.firstName || currentUser?.name?.split(' ')[0] || 'there';

  const pendingLeave    = leaveRequests.filter(l => l.status === 'pending').length;
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const pinnedNews      = newsPosts.filter(p => p.pinned).length;
  const pendingTeamLeave    = employeeLeaveRequests.filter(l => l.status === 'pending').length;
  const pendingTeamExpenses = teamExpenses.filter(e => e.status === 'pending').length;

  return (
    <div className="animate-fade">

      {/* ── Greeting — mobile only, role-conditional ── */}
      {showGreeting && (
        <div className={styles.greeting}>
          <div className={styles.greetingHello}>Hello, {firstName}</div>
          <div className={styles.greetingMeta}>
            <span className={styles.greetingRole}>{ROLE_LABEL[role] ?? 'FDM'}</span>
            <span> · {fmtDate()}</span>
          </div>
        </div>
      )}

      {/* ── Tasks — same on all screens ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">My Tasks</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/tasks')}>View all</button>
        </div>
        <div className="card-body" style={{ padding: '8px 20px' }}>
          {tasks.slice(0, 4).map(t => <TaskRow key={t.id} task={t} />)}
        </div>
      </div>

      {/* ── Desktop: existing two-col cards (hidden on mobile) ── */}
      <div className={`${styles.twoCol} ${styles.desktopOnly}`}>
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
        <div className="card">
          <div className="card-header"><span className="card-title">Recent Expenses</span></div>
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
      </div>
      <div className={`${styles.twoCol} ${styles.desktopOnly}`}>
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

      {/* ── Mobile: feed tiles ── */}
      <div className={styles.feedRow}>
        <button className={styles.feedTile} onClick={() => setOpenFeed('news')}>
          <span className={styles.feedIcon}>📢</span>
          <span className={styles.feedLabel}>News Feed</span>
          <span className={styles.feedSub}>{newsPosts.length} posts{pinnedNews > 0 ? ` · ${pinnedNews} pinned` : ''}</span>
          <span className={styles.feedArrow}>→</span>
        </button>
        <button className={styles.feedTile} onClick={() => setOpenFeed('expenses')}>
          <span className={styles.feedIcon}>£</span>
          <span className={styles.feedLabel}>Expenses</span>
          <span className={styles.feedSub}>{expenses.length} claims{pendingExpenses > 0 ? ` · ${pendingExpenses} pending` : ''}</span>
          <span className={styles.feedArrow}>→</span>
        </button>
        <button className={styles.feedTile} onClick={() => setOpenFeed('leave')}>
          <span className={styles.feedIcon}>📅</span>
          <span className={styles.feedLabel}>Leave</span>
          <span className={styles.feedSub}>{leaveRequests.length} requests{pendingLeave > 0 ? ` · ${pendingLeave} pending` : ''}</span>
          <span className={styles.feedArrow}>→</span>
        </button>
      </div>

      {/* ── Manager tiles — mobile only ── */}
      {isManager && (
        <div className={styles.managerSection}>
          <div className={styles.managerLabel}>Management</div>
          <div className={styles.managerGrid}>
            {[
              { icon:'📋', label:'Leave Approvals',  sub:`${pendingTeamLeave} pending`,    path:'/app/leave-approval',   hot: pendingTeamLeave > 0 },
              { icon:'💸', label:'Expense Approval', sub:`${pendingTeamExpenses} pending`,  path:'/app/expense-approval', hot: pendingTeamExpenses > 0 },
              { icon:'✎',  label:'Set Task',          sub:'Assign to team',                 path:'/app/set-task',         hot: false },
              { icon:'📝', label:'Create Posting',    sub:'Share with team',                path:'/app/posting',          hot: false },
            ].map(({ icon, label, sub, path, hot }) => (
              <button key={label} className={`${styles.managerTile} ${hot ? styles.managerTileHot : ''}`} onClick={() => navigate(path)}>
                <span className={styles.managerTileIcon}>{icon}</span>
                <span className={styles.managerTileLabel}>{label}</span>
                <span className={`${styles.managerTileSub} ${hot ? styles.managerTileSubHot : ''}`}>{sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Feed modals ── */}
      <Modal isOpen={openFeed === 'news'} onClose={() => setOpenFeed(null)} title="News Feed">
        <div className={styles.modalList}>
          {newsPosts.map(p => (
            <div key={p.id} className={styles.newsItem}>
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
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => { setOpenFeed(null); navigate('/app/news'); }}>Full page</button>
          <button className="btn btn-ghost" onClick={() => setOpenFeed(null)}>Close</button>
        </div>
      </Modal>

      <Modal isOpen={openFeed === 'expenses'} onClose={() => setOpenFeed(null)} title="Expenses">
        <div className={styles.modalList}>
          {expenses.map(e => (
            <div key={e.id} className={styles.expenseRow}>
              <div className={styles.expenseInfo}>
                <div className={styles.expenseTitle}>{e.description}</div>
                <div className={styles.expenseDate}>{e.date} · {e.project}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div className={styles.expenseAmount}>{e.amount}</div>
                <span className={`badge badge-${e.status}`}>{e.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => { setOpenFeed(null); navigate('/app/expenses'); }}>Full page</button>
          <button className="btn btn-ghost" onClick={() => setOpenFeed(null)}>Close</button>
        </div>
      </Modal>

      <Modal isOpen={openFeed === 'leave'} onClose={() => setOpenFeed(null)} title="Leave Requests">
        <div className={styles.modalList}>
          {leaveRequests.map(lr => (
            <div key={lr.id} className={styles.leaveItem}>
              <div className={styles.leavePeriod}>{lr.start} – {lr.end}</div>
              <div className={styles.leaveDays}>{lr.days}d</div>
              <span className={`badge badge-${lr.status}`}>{lr.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => { setOpenFeed(null); navigate('/app/leave'); }}>Full page</button>
          <button className="btn btn-ghost" onClick={() => setOpenFeed(null)}>Close</button>
        </div>
      </Modal>

    </div>
  );
}
