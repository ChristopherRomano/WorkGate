
// leave approval

import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './LeaveApproval.module.css';


export default function LeaveApproval() {

  //const [requests, setRequests] = useState(employeeLeaveRequests);
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');



  const fetchLeaveRequests = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/annualLeave?Username=${currentUser.name}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leave requests");
    }

    const data = await response.json();

    console.log(data);
    
    const formatted = data.map((item, index) => ({
      id: index,

      employee: item.username ?? item.name ?? "Unknown",
      type: "Annual Leave",

      start: item.start ?? item.startDate ?? "",
      end: item.end ?? item.endDate ?? "",

      days: 1,
      reason: item.reason ?? "",

      status: "pending",
      comment: ""
    }));

    setRequests(formatted);

  } catch (error) {
    console.error(error);
  }
  };

  useEffect(() => {
  fetchLeaveRequests();
}, [currentUser]);

  

  const approve = (id) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', comment: '' } : r));

  const openReject = (request) => { setRejectTarget(request); setRejectComment(''); };

  const confirmReject = () => {
    if (!rejectComment.trim()) return;
    setRequests(prev => prev.map(r => r.id === rejectTarget.id ? { ...r, status: 'rejected', comment: rejectComment.trim() } : r));
    setRejectTarget(null);
    setRejectComment('');
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
          {filtered.length === 0 && <div className={styles.empty}>No requests found.</div>}
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