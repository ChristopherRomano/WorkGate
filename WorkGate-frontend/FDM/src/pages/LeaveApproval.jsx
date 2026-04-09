import { useState } from 'react';
import { employeeLeaveRequests } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';

export default function LeaveApproval() {
  const [requests, setRequests] = useState(employeeLeaveRequests);
  const [filter, setFilter] = useState('pending');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');

  const approve = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', comment: '' } : r));
  };

  const openReject = (request) => {
    setRejectTarget(request);
    setRejectComment('');
  };

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
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['pending', `Pending${pendingCount ? ` (${pendingCount})` : ''}`], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']].map(([val, label]) => (
          <button key={val} className={`btn ${filter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee Leave Requests</span>
        </div>
        <div style={{ padding: '8px 20px' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>No requests found.</div>
          )}
          {filtered.map(req => (
            <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--lime)', flexShrink: 0 }}>
                {req.initials}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{req.employee}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
                  {req.type} · {req.start}{req.start !== req.end ? ` – ${req.end}` : ''} · <strong style={{ color: 'var(--text)' }}>{req.days} day{req.days !== 1 ? 's' : ''}</strong>
                </div>
                {req.reason && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontStyle: 'italic' }}>"{req.reason}"</div>
                )}
                {req.status === 'rejected' && req.comment && (
                  <div style={{ fontSize: 11, color: 'var(--amber, #f59e0b)', marginTop: 4, fontFamily: 'var(--mono)' }}>Reason: {req.comment}</div>
                )}
              </div>

              {/* Status / Actions */}
              {req.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => approve(req.id)}>Approve</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red, #f87171)' }} onClick={() => openReject(req)}>Reject</button>
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

      {/* Reject Modal */}
      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Leave Request">
        <div className="form-grid">
          {rejectTarget && (
            <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', fontSize: 13 }}>
              <strong>{rejectTarget.employee}</strong> — {rejectTarget.type}<br />
              <span style={{ color: 'var(--text-dim)' }}>{rejectTarget.start}{rejectTarget.start !== rejectTarget.end ? ` – ${rejectTarget.end}` : ''} · {rejectTarget.days} day{rejectTarget.days !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="form-group">
            <label>Reason for Rejection <span style={{ color: 'var(--red, #f87171)' }}>*</span></label>
            <textarea
              className="field"
              style={{ minHeight: 90 }}
              placeholder="Provide a reason — this will be visible to the employee..."
              value={rejectComment}
              onChange={e => setRejectComment(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={confirmReject} disabled={!rejectComment.trim()} style={{ background: 'var(--red, #f87171)', borderColor: 'var(--red, #f87171)' }}>Confirm Rejection</button>
            <button className="btn btn-ghost" onClick={() => setRejectTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
