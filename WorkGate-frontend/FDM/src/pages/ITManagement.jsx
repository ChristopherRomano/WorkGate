import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchItTickets, claimTicket, advanceTicket, unlockAccount, fetchEmployees } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ITManagement.module.css';

const STATUS_LABEL = { OPEN: 'OPEN', IN_PROGRESS: 'IN PROGRESS', RESOLVED: 'RESOLVED' };
const STATUS_BADGE = { OPEN: 'open', IN_PROGRESS: 'pending', RESOLVED: 'approved' };

export default function ITManagement() {
  const { currentUser } = useAuth();

  const [tickets, setTickets]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [selected, setSelected]       = useState(null);
  const [actionError, setActionError] = useState('');

  // Unlock panel
  const [unlockSearch, setUnlockSearch]   = useState('');
  const [unlockResult, setUnlockResult]   = useState(null);
  const [unlocking, setUnlocking]         = useState(false);
  const [allEmployees, setAllEmployees]   = useState([]);

  useEffect(() => {
    Promise.all([fetchItTickets(), fetchEmployees()])
      .then(([ticketData, empData]) => {
        setTickets(ticketData);
        setAllEmployees(empData);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Ticket actions ────────────────────────────────────────────────────────

  const handleClaim = async (id) => {
    setActionError('');
    try {
      const updated = await claimTicket(id, currentUser.email);
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (e) {
      setActionError(e.message);
    }
  };

  const handleAdvance = async (id) => {
    setActionError('');
    try {
      const updated = await advanceTicket(id);
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
      if (selected?.id === id) setSelected(updated);
    } catch (e) {
      setActionError(e.message);
    }
  };

  // ── Unlock ────────────────────────────────────────────────────────────────

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
      setActionError(e.message);
    } finally {
      setUnlocking(false);
    }
  };

  const filtered = filter === 'all'
    ? tickets
    : tickets.filter(t => t.status === filter.toUpperCase());

  if (loading) return <div className="animate-fade" style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading…</div>;

  return (
    <div className="animate-fade">
      {actionError && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--danger)' }}>
          {actionError}
        </div>
      )}

      <div className={styles.layout}>
        {/* ── Ticket list ───────────────────────────────────────────────────── */}
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
              {filtered.length === 0 && <div className={styles.empty}>No tickets found.</div>}
              {filtered.map(t => (
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
                      Submitted by: {t.username} · {t.claimedByEmail ? `Claimed by ${t.claimedByEmail}` : 'Unclaimed'}
                    </div>
                  </div>
                  <div className={styles.ticketActions}>
                    {!t.claimedByEmail && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleClaim(t.id)}>Claim</button>
                    )}
                    {t.claimedByEmail && t.status !== 'RESOLVED' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleAdvance(t.id)}>
                        {t.status === 'OPEN' ? 'Start' : 'Resolve'}
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(t)}>Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Unlock panel ─────────────────────────────────────────────────── */}
        <div className="card" style={{ alignSelf: 'start', width: 300, flexShrink: 0 }}>
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
            <button
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={searchUnlock}
            >
              Search
            </button>

            {unlockResult && !unlockResult.notFound && (
              <div className={styles.unlockCard}>
                <div className={styles.unlockAvatar}>{unlockResult.initials}</div>
                <div>
                  <div className={styles.unlockName}>{unlockResult.name}</div>
                  <div className={styles.unlockEmail}>{unlockResult.email}</div>
                  {unlockResult.done
                    ? <div className={styles.unlockSuccess}>Account unlocked.</div>
                    : (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: 8 }}
                        onClick={handleUnlock}
                        disabled={unlocking}
                      >
                        {unlocking ? 'Unlocking…' : 'Unlock Account'}
                      </button>
                    )
                  }
                </div>
              </div>
            )}
            {unlockResult?.notFound && (
              <div className={styles.unlockNotFound}>No employee found.</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Ticket detail modal ───────────────────────────────────────────── */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Ticket Details">
        {selected && (
          <div className="form-grid">
            <div className={styles.detailBox}>
              <div className={styles.detailRow}><span>ID</span><strong>#{selected.id}</strong></div>
              <div className={styles.detailRow}><span>Category</span><strong>{selected.category}</strong></div>
              <div className={styles.detailRow}><span>Submitted by</span><strong>{selected.username}</strong></div>
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
            <div className="modal-actions">
              {selected.claimedByEmail && selected.status !== 'RESOLVED' && (
                <button className="btn btn-primary" onClick={() => handleAdvance(selected.id)}>
                  {selected.status === 'OPEN' ? 'Start' : 'Resolve'}
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
