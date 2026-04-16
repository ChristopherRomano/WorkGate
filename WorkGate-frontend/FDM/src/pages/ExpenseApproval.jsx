import { useEffect, useMemo, useState } from 'react';
import { fetchEmployees, fetchManagerExpenseRequests, resolveExpenseRequest } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Expenses.module.css';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  Train: '\u{1F687}',
  Hotel: '\u{1F3E8}',
  Lunch: '\u{1F37D}',
  Taxi: '\u{1F695}',
  Flight: '\u2708\uFE0F',
  Other: '\u{1F4CE}',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CURRENCY_SYMBOLS = { USD: '$', GBP: '\u00A3', EUR: '\u20AC' };
const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function getIcon(description) {
  const normalizedDescription = String(description ?? '');
  const key = Object.keys(ICONS).find((label) => normalizedDescription.toLowerCase().includes(label.toLowerCase()));
  return ICONS[key] || ICONS.Other;
}

function mapExpenseStatus(status) {
  switch (String(status ?? '').toUpperCase()) {
    case 'ACCEPTED':
    case 'RESOLVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'OPEN':
    case 'IN_PROGRESS':
    default:
      return 'pending';
  }
}

function formatCalendarDate(timestamp) {
  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) {
    return '';
  }

  const parsed = new Date(numericTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return DATE_FORMATTER.format(parsed);
}

