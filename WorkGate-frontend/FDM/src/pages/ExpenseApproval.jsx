//Expense

import { useState, useMemo, useEffect } from 'react';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Expenses.module.css';
import { useAuth } from '../context/AuthContext';

const ICONS = { Train: '🚂', Hotel: '🏨', Lunch: '🍽', Taxi: '🚕', Flight: '✈️', Other: '📎' };
const getIcon = (desc) => {
  const key = Object.keys(ICONS).find(k => desc.toLowerCase().includes(k.toLowerCase()));
  return ICONS[key] || '📎';
};


const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7; }

const CURRENCY_SYMBOLS = { USD: '$', GBP: '£', EUR: '€' };

export default function ExpenseApproval() {
  const { currentUser } = useAuth();
  const [teamItems, setTeamItems] = useState([]);
  const [calDate, setCalDate]     = useState(new Date(2026, 3));
  const [selectedDay, setSelectedDay] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [teamFilter, setTeamFilter] = useState('pending');

  const fetchExpenseRequests = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/expenses?username=${currentUser.name}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch expense requests");
    }

    const data = await response.json();

    console.log(data);

    const formatted = data.map((item, index) => {
      const dateObj = new Date(item.creationTime);
      const dateStr = dateObj.toISOString().split('T')[0];

      const name = item.username ?? item.name ?? "Unknown";

      const initials = name
        .split(" ")
        .map(p => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const symbol = CURRENCY_SYMBOLS[item.currency] ?? "";

      return {
        id: index,

        employee: name,
        initials,

        description: item.reason ?? "Expense",
        date: dateStr,

        project: item.project ?? item.manager ?? "—",

        amount: `${symbol}${parseFloat(item.amount || 0).toFixed(2)}`,

        status: "pending",
        comment: ""
      };
    });

    setTeamItems(formatted);

  } catch (error) {
    console.error(error);
  }
  };

  useEffect(() => {
    fetchExpenseRequests();
  }, [currentUser]);
  

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

  return (
    <div className="animate-fade">
      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { icon: '⏳', val: teamPending.length,                                    label: 'Awaiting approval' },
          { icon: '💰', val: `£${teamPendingTotal.toFixed(2)}`,                     label: 'Pending total', highlight: true },
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

      {/* Review Modal */}
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