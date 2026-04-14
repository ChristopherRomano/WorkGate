import { useState } from 'react';
import { itTickets as initial, employees } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ITManagement.module.css';

const STATUS_CYCLE = { open: 'progress', progress: 'resolved' };
const STATUS_LABEL = { open: 'OPEN', progress: 'IN PROGRESS', resolved: 'RESOLVED' };

export default function ITManagement() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState(
    initial.map(t => ({ ...t, status: t.status ?? 'open', claimedBy: null }))
  );
  const [filter, setFilter] = useState('all');
  const [unlockSearch, setUnlockSearch] = useState('');
  const [unlockResult, setUnlockResult] = useState(null);
  const [selected, setSelected] = useState(null);

  const claim = (id) =>
    setTickets(prev => prev.map(t => t.id === id ? { ...t, claimedBy: currentUser.name } : t));

  const advance = (id) =>
    setTickets(prev => prev.map(t =>
      t.id === id && STATUS_CYCLE[t.status]
        ? { ...t, status: STATUS_CYCLE[t.status] }
        : t
    ));

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const searchUnlock = () => {
    const emp = employees.find(e =>
      e.email.toLowerCase().includes(unlockSearch.toLowerCase()) ||
      e.name.toLowerCase().includes(unlockSearch.toLowerCase())
    );
    setUnlockResult(emp ? { ...emp, unlocked: false } : { notFound: true });
  };

  const doUnlock = () => setUnlockResult(r => ({ ...r, unlocked: true }));

  return (
    <div className="animate-fade">
      <div className={styles.layout}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Filters */}
          <div className={styles.filters}>
            {[['all', 'All'], ['open', 'Open'], ['progress', 'In Progress'], ['resolved', 'Resolved']].map(([val, label]) => (
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
                      <span className={styles.ticketId}>{t.id}</span>
                      <span className={`badge badge-${t.status === 'resolved' ? 'approved' : t.status === 'progress' ? 'pending' : 'open'}`}>
                        {STATUS_LABEL[t.status] ?? t.status.toUpperCase()}
                      </span>
                      <span className={styles.ticketCat}>{t.category}</span>
                    </div>
                    <div className={styles.ticketTitle}>{t.title}</div>
                    <div className={styles.ticketDesc}>{t.desc}</div>
                    <div className={styles.ticketMeta}>
                      {t.date} · {t.claimedBy ? `Claimed by ${t.claimedBy}` : 'Unclaimed'}
                    </div>
                  </div>
                  <div className={styles.ticketActions}>
                    {!t.claimedBy && (
                      <button className="btn btn-ghost btn-sm" onClick={() => claim(t.id)}>Claim</button>
                    )}
                    {t.claimedBy && t.status !== 'resolved' && (
                      <button className="btn btn-primary btn-sm" onClick={() => advance(t.id)}>
                        {t.status === 'open' ? 'Start' : 'Resolve'}
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(t)}>Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — unlock accounts */}
        <div className="card" style={{ alignSelf: 'start', width: 300, flexShrink: 0 }}>
          <div className="card-header"><span className="card-title">Unlock Account</span></div>
          <div className={styles.unlockBody}>
            <p className={styles.unlockHint}>Search by employee name or email to unlock a locked account.</p>
            <div className="form-group">
              <input
                className="field"
                placeholder="Name or email..."
                value={unlockSearch}
                onChange={e => { setUnlockSearch(e.target.value); setUnlockResult(null); }}
                onKeyDown={e => e.key === 'Enter' && searchUnlock()}
              />
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={searchUnlock}>Search</button>

            {unlockResult && !unlockResult.notFound && (
              <div className={styles.unlockCard}>
                <div className={styles.unlockAvatar}>{unlockResult.initials}</div>
                <div>
                  <div className={styles.unlockName}>{unlockResult.name}</div>
                  <div className={styles.unlockEmail}>{unlockResult.email}</div>
                  {unlockResult.unlocked
                    ? <div className={styles.unlockSuccess}>Account unlocked.</div>
                    : <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={doUnlock}>Unlock Account</button>
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

      {/* Ticket detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Ticket Details">
        {selected && (
          <div className="form-grid">
            <div className={styles.detailBox}>
              <div className={styles.detailRow}><span>ID</span><strong>{selected.id}</strong></div>
              <div className={styles.detailRow}><span>Category</span><strong>{selected.category}</strong></div>
              <div className={styles.detailRow}><span>Date</span><strong>{selected.date}</strong></div>
              <div className={styles.detailRow}><span>Status</span>
                <span className={`badge badge-${selected.status === 'resolved' ? 'approved' : 'pending'}`}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
              <div className={styles.detailRow}><span>Claimed by</span><strong>{selected.claimedBy ?? 'Unclaimed'}</strong></div>
            </div>
            <div className="form-group">
              <label>Title</label>
              <div className={styles.detailText}>{selected.title}</div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <div className={styles.detailText}>{selected.desc}</div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
