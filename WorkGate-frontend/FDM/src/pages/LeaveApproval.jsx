import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchManagerLeaveRequests, resolveLeaveRequest } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './LeaveApproval.module.css';

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

const calculateDays = (startTimestamp, endTimestamp) => {
  const startDate = new Date(Number(startTimestamp));
  const endDate = new Date(Number(endTimestamp));
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0;
  }

  const startUtc = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  const endUtc = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

  let count = 0;
  let current = startUtc;
  while (current <= endUtc) {
    const dow = new Date(current).getUTCDay();
    if (dow !== 0 && dow !== 6) count++;
    current += 86400000;
  }
  return Math.max(1, count);
};

const formatDate = (timestamp) => {
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

const mapLeaveRequest = (item) => ({
  id: item?.id,
  employee: item?.employeeEmail ?? 'Unknown',
  type: 'Annual Leave',
  start: formatDate(item?.startOfLeave),
  end: formatDate(item?.endOfLeave),
  days: calculateDays(item?.startOfLeave, item?.endOfLeave),
  reason: item?.reason ?? '',
  status: mapLeaveStatus(item?.status),
  comment: '',
});

export default function LeaveApproval() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');

  const fetchLeaveRequests = async () => {
    const managerEmail = currentUser?.email ?? '';
    if (!managerEmail) {
      setRequests([]);
      setLoadError('');
      return;
    }

    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchManagerLeaveRequests(managerEmail);
      const formatted = Array.isArray(data)
        ? data.map((item) => mapLeaveRequest(item))
        : [];

      setRequests(formatted);
    } catch (error) {
      console.error(error);
      setRequests([]);
      setLoadError('Unable to load leave requests for your team right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, [currentUser]);

  const approve = async (request) => {
    if (!request?.id || resolvingId) {
      return;
    }

    setResolvingId(request.id);
    setActionError('');

    try {
      await resolveLeaveRequest({ id: request.id, reason: '' });
      setRequests((prev) => prev.map((item) => (
        item.id === request.id ? { ...item, status: 'approved', comment: '' } : item
      )));
    } catch (error) {
      console.error(error);
      setActionError('Unable to approve this leave request right now.');
    } finally {
      setResolvingId(null);
    }
  };

  const openReject = (request) => { setRejectTarget(request); setRejectComment(''); };

  const confirmReject = async () => {
    if (!rejectComment.trim() || !rejectTarget?.id || resolvingId) return;

    setResolvingId(rejectTarget.id);
    setActionError('');

    try {
      await resolveLeaveRequest({ id: rejectTarget.id, reason: rejectComment.trim() });
      setRequests((prev) => prev.map((item) => (
        item.id === rejectTarget.id
          ? { ...item, status: 'rejected', comment: rejectComment.trim() }
          : item
      )));
      setRejectTarget(null);
      setRejectComment('');
    } catch (error) {
      console.error(error);
      setActionError('Unable to reject this leave request right now.');
    } finally {
      setResolvingId(null);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="animate-fade">
      <div className={styles.filters}>
        {[['pending', `Pending${pendingCount ? ` (${pendingCount})` : ''}`], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']].map(([val, label]) => (
          <button key={val} className={`btn ${filter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee Leave Requests</span>
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

        <div className={styles.listBody}>
          {loading && <div className={styles.empty}>Loading requests...</div>}
          {!loading && filtered.length === 0 && <div className={styles.empty}>No requests found.</div>}
          {!loading && filtered.map(req => (
            <div key={req.id} className={styles.requestRow}>
              <div className={styles.info}>
                <div className={styles.employeeName}>{req.employee}</div>
                <div className={styles.meta}>
                  {req.type} · {req.start}{req.start !== req.end ? ` – ${req.end}` : ''} · <strong className={styles.metaStrong}>{req.days} day{req.days !== 1 ? 's' : ''}</strong>
                </div>
                {req.reason && <div className={styles.reason}>"{req.reason}"</div>}
                {req.status === 'rejected' && req.comment && (
                  <div className={styles.rejectReason}>Reason: {req.comment}</div>
                )}
              </div>
              {req.status === 'pending' ? (
                <div className={styles.actions}>
                  <button className="btn btn-primary btn-sm" onClick={() => approve(req)} disabled={resolvingId === req.id}>{resolvingId === req.id ? 'Working...' : 'Approve'}</button>
                  <button className={`btn btn-ghost btn-sm ${styles.rejectBtn}`} onClick={() => openReject(req)} disabled={resolvingId === req.id}>Reject</button>
                </div>
              ) : (
                <span className={`badge badge-${req.status === 'approved' ? 'approved' : 'rejected'}`}>
                  {req.status.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Leave Request">
        <div className="form-grid">
          {rejectTarget && (
            <div className={styles.rejectSummary}>
              <strong>{rejectTarget.employee}</strong> — {rejectTarget.type}<br />
              <span className={styles.rejectSummaryMeta}>
                {rejectTarget.start}{rejectTarget.start !== rejectTarget.end ? ` – ${rejectTarget.end}` : ''} · {rejectTarget.days} day{rejectTarget.days !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <div className="form-group">
            <label>Reason for Rejection <span className={styles.requiredStar}>*</span></label>
            <textarea
              className="field"
              style={{ minHeight: 90 }}
              placeholder="Provide a reason — this will be visible to the employee..."
              value={rejectComment}
              onChange={e => setRejectComment(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className={`btn btn-primary ${styles.confirmRejectBtn}`} onClick={confirmReject} disabled={!rejectComment.trim() || resolvingId === rejectTarget?.id}>{resolvingId === rejectTarget?.id ? 'Rejecting...' : 'Confirm Rejection'}</button>
            <button className="btn btn-ghost" onClick={() => setRejectTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}