function buildInitials(name, fallback = 'U') {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return fallback;
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getEmployeeDisplay(employee) {
  const name = employee?.name?.trim() ?? '';
  const surname = employee?.surname?.trim() ?? '';
  const fullName = [name, surname].filter(Boolean).join(' ').trim();

  if (fullName) {
    return fullName;
  }

  if (name) {
    return name;
  }

  return employee?.email ?? 'Unknown';
}

function formatAmount(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency ?? ''} `;
  return `${symbol}${(Number(amount) || 0).toFixed(2)}`;
}

function formatPendingTotal(expenses) {
  const totalsByCurrency = expenses.reduce((totals, expense) => {
    const currency = expense.currency || 'GBP';
    totals[currency] = (totals[currency] ?? 0) + expense.amountValue;
    return totals;
  }, {});

  const currencies = Object.keys(totalsByCurrency);
  if (!currencies.length) {
    return formatAmount(0, 'GBP');
  }

  return currencies
    .sort((left, right) => left.localeCompare(right))
    .map((currency) => formatAmount(totalsByCurrency[currency], currency))
    .join(' / ');
}

function mapExpenseRequest(item, employeeDirectory) {
  const employeeEmail = item?.employeeEmail ?? item?.employeeemail ?? item?.email ?? '';
  const employee = employeeDirectory.get(employeeEmail.toLowerCase());
  const employeeName = employee ? getEmployeeDisplay(employee) : (employeeEmail || 'Unknown');
  const initials = employee?.initials ?? buildInitials(employeeName);
  const amountValue = Number(item?.amount) || 0;
  const currency = item?.currency ?? 'GBP';

  return {
    id: item?.id ?? `expense-${employeeEmail}-${item?.creationTime ?? Date.now()}`,
    employee: employeeName,
    employeeEmail,
    initials,
    description: item?.reason ?? 'Expense',
    date: formatCalendarDate(item?.creationTime),
    project: employee?.activeClientCode ?? employee?.clientCode ?? '\u2014',
    amount: formatAmount(amountValue, currency),
    amountValue,
    currency,
    status: mapExpenseStatus(item?.status),
    comment: '',
  };
}

export default function ExpenseApproval() {
  const { currentUser } = useAuth();
  const managerEmail = currentUser?.email ?? '';

  const [teamItems, setTeamItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [calDate, setCalDate] = useState(new Date(2026, 3));
  const [selectedDay, setSelectedDay] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [teamFilter, setTeamFilter] = useState('pending');
  const [actionError, setActionError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadManagerExpenses() {
      if (!managerEmail) {
        setTeamItems([]);
        setLoadError('');
        return;
      }

      setLoading(true);
      setLoadError('');

      try {
        const [employees, expenseRequests] = await Promise.all([
          fetchEmployees(),
          fetchManagerExpenseRequests(managerEmail),
        ]);

        if (ignore) {
          return;
        }

        const employeeDirectory = new Map(
          (Array.isArray(employees) ? employees : []).map((employee) => [
            String(employee?.email ?? '').toLowerCase(),
            employee,
          ]),
        );

        const formattedExpenses = Array.isArray(expenseRequests)
          ? expenseRequests
              .map((item) => mapExpenseRequest(item, employeeDirectory))
              .sort((left, right) => right.date.localeCompare(left.date))
          : [];

        setTeamItems(formattedExpenses);
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setTeamItems([]);
          setLoadError('Unable to load expense requests for your team right now.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadManagerExpenses();

    return () => {
      ignore = true;
    };
  }, [managerEmail]);

  const openReview = (expense) => {
    setReviewTarget(expense);
    setRejectComment('');
  };

  const confirmReject = () => {
    if (!rejectComment.trim() || !reviewTarget) {
      return;
    }

    resolveTeamExpense(reviewTarget, {
      nextStatus: 'rejected',
      payload: {
        id: reviewTarget.id,
        reason: rejectComment.trim(),
      },
      errorMessage: 'Unable to reject this expense request right now.',
    });
  };

  const resolveTeamExpense = async (expense, { nextStatus, payload, errorMessage }) => {
    setResolvingId(expense.id);
    setActionType(nextStatus);
    setActionError('');

    try {
      await resolveExpenseRequest(payload);

      setTeamItems((previous) => previous.map((item) => (
        item.id === expense.id
          ? {
              ...item,
              status: nextStatus,
              comment: nextStatus === 'rejected' ? rejectComment.trim() : item.comment,
            }
          : item
      )));
      setReviewTarget(null);
      setRejectComment('');
    } catch (error) {
      console.error(error);
      setActionError(errorMessage);
    } finally {
      setResolvingId(null);
      setActionType('');
    }
  };

  const teamPending = teamItems.filter((expense) => expense.status === 'pending');
  const teamPendingTotal = formatPendingTotal(teamPending);

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);

  const expensesByDay = useMemo(() => {
    const map = {};
    teamItems.forEach((expense) => {
      if (!expense.date) {
        return;
      }

      if (!map[expense.date]) {
        map[expense.date] = [];
      }

      map[expense.date].push(expense.status);
    });
    return map;
  }, [teamItems]);

  const filteredTeam = useMemo(() => {
    let list = teamItems;
    if (selectedDay) {
      list = list.filter((expense) => expense.date === selectedDay);
    }
    if (teamFilter !== 'all') {
      list = list.filter((expense) => expense.status === teamFilter);
    }
    return list;
  }, [teamItems, selectedDay, teamFilter]);

  return (
    <div className="animate-fade">
      <div className={styles.statsGrid}>
        {[
          { icon: '\u23F3', val: teamPending.length, label: 'Awaiting approval' },
          { icon: '\u{1F4B0}', val: teamPendingTotal, label: 'Pending total', highlight: true },
          { icon: '\u2705', val: teamItems.filter((expense) => expense.status === 'approved').length, label: 'Approved' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className={styles.calHeader}>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalDate(new Date(year, month - 1))}>{'\u2039'}</button>
          <span className={styles.calTitle}>{MONTHS[month]} {year}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalDate(new Date(year, month + 1))}>{'\u203A'}</button>
          {selectedDay && (
            <button className={`btn btn-ghost btn-sm ${styles.calClearBtn}`} onClick={() => setSelectedDay(null)}>
              Clear filter
            </button>
          )}
        </div>
        <div className={styles.calGrid}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className={styles.calDayName}>{day}</div>
          ))}
          {Array.from({ length: firstDayOffset }, (_, index) => <div key={`blank-${index}`} />)}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const statuses = expensesByDay[dateStr] || [];
            const isSelected = selectedDay === dateStr;
            const hasPending = statuses.includes('pending');
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
                    {hasPending && <span className={styles.dotPending} />}
                    {hasApproved && <span className={styles.dotApproved} />}
                    {hasRejected && <span className={styles.dotRejected} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.teamFilters}>
        {[
          ['pending', `Pending${teamPending.length ? ` (${teamPending.length})` : ''}`],
          ['approved', 'Approved'],
          ['rejected', 'Rejected'],
          ['all', 'All'],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`btn ${teamFilter === value ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setTeamFilter(value)}
          >
            {label}
          </button>
        ))}
        {selectedDay && (
          <span className={styles.dayFilterBadge}>
            Filtered: {selectedDay}
            <button className={styles.dayFilterClear} onClick={() => setSelectedDay(null)}>{'\u00D7'}</button>
          </span>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Team Claims</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
            Click a pending row to review
          </span>
        </div>

        {loadError && (
          <div style={{ color: 'var(--danger)', padding: '0 16px 16px' }}>
            {loadError}
          </div>
        )}

        {actionError && (
          <div style={{ color: 'var(--danger)', padding: '0 16px 16px' }}>
            {actionError}
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th></th><th>Employee</th><th>Description</th><th>Date</th><th>Project</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 16px' }}>
                    Loading claims...
                  </td>
                </tr>
              )}

              {!loading && filteredTeam.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 16px' }}>
                    No claims found.
                  </td>
                </tr>
              )}

              {!loading && filteredTeam.map((expense) => (
                <tr
                  key={expense.id}
                  className={expense.status === 'pending' ? styles.clickableRow : ''}
                  onClick={() => expense.status === 'pending' && openReview(expense)}
                >
                  <td className={styles.iconCell}>{getIcon(expense.description)}</td>
                  <td>
                    <div className={styles.employeeCell}>
                      <div className={styles.avatar}>{expense.initials}</div>
                      <strong>{expense.employee}</strong>
                    </div>
                  </td>
                  <td>{expense.description}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{expense.date || '\u2014'}</td>
                  <td className={styles.projectCell}>{expense.project}</td>
                  <td><strong className={styles.amountCell}>{expense.amount}</strong></td>
                  <td>
                    <div className={styles.statusCell}>
                      <span className={`badge badge-${expense.status}`}>{expense.status.toUpperCase()}</span>
                      {expense.status === 'pending' && <span className={styles.reviewHint}>Review {'\u2192'}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!reviewTarget} onClose={() => setReviewTarget(null)} title="Review Expense Claim">
        {reviewTarget && (
          <div className="form-grid">
            <div className={styles.reviewCard}>
              <div className={styles.reviewCardTop}>
                <div className={styles.avatar}>{reviewTarget.initials}</div>
                <div className={styles.reviewInfo}>
                  <div className={styles.reviewEmployee}>{reviewTarget.employee}</div>
                  <div className={styles.reviewMeta}>{reviewTarget.project} {'\u00B7'} {reviewTarget.date}</div>
                </div>
                <div className={styles.reviewAmount}>{reviewTarget.amount}</div>
              </div>
              <div className={styles.reviewDetail}>
                <span className={styles.reviewIcon}>{getIcon(reviewTarget.description)}</span>
                <span>{reviewTarget.description}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Comment - required to reject, optional to approve</label>
              <textarea
                className="field"
                style={{ minHeight: 80 }}
                placeholder="Add a note visible to the employee..."
                value={rejectComment}
                onChange={(event) => setRejectComment(event.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => resolveTeamExpense(reviewTarget, {
                  nextStatus: 'approved',
                  payload: {
                    id: reviewTarget.id,
                    email: managerEmail,
                  },
                  errorMessage: 'Unable to approve this expense request right now.',
                })}
                disabled={resolvingId === reviewTarget.id}
              >
                {resolvingId === reviewTarget.id && actionType === 'approved' ? 'Approving...' : 'Approve'}
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={confirmReject}
                disabled={!rejectComment.trim() || resolvingId === reviewTarget.id}
              >
                {resolvingId === reviewTarget.id && actionType === 'rejected' ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
