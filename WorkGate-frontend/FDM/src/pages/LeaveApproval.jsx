
// leave approval

import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { approveLeaveRequest, fetchManagerLeaveRequests, rejectLeaveRequest } from '../api/api';
import '../styles/components.css';
import { countBusinessDays, formatLeaveDate } from '../utils/leaveDates';
import styles from './LeaveApproval.module.css';


export default function LeaveApproval() {

  //const [requests, setRequests] = useState(employeeLeaveRequests);
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [loading, setLoading] = useState(false);


  const mapStatus = (status) => {
    const value = String(status ?? '').toUpperCase();
    if (value === 'ACCEPTED') return 'approved';
    if (value === 'REJECTED') return 'rejected';
    return 'pending';
  };

  const loadRequests = async () => {
    if (!currentUser?.username) return;

    setLoading(true);
    try {
      const data = await fetchManagerLeaveRequests(currentUser.username);
      const formatted = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            employee: item.employeeEmail ?? item.employeeemail ?? item.employee ?? 'Unknown',
            type: 'Annual Leave',
            start: formatLeaveDate(item.startOfLeave),
            end: formatLeaveDate(item.endOfLeave),
            days: countBusinessDays(
              new Date(item.startOfLeave).toISOString().split('T')[0],
              new Date(item.endOfLeave).toISOString().split('T')[0],
            ),
            reason: item.reason ?? '',
            status: mapStatus(item.status),
            comment: '',
          }))
        : [];

      setRequests(formatted);
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [currentUser?.username]);

  const approve = async (id) => {
    if (!currentUser?.username) return;
    try {
      await approveLeaveRequest(id, currentUser.username);
      await loadRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const openReject = (request) => { setRejectTarget(request); setRejectComment(''); };

  const confirmReject = async () => {
    if (!rejectComment.trim()) return;
    if (!currentUser?.username) return;
    try {
      await rejectLeaveRequest(rejectTarget.id, currentUser.username);
      setRejectTarget(null);
      setRejectComment('');
      await loadRequests();
    } catch (error) {
      console.error(error);
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
        <div className={styles.listBody}>
          {loading && <div className={styles.empty}>Loading requests...</div>}
          {!loading && filtered.length === 0 && <div className={styles.empty}>No requests found.</div>}
          {filtered.map(req => (
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
                  <button className="btn btn-primary btn-sm" onClick={() => approve(req.id)}>Approve</button>
                  <button className={`btn btn-ghost btn-sm ${styles.rejectBtn}`} onClick={() => openReject(req)}>Reject</button>
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
            <button className={`btn btn-primary ${styles.confirmRejectBtn}`} onClick={confirmReject} disabled={!rejectComment.trim()}>Confirm Rejection</button>
            <button className="btn btn-ghost" onClick={() => setRejectTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}