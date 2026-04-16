import { useState } from 'react';
import { hrReports as initial } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './HRManagement.module.css';

export default function HRManagement() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState(initial);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [closeComment, setCloseComment] = useState('');

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const pending = reports.filter(r => r.status === 'pending').length;

  const claim = (id) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, claimedBy: currentUser.name, status: 'inprogress' } : r));

  const openClose = (r) => { setSelected(r); setCloseComment(''); };

  const confirmClose = () => {
    if (!closeComment.trim()) return;
    setReports(prev => prev.map(r => r.id === selected.id ? { ...r, status: 'resolved', resolution: closeComment.trim() } : r));
    setSelected(null);
  };

  const statusBadge = (s) => {
    if (s === 'resolved')   return 'approved';
    if (s === 'inprogress') return 'pending';
    return 'open';
  };

  const statusLabel = (s) => {
    if (s === 'inprogress') return 'IN PROGRESS';
    return s.toUpperCase();
  };

  return (
    <div className="animate-fade">
      <div className={styles.filters}>
        {[
          ['all', 'All'],
          ['pending', `Pending${pending ? ` (${pending})` : ''}`],
          ['inprogress', 'In Progress'],
          ['resolved', 'Resolved'],
        ].map(([val, label]) => (
          <button key={val} className={`btn ${filter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee HR Reports</span>
          <span className={styles.count}>{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.listBody}>
          {filtered.length === 0 && <div className={styles.empty}>No reports found.</div>}
          {filtered.map(r => (
            <div key={r.id} className={styles.reportRow}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatar}>{r.anon ? '?' : r.initials}</div>
              </div>
              <div className={styles.info}>
                <div className={styles.reportTitle}>{r.title}</div>
                <div className={styles.reportMeta}>
                  {r.anon ? 'Anonymous submission' : r.employee} · {r.date}
                  {r.claimedBy && <span> · Claimed by <strong>{r.claimedBy}</strong></span>}
                </div>
                <div className={styles.reportContent}>{r.content}</div>
                {r.resolution && (
                  <div className={styles.resolution}>Resolution: {r.resolution}</div>
                )}
              </div>
              <div className={styles.actions}>
                <span className={`badge badge-${statusBadge(r.status)}`}>{statusLabel(r.status)}</span>
                {r.status === 'pending' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => claim(r.id)}>Claim</button>
                )}
                {r.status === 'inprogress' && r.claimedBy === currentUser.name && (
                  <button className="btn btn-primary btn-sm" onClick={() => openClose(r)}>Resolve</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Resolve Report">
        <div className="form-grid">
          {selected && (
            <div className={styles.resolveSummary}>
              <strong>{selected.title}</strong>
              <span className={styles.resolveMeta}>{selected.anon ? 'Anonymous' : selected.employee} · {selected.date}</span>
            </div>
          )}
          <div className="form-group">
            <label>Resolution / Outcome <span className={styles.required}>*</span></label>
            <textarea
              className="field"
              style={{ minHeight: 100 }}
              placeholder="Describe the outcome or action taken..."
              value={closeComment}
              onChange={e => setCloseComment(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={confirmClose} disabled={!closeComment.trim()}>Mark Resolved</button>
            <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
