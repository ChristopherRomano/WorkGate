import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAllHrReports, claimHrReport, resolveHrReport } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './HRManagement.module.css';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const mapStatus = (s) => {
  switch (String(s ?? '').toUpperCase()) {
    case 'RESOLVED':    return 'resolved';
    case 'IN_PROGRESS': return 'inprogress';
    default:            return 'pending';
  }
};

const mapReport = (item) => ({
  id: item.id,
  title: item.title ?? '',
  content: item.content ?? '',
  anon: item.anonymous ?? false,
  employee: item.anonymous ? null : (item.employeeEmail ?? ''),
  initials: item.anonymous ? '?' : (item.employeeEmail ?? '?')[0]?.toUpperCase() ?? '?',
  claimedByEmail: item.claimedByEmail ?? null,
  resolution: item.resolution ?? '',
  status: mapStatus(item.status),
  date: item.creationTime ? DATE_FORMATTER.format(new Date(Number(item.creationTime))) : '—',
});

const STATUS_BADGE = (s) => {
  if (s === 'resolved')   return 'approved';
  if (s === 'inprogress') return 'pending';
  return 'open';
};

const STATUS_LABEL = (s) => {
  if (s === 'inprogress') return 'IN PROGRESS';
  return s.toUpperCase();
};

export default function HRManagement() {
  const { currentUser } = useAuth();
  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadError, setLoadError]     = useState('');
  const [actionError, setActionError] = useState('');
  const [filter, setFilter]           = useState('all');
  const [selected, setSelected]       = useState(null);
  const [closeComment, setCloseComment] = useState('');
  const [closeError, setCloseError]   = useState('');
  const [resolving, setResolving]     = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchAllHrReports();
      setReports(Array.isArray(data) ? data.map(mapReport) : []);
    } catch {
      setLoadError('Unable to load reports right now.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const pending  = reports.filter(r => r.status === 'pending').length;

  const claim = async (id) => {
    setActionError('');
    try {
      await claimHrReport(id, currentUser?.email ?? '');
      await loadReports();
    } catch (e) {
      setActionError(e.message || 'Unable to claim report.');
    }
  };

  const openClose = (r) => { setSelected(r); setCloseComment(''); setCloseError(''); };

  const confirmClose = async () => {
    if (!closeComment.trim()) { setCloseError('Please provide a resolution.'); return; }
    if (resolving || !selected) return;
    setResolving(true);
    setCloseError('');
    try {
      await resolveHrReport(selected.id, closeComment.trim());
      setSelected(null);
      await loadReports();
    } catch (e) {
      setCloseError(e.message || 'Unable to resolve report.');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="animate-fade">
      {actionError && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--danger)' }}>
          {actionError}
        </div>
      )}
      {loadError && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--danger)' }}>
          {loadError}
        </div>
      )}

      <div className={styles.filters}>
        {[
          ['all',        'All'],
          ['pending',    `Pending${pending ? ` (${pending})` : ''}`],
          ['inprogress', 'In Progress'],
          ['resolved',   'Resolved'],
        ].map(([val, label]) => (
          <button key={val} className={`btn ${filter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee HR Reports</span>
          <span className={styles.count}>{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.listBody}>
          {loading && <div className={styles.empty}>Loading reports…</div>}
          {!loading && filtered.length === 0 && <div className={styles.empty}>No reports found.</div>}
          {!loading && filtered.map(r => (
            <div key={r.id} className={styles.reportRow}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatar}>{r.initials}</div>
              </div>
              <div className={styles.info}>
                <div className={styles.reportTitle}>{r.title}</div>
                <div className={styles.reportMeta}>
                  {r.anon ? 'Anonymous submission' : r.employee} · {r.date}
                  {r.claimedByEmail && <span> · Claimed by <strong>{r.claimedByEmail}</strong></span>}
                </div>
                <div className={styles.reportContent}>{r.content}</div>
                {r.resolution && (
                  <div className={styles.resolution}>Resolution: {r.resolution}</div>
                )}
              </div>
              <div className={styles.actions}>
                <span className={`badge badge-${STATUS_BADGE(r.status)}`}>{STATUS_LABEL(r.status)}</span>
                {r.status === 'pending' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => claim(r.id)}>Claim</button>
                )}
                {r.status === 'inprogress' && r.claimedByEmail === currentUser?.email && (
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
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>{selected.content}</div>
            </div>
          )}
          <div className="form-group">
            <label>Resolution / Outcome <span className={styles.required}>*</span></label>
            <textarea
              className="field"
              style={{ minHeight: 100 }}
              placeholder="Describe the outcome or action taken — this will be visible to the employee..."
              value={closeComment}
              onChange={e => { setCloseComment(e.target.value); if (closeError) setCloseError(''); }}
            />
            {closeError && <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{closeError}</div>}
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={confirmClose} disabled={!closeComment.trim() || resolving}>
              {resolving ? 'Resolving…' : 'Mark Resolved'}
            </button>
            <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
