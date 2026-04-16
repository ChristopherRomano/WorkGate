import { useState } from 'react';
import { useEffect } from 'react';
import { cancelLeaveRequest, createLeaveRequest, fetchEmployeeProfile, fetchLeaveRequests } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import { useAuth } from '../context/AuthContext';
import { countBusinessDays, formatLeaveDate, getTodayDateString, isPastDate } from '../utils/leaveDates';
import styles from './Leave.module.css';

export default function Leave() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ start: '', end: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const userIdentifier = currentUser?.username || currentUser?.email || '';

  const leaveTotal = Number(currentUser?.leaveTotal ?? 25);
  const leaveBalance = Number(currentUser?.leaveBalance ?? 0);
  const usedDays = Math.max(0, leaveTotal - leaveBalance);
  const pct = leaveTotal > 0 ? (usedDays / leaveTotal) * 100 : 0;

  const mapStatus = (status) => {
    const value = String(status ?? '').toUpperCase();
    if (value === 'ACCEPTED') return 'approved';
    if (value === 'REJECTED') return 'rejected';
    return 'pending';
  };

  const toRow = (item) => {
    const startIso = new Date(item.startOfLeave).toISOString().split('T')[0];
    const endIso = new Date(item.endOfLeave).toISOString().split('T')[0];
    return {
      id: item.id,
      startOfLeave: item.startOfLeave,
      endOfLeave: item.endOfLeave,
      start: formatLeaveDate(item.startOfLeave),
      end: formatLeaveDate(item.endOfLeave),
      days: countBusinessDays(startIso, endIso),
      status: mapStatus(item.status),
    };
  };

  const refreshProfile = async () => {
    if (!userIdentifier) return;

    try {
      const profile = await fetchEmployeeProfile(userIdentifier);
      updateCurrentUser((previous) => ({
        ...previous,
        leaveBalance: Number(profile?.annualLeaveBalance ?? previous?.leaveBalance ?? 0),
        leaveTotal: Number(previous?.leaveTotal ?? 25),
      }));
    } catch {
      // Ignore profile refresh failures; the leave list still renders.
    }
  };

  const loadRequests = async () => {
    if (!userIdentifier) return;

    setLoading(true);
    try {
      const data = await fetchLeaveRequests(userIdentifier);
      setRequests(Array.isArray(data) ? data.map(toRow) : []);
      await refreshProfile();
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [userIdentifier]);

  const cancel = async (id) => {
    if (!userIdentifier) return;
    try {
      await cancelLeaveRequest(id, userIdentifier);
      await loadRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async () => {
    setSubmitError('');

    if (!form.start || !form.end) {
      setSubmitError('Please select both start and end dates.');
      return;
    }

    if (isPastDate(form.start) || isPastDate(form.end)) {
      setSubmitError('Leave dates cannot be in the past.');
      return;
    }

    if (!userIdentifier) {
      setSubmitError('Your session is missing user details. Please sign out and sign in again.');
      return;
    }

    if (new Date(`${form.end}T00:00:00`) < new Date(`${form.start}T00:00:00`)) {
      setSubmitError('End date cannot be before start date.');
      return;
    }

    if (countBusinessDays(form.start, form.end) <= 0) {
      setSubmitError('Selected dates must include at least one working day.');
      return;
    }

    setSubmitting(true);
    try {
      await createLeaveRequest({
        username: userIdentifier,
        creationTime: Date.now(),
        startOfLeave: new Date(`${form.start}T00:00:00`).getTime(),
        endOfLeave: new Date(`${form.end}T00:00:00`).getTime(),
        reason: form.notes,
      });
      setShowModal(false);
      setForm({ start: '', end: '', notes: '' });
      await loadRequests();
    } catch (error) {
      console.error(error);
      setSubmitError(error?.message || 'Could not submit leave request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade">
      <div className={styles.statsGrid}>
        {[
          { icon: '✅', val: usedDays, label: 'Days used' },
          { icon: '📅', val: leaveBalance, label: 'Days remaining', highlight: true },
          { icon: '⏳', val: requests.filter(r => r.status === 'pending').length, label: 'Pending requests' },
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
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Start</th><th>End</th><th>Days</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px 12px' }}>
                    No leave requests yet.
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
                      ? <button className="btn btn-danger" onClick={() => cancel(r.id)}>Cancel</button>
                      : <span className={styles.emptyCell}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSubmitError(''); }} title="Request Annual Leave">
        <div className="form-grid">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Start Date</label>
              <input className="field" type="date" min={getTodayDateString()} value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input className="field" type="date" min={form.start || getTodayDateString()} value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} />
            </div>
          </div>
          {form.start && form.end && (
            <div className={styles.dateHint}>
              📅 <strong className={styles.dateHintVal}>{countBusinessDays(form.start, form.end)} working day{countBusinessDays(form.start, form.end) !== 1 ? 's' : ''}</strong> selected
            </div>
          )}
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea className="field" placeholder="Any additional notes for your manager..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          {submitError && (
            <div style={{ color: 'var(--red)', fontSize: '12px' }}>{submitError}</div>
          )}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setShowModal(false); setSubmitError(''); }}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
