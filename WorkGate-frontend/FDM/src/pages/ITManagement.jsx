import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAllItTickets, claimItTicket, resolveItTicket, fetchEmployees, unlockAccount } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ITManagement.module.css';

const STATUS_BADGE = { OPEN: 'open', IN_PROGRESS: 'pending', RESOLVED: 'approved' };
const STATUS_LABEL = { OPEN: 'OPEN', IN_PROGRESS: 'IN PROGRESS', RESOLVED: 'RESOLVED' };

export default function ITManagement() {
  const { currentUser } = useAuth();

  const [tickets, setTickets]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState('');
  const [filter, setFilter]             = useState('all');
  const [selected, setSelected]         = useState(null);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [resolveMessage, setResolveMessage] = useState('');
  const [resolveError, setResolveError] = useState('');
  const [resolving, setResolving]       = useState(false);
  const [actionError, setActionError]   = useState('');

  const [unlockSearch, setUnlockSearch] = useState('');
  const [unlockResult, setUnlockResult] = useState(null);
  const [unlocking, setUnlocking]       = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [ticketData, empData] = await Promise.all([
        fetchAllItTickets(),
        fetchEmployees(),
      ]);
      setTickets(Array.isArray(ticketData) ? ticketData : []);
      setAllEmployees(Array.isArray(empData) ? empData : []);
    } catch {
      setLoadError('Unable to load tickets right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleClaim = async (id) => {
    setActionError('');
    try {
      await claimItTicket(id, currentUser?.email ?? '');
      await loadData();
    } catch (e) {
      setActionError(e.message || 'Unable to claim ticket.');
    }
  };

  const openResolve = (ticket) => {
    setResolveTarget(ticket);
    setResolveMessage('');
    setResolveError('');
  };

  const confirmResolve = async () => {
    if (!resolveMessage.trim()) { setResolveError('Please provide a resolution message.'); return; }
    if (resolving || !resolveTarget) return;
    setResolving(true);
    setResolveError('');
    try {
      await resolveItTicket(resolveTarget.id, resolveMessage.trim());
      setResolveTarget(null);
      if (selected?.id === resolveTarget.id) setSelected(null);
      await loadData();
    } catch (e) {
      setResolveError(e.message || 'Unable to resolve ticket.');
    } finally {
      setResolving(false);
    }
  };

  const searchUnlock = () => {
    const q = unlockSearch.trim().toLowerCase();
    if (!q) return;
    const found = allEmployees.find(e =>
      e.email?.toLowerCase().includes(q) || e.name?.toLowerCase().includes(q)
    );
    setUnlockResult(found ? { ...found, done: false } : { notFound: true });
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await unlockAccount(unlockResult.email);
      setUnlockResult(r => ({ ...r, done: true }));
    } catch (e) {
      setActionError(e.message || 'Unable to unlock account.');
    } finally {
      setUnlocking(false);
    }
  };

  const filtered = filter === 'all'
    ? tickets
    : tickets.filter(t => t.status === filter.toUpperCase());

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

      <div className={styles.layout}>
        {/* Ticket list */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.filters}>
            {[['all', 'All'], ['open', 'Open'], ['in_progress', 'In Progress'], ['resolved', 'Resolved']].map(([val, label]) => (
              <button key={val} className={`btn ${filter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">IT Support Tickets</span>
              <span className={styles.count}>{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className={styles.listBody}>
              {loading && <div className={styles.empty}>Loading…</div>}
              {!loading && filtered.length === 0 && <div className={styles.empty}>No tickets found.</div>}
              {!loading && filtered.map(t => (
                <div key={t.id} className={styles.ticketRow}>
                  <div className={styles.ticketMain}>
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketId}>#{t.id}</span>
                      <span className={`badge badge-${STATUS_BADGE[t.status] ?? 'open'}`}>
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                      <span className={styles.ticketCat}>{t.category}</span>
                    </div>
                    <div className={styles.ticketTitle}>{t.title}</div>
                    <div className={styles.ticketDesc}>{t.description}</div>
                    <div className={styles.ticketMeta}>
                      Submitted by: {t.employeeEmail} · {t.claimedByEmail ? `Claimed by ${t.claimedByEmail}` : 'Unclaimed'}
                    </div>
                  </div>
                  <div className={styles.ticketActions}>
                    {!t.claimedByEmail && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleClaim(t.id)}>Claim</button>
                    )}
                    {t.claimedByEmail && t.status === 'IN_PROGRESS' && (
                      <button className="btn btn-primary btn-sm" onClick={() => openResolve(t)}>Resolve</button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(t)}>Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unlock panel */}
        <div className={`card ${styles.unlockPanel}`}>
          <div className="card-header"><span className="card-title">Unlock Account</span></div>
          <div className={styles.unlockBody}>
            <p className={styles.unlockHint}>Search by name or email to unlock a locked account.</p>
            <div className="form-group">
              <input
                className="field"
                placeholder="Name or email…"
                value={unlockSearch}
                onChange={e => { setUnlockSearch(e.target.value); setUnlockResult(null); }}
                onKeyDown={e => e.key === 'Enter' && searchUnlock()}
              />
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={searchUnlock}>
              Search
            </button>
            {unlockResult && !unlockResult.notFound && (
              <div className={styles.unlockCard}>
                <div className={styles.unlockAvatar}>{unlockResult.initials ?? unlockResult.email?.[0]?.toUpperCase()}</div>
                <div>
                  <div className={styles.unlockName}>{unlockResult.name ?? unlockResult.email}</div>
                  <div className={styles.unlockEmail}>{unlockResult.email}</div>
                  {unlockResult.done
                    ? <div className={styles.unlockSuccess}>Account unlocked.</div>
                    : <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={handleUnlock} disabled={unlocking}>{unlocking ? 'Unlocking…' : 'Unlock Account'}</button>
                  }
                </div>
              </div>
            )}
            {unlockResult?.notFound && <div className={styles.unlockNotFound}>No employee found.</div>}
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      <Modal isOpen={!!resolveTarget} onClose={() => setResolveTarget(null)} title="Resolve Ticket">
        {resolveTarget && (
          <div className="form-grid">
            <div className={styles.detailBox}>
              <div className={styles.detailRow}><span>Ticket</span><strong>#{resolveTarget.id}</strong></div>
              <div className={styles.detailRow}><span>Submitted by</span><strong>{resolveTarget.employeeEmail}</strong></div>
              <div className={styles.detailRow}><span>Category</span><strong>{resolveTarget.category}</strong></div>
            </div>
            <div className="form-group">
              <label>Issue</label>
              <div className={styles.detailText}>{resolveTarget.title}</div>
            </div>
            <div className="form-group">
              <label>Resolution / Response <span style={{ color: 'var(--danger)' }}>*</span></label>
              <textarea
                className="field"
                style={{ minHeight: 100 }}
                placeholder="Describe what was done to resolve this issue — this will be visible to the employee..."
                value={resolveMessage}
                onChange={e => { setResolveMessage(e.target.value); if (resolveError) setResolveError(''); }}
              />
              {resolveError && <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{resolveError}</div>}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={confirmResolve} disabled={resolving || !resolveMessage.trim()}>
                {resolving ? 'Resolving…' : 'Mark Resolved'}
              </button>
              <button className="btn btn-ghost" onClick={() => setResolveTarget(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Details Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Ticket Details">
        {selected && (
          <div className="form-grid">
            <div className={styles.detailBox}>
              <div className={styles.detailRow}><span>ID</span><strong>#{selected.id}</strong></div>
              <div className={styles.detailRow}><span>Category</span><strong>{selected.category}</strong></div>
              <div className={styles.detailRow}><span>Submitted by</span><strong>{selected.employeeEmail}</strong></div>
              <div className={styles.detailRow}><span>Status</span>
                <span className={`badge badge-${STATUS_BADGE[selected.status] ?? 'open'}`}>
                  {STATUS_LABEL[selected.status] ?? selected.status}
                </span>
              </div>
              <div className={styles.detailRow}><span>Claimed by</span><strong>{selected.claimedByEmail ?? 'Unclaimed'}</strong></div>
            </div>
            <div className="form-group">
              <label>Title</label>
              <div className={styles.detailText}>{selected.title}</div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <div className={styles.detailText}>{selected.description}</div>
            </div>
            {selected.resolutionMessage && (
              <div className="form-group">
                <label>Resolution</label>
                <div className={styles.detailText}>{selected.resolutionMessage}</div>
              </div>
            )}
            <div className="modal-actions">
              {!selected.claimedByEmail && (
                <button className="btn btn-ghost" onClick={async () => { await handleClaim(selected.id); setSelected(null); }}>Claim</button>
              )}
              {selected.claimedByEmail && selected.status === 'IN_PROGRESS' && (
                <button className="btn btn-primary" onClick={() => { setSelected(null); openResolve(selected); }}>Resolve</button>
              )}
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
