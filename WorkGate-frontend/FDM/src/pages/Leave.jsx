import { useEffect, useMemo, useState } from 'react';
import { cancelLeaveRequest, createLeaveRequest, fetchLeaveRequests } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import { useAuth } from '../context/AuthContext';
import styles from './Leave.module.css';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const mapLeaveStatus = (status) => {
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
};

const formatTimestamp = (timestamp) => {
  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) {
    return '-';
  }

  const parsed = new Date(numericTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return DATE_FORMATTER.format(parsed);
};

const calculateDays = (startTimestamp, endTimestamp) => {
  const startDate = new Date(Number(startTimestamp));
  const endDate = new Date(Number(endTimestamp));
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0;
  }

  const startUtc = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  const endUtc = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
  return Math.max(1, Math.round((endUtc - startUtc) / 86400000) + 1);
};

const toBackendTimestamp = (isoDate) => new Date(`${isoDate}T00:00:00`).getTime();

const mapLeaveRequest = (item) => ({
  id: item?.id,
  start: formatTimestamp(item?.startOfLeave),
  end: formatTimestamp(item?.endOfLeave),
  days: calculateDays(item?.startOfLeave, item?.endOfLeave),
  status: mapLeaveStatus(item?.status),
  createdAt: Number(item?.creationTime) || 0,
});

export default function Leave() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ start: '', end: '', notes: '' });

  const userEmail = currentUser?.email ?? currentUser?.username ?? '';
  const leaveBalance = Number(currentUser?.annualLeaveBalance ?? 10);
  const leaveTotal = Number(currentUser?.annualLeaveTotal ?? 25);
  const usedDays = Math.max(0, leaveTotal - leaveBalance);
  const pct = leaveTotal > 0 ? (usedDays / leaveTotal) * 100 : 0;

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const loadLeaveRequests = async () => {
    if (!userEmail) {
      setRequests([]);
      setLoadError('');
      return;
    }

    setLoading(true);
    setLoadError('');
    try {
      const leaveRequests = await fetchLeaveRequests(userEmail);
      const formatted = Array.isArray(leaveRequests)
        ? leaveRequests
            .map((item) => mapLeaveRequest(item))
            .sort((left, right) => right.createdAt - left.createdAt)
        : [];

      setRequests(formatted);
    }
    catch (error) {
      console.error(error);
      setRequests([]);
      setLoadError('Unable to load your leave requests right now.');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveRequests();
  }, [userEmail]);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === 'pending').length,
    [requests],
  );

  const submit = async () => {
    if (!form.start || !form.end || submitting) return;

    if (form.end < form.start) {
      setSubmitError('End date cannot be before start date.');
      return;
    }

    if (!userEmail) {
      setSubmitError('You must be signed in to create a leave request.');
      return;
    }

    const requestedDays = calculateDays(toBackendTimestamp(form.start), toBackendTimestamp(form.end));
    if (requestedDays > leaveBalance) {
      setSubmitError('Requested leave exceeds your available leave balance.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await createLeaveRequest({
        username: userEmail,
        creationTime: Date.now(),
        startOfLeave: toBackendTimestamp(form.start),
        endOfLeave: toBackendTimestamp(form.end),
        reason: form.notes,
      });

      setShowModal(false);
      setForm({ start: '', end: '', notes: '' });
      await loadLeaveRequests();
    } catch (error) {
      console.error(error);
      setSubmitError('Unable to submit your leave request right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = async (id) => {
    if (!id || !userEmail || cancellingId) {
      return;
    }

    setCancellingId(id);

    try {
      await cancelLeaveRequest(id, userEmail);
      await loadLeaveRequests();
    } catch (error) {
      console.error(error);
      setLoadError('Unable to cancel this leave request right now.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="animate-fade">
      <div className={styles.statsGrid}>
        {[
          { icon: '✅', val: usedDays, label: 'Days used' },
          { icon: '📅', val: leaveBalance, label: 'Days remaining', highlight: true },
          { icon: '⏳', val: pendingCount, label: 'Pending requests' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className={`card ${styles.balanceCard}`}>
        <div className="card-body">
          <div className={styles.balanceRow}>
            <span>Leave used this year</span>
            <span className={styles.balanceCount}>{usedDays} / {leaveTotal} days</span>
          </div>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Leave History</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Request Leave</button>
        </div>

        {loadError && (
          <div style={{ color: 'var(--danger)', padding: '0 16px 16px' }}>
            {loadError}
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Start</th><th>End</th><th>Days</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 16px' }}>
                    Loading leave requests...
                  </td>
                </tr>
              )}

              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 16px' }}>
                    No leave requests found.
                  </td>
                </tr>
              )}

              {requests.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.start}</strong></td>
                  <td>{r.end}</td>
                  <td>{r.days}</td>
                  <td><span className={`badge badge-${r.status}`}>{r.status.toUpperCase()}</span></td>
                  <td>
                    {r.status === 'pending'
                      ? <button className="btn btn-danger" onClick={() => cancel(r.id)} disabled={cancellingId === r.id}>{cancellingId === r.id ? 'Cancelling...' : 'Cancel'}</button>
                      : <span className={styles.emptyCell}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Annual Leave">
        <div className="form-grid">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Start Date</label>
              <input className="field" type="date" min={getTodayDate()} value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input className="field" type="date" min={form.start || getTodayDate()} value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} />
            </div>
          </div>
          {form.start && form.end && (
            <div className={styles.dateHint}>
              📅 <strong className={styles.dateHintVal}>{Math.max(0, leaveBalance - calculateDays(toBackendTimestamp(form.start), toBackendTimestamp(form.end)))} days</strong> remaining after approval
            </div>
          )}
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea className="field" placeholder="Any additional notes for your manager..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          {submitError && (
            <div style={{ color: 'var(--danger)', fontSize: 12 }}>
              {submitError}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
