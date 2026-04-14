import { useState, useMemo } from 'react';
import { expenses as initial, teamExpenses as teamInitial } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Expenses.module.css';

const ICONS = { Train: '🚂', Hotel: '🏨', Lunch: '🍽', Taxi: '🚕', Flight: '✈️', Other: '📎' };
const getIcon = (desc) => {
  const key = Object.keys(ICONS).find(k => desc.toLowerCase().includes(k.toLowerCase()));
  return ICONS[key] || '📎';
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
// Monday-based: Mon=0 … Sun=6
function getFirstDayOfWeek(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7; }

export default function Expenses() {
  const { currentUser } = useAuth();
  const isManager = currentUser?.role === 'manager';

  const [tab, setTab] = useState('personal');

  // ── Personal state ──────────────────────────────────────────────────────────
  const [items, setItems] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', currency: 'GBP (£)', date: '', project: 'CLIENT-003' });

  const createRequest = async (amount,currency,date,description,evidence) => {
    let passedCurrency = "";
    switch (currency){
      
      case "GBP (£)":
        passedCurrency = "GBP"
        break;
      case "EUR (€)":
        passedCurrency = "EUR"
        break;
      case "USD ($)":
        passedCurrency = "USD"
        break;

    }

    const request = {
      username: "john",
      creationTime: (new Date()).getTime(),
      reason: description,
      amount : parseFloat(amount),
      purchaseDate : (new Date(date)).getTime(),
      currency: passedCurrency,
      evidence: "image",
    };
    try {
      const response = await fetch("http://localhost:8080/api/createExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }
    } 
    catch (error) {
      console.error(error);
    }
  };

  const submit = () => {
    if (!form.description || !form.amount) return;
    const sym = form.currency.match(/[£$€]/)?.[0] || '£';
    setItems(prev => [
      { id: `ex${Date.now()}`, description: form.description, date: form.date || 'Today', project: form.project, amount: `${sym}${parseFloat(form.amount).toFixed(2)}`, status: 'pending' },
      ...prev,
    ]);
    setShowModal(false);
    createRequest(form.amount,form.currency,form.date || new Date().getTime(),form.description,);
    setForm({ description: '', amount: '', currency: 'GBP (£)', date: '', project: 'CLIENT-003' });
  };

  const pending = items.filter(e => e.status === 'pending');
  const pendingTotal = pending.reduce((sum, e) => sum + parseFloat(e.amount.replace(/[^0-9.]/g, '')), 0);

  // ── Team state ──────────────────────────────────────────────────────────────
  const [teamItems, setTeamItems] = useState(teamInitial);
  const [calDate, setCalDate] = useState(new Date(2026, 3)); // April 2026
  const [selectedDay, setSelectedDay] = useState(null);     // 'YYYY-MM-DD' | null
  const [reviewTarget, setReviewTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [teamFilter, setTeamFilter] = useState('pending');

  const approveTeam = (id) => setTeamItems(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));

  const openReview = (expense) => { setReviewTarget(expense); setRejectComment(''); };

  const confirmReject = () => {
    if (!rejectComment.trim()) return;
    setTeamItems(prev => prev.map(e => e.id === reviewTarget.id ? { ...e, status: 'rejected', comment: rejectComment.trim() } : e));
    setReviewTarget(null);
    setRejectComment('');
  };

  const teamPending = teamItems.filter(e => e.status === 'pending');
  const teamPendingTotal = teamPending.reduce((sum, e) => sum + parseFloat(e.amount.replace(/[^0-9.]/g, '')), 0);

  // Calendar
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);

  const expensesByDay = useMemo(() => {
    const map = {};
    teamItems.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e.status);
    });
    return map;
  }, [teamItems]);

  const filteredTeam = useMemo(() => {
    let list = teamItems;
    if (selectedDay) list = list.filter(e => e.date === selectedDay);
    if (teamFilter !== 'all') list = list.filter(e => e.status === teamFilter);
    return list;
  }, [teamItems, selectedDay, teamFilter]);

  // ── Personal content ────────────────────────────────────────────────────────
  const personalContent = (
    <>
      <div className={styles.statsGrid}>
        {[
          { icon: '⏳', val: pending.length, label: 'Pending claims' },
          { icon: '💰', val: `£${pendingTotal.toFixed(2)}`, label: 'Pending total', highlight: true },
          { icon: '✅', val: items.filter(e => e.status === 'approved').length, label: 'Paid claims' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Claims</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Claim</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th></th><th>Description</th><th>Date</th><th>Project</th><th>Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {items.map(e => (
                <tr key={e.id}>
                  <td className={styles.iconCell}>{getIcon(e.description)}</td>
                  <td><strong>{e.description}</strong></td>
                  <td>{e.date}</td>
                  <td className={styles.projectCell}>{e.project}</td>
                  <td><strong className={styles.amountCell}>{e.amount}</strong></td>
                  <td><span className={`badge badge-${e.status}`}>{e.status.toUpperCase()}</span></td>
                  <td>
                    {e.status === 'pending'
                      ? <button className="btn btn-danger" onClick={() => setItems(prev => prev.filter(i => i.id !== e.id))}>Cancel</button>
                      : <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // ── Team content ────────────────────────────────────────────────────────────
  const teamContent = (
    <>
      <div className={styles.statsGrid}>
        {[
          { icon: '⏳', val: teamPending.length, label: 'Awaiting approval' },
          { icon: '💰', val: `£${teamPendingTotal.toFixed(2)}`, label: 'Pending total', highlight: true },
          { icon: '✅', val: teamItems.filter(e => e.status === 'approved').length, label: 'Approved' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className={styles.calHeader}>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalDate(new Date(year, month - 1))}>‹</button>
          <span className={styles.calTitle}>{MONTHS[month]} {year}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalDate(new Date(year, month + 1))}>›</button>
          {selectedDay && (
            <button className={`btn btn-ghost btn-sm ${styles.calClearBtn}`} onClick={() => setSelectedDay(null)}>
              Clear filter
            </button>
          )}
        </div>
        <div className={styles.calGrid}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className={styles.calDayName}>{d}</div>
          ))}
          {Array.from({ length: firstDayOffset }, (_, i) => <div key={`blank-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const statuses = expensesByDay[dateStr] || [];
            const isSelected = selectedDay === dateStr;
            const hasPending  = statuses.includes('pending');
            const hasApproved = statuses.includes('approved');
            const hasRejected = statuses.includes('rejected');
            return (
              <div
                key={day}
                className={[
                  styles.calDay,
                  statuses.length > 0 ? styles.calDayHasItems : '',
                  isSelected ? styles.calDaySelected : '',
                ].join(' ')}
                onClick={() => statuses.length > 0 && setSelectedDay(isSelected ? null : dateStr)}
              >
                <span className={styles.calDayNum}>{day}</span>
                {statuses.length > 0 && (
                  <div className={styles.calDots}>
                    {hasPending  && <span className={styles.dotPending}  />}
                    {hasApproved && <span className={styles.dotApproved} />}
                    {hasRejected && <span className={styles.dotRejected} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.teamFilters}>
        {[
          ['pending',  `Pending${teamPending.length ? ` (${teamPending.length})` : ''}`],
          ['approved', 'Approved'],
          ['rejected', 'Rejected'],
          ['all',      'All'],
        ].map(([val, label]) => (
          <button
            key={val}
            className={`btn ${teamFilter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setTeamFilter(val)}
          >{label}</button>
        ))}
        {selectedDay && (
          <span className={styles.dayFilterBadge}>
            Filtered: {selectedDay}
            <button className={styles.dayFilterClear} onClick={() => setSelectedDay(null)}>×</button>
          </span>
        )}
      </div>

      {/* Team expense list */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Team Claims</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
            Click a pending row to review
          </span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th></th><th>Employee</th><th>Description</th><th>Date</th><th>Project</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredTeam.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 16px' }}>
                    No claims found.
                  </td>
                </tr>
              )}
              {filteredTeam.map(e => (
                <tr
                  key={e.id}
                  className={e.status === 'pending' ? styles.clickableRow : ''}
                  onClick={() => e.status === 'pending' && openReview(e)}
                >
                  <td className={styles.iconCell}>{getIcon(e.description)}</td>
                  <td>
                    <div className={styles.employeeCell}>
                      <div className={styles.avatar}>{e.initials}</div>
                      <strong>{e.employee}</strong>
                    </div>
                  </td>
                  <td>{e.description}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{e.date}</td>
                  <td className={styles.projectCell}>{e.project}</td>
                  <td><strong className={styles.amountCell}>{e.amount}</strong></td>
                  <td>
                    <div className={styles.statusCell}>
                      <span className={`badge badge-${e.status}`}>{e.status.toUpperCase()}</span>
                      {e.status === 'pending' && <span className={styles.reviewHint}>Review →</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade">
      {isManager && (
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${tab === 'personal' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('personal')}
          >
            Personal
          </button>
          <button
            className={`${styles.tabBtn} ${tab === 'team' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('team')}
          >
            Team
          </button>
        </div>
      )}

      {tab === 'personal' ? personalContent : teamContent}

      {/* New Claim Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Expense Claim">
        <div className="form-grid">
          <div className="form-group">
            <label>Description</label>
            <input className="field" placeholder="e.g. Train – London to Manchester" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Amount</label>
              <input className="field" type="number" placeholder="0.00" step="0.01" min="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select className="field" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                <option>GBP (£)</option><option>USD ($)</option><option>EUR (€)</option>
              </select>
            </div>
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Date</label>
              <input className="field" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Project Code</label>
              <select className="field" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))}>
                <option>CLIENT-003</option><option>CLIENT-001</option><option>INTERNAL</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Receipt</label>
            <div className="upload-zone">
              <div className="upload-zone-icon">📎</div>
              <div className="upload-zone-label">Click to upload or drag & drop</div>
              <div className="upload-zone-sub">PDF, PNG, JPG — max 10MB</div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submitPersonal}>Submit Claim</button>
          </div>
        </div>
      </Modal>

      {/* Review / Approve-Reject Modal */}
      <Modal isOpen={!!reviewTarget} onClose={() => setReviewTarget(null)} title="Review Expense Claim">
        {reviewTarget && (
          <div className="form-grid">
            <div className={styles.reviewCard}>
              <div className={styles.reviewCardTop}>
                <div className={styles.avatar}>{reviewTarget.initials}</div>
                <div className={styles.reviewInfo}>
                  <div className={styles.reviewEmployee}>{reviewTarget.employee}</div>
                  <div className={styles.reviewMeta}>{reviewTarget.project} · {reviewTarget.date}</div>
                </div>
                <div className={styles.reviewAmount}>{reviewTarget.amount}</div>
              </div>
              <div className={styles.reviewDetail}>
                <span className={styles.reviewIcon}>{getIcon(reviewTarget.description)}</span>
                <span>{reviewTarget.description}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Comment — required to reject, optional to approve</label>
              <textarea
                className="field"
                style={{ minHeight: 80 }}
                placeholder="Add a note visible to the employee..."
                value={rejectComment}
                onChange={e => setRejectComment(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => { approveTeam(reviewTarget.id); setReviewTarget(null); }}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={confirmReject}
                disabled={!rejectComment.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}