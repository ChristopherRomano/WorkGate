import { useState, useMemo } from 'react';
import { teamExpenses as teamInitial } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Expenses.module.css';

const ICONS = { Train: '🚂', Hotel: '🏨', Lunch: '🍽', Taxi: '🚕', Flight: '✈️', Other: '📎' };
const getIcon = (desc) => {
  const key = Object.keys(ICONS).find(k => desc.toLowerCase().includes(k.toLowerCase()));
  return ICONS[key] || '📎';
};

export default function ExpenseApproval() {
  const [teamItems, setTeamItems] = useState(teamInitial);
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

  const filteredTeam = useMemo(() => {
    let list = teamItems;
    if (teamFilter !== 'all') list = list.filter(e => e.status === teamFilter);
    return list;
  }, [teamItems, teamFilter]);

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
