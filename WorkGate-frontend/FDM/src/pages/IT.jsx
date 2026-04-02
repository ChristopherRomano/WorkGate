import { useState } from 'react';
import { itTickets as initial } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './IT.module.css';

const KB = [
  { q: 'How do I reset my password?', tag: 'Access', time: '2 min read' },
  { q: 'VPN setup guide for remote working', tag: 'Network', time: '5 min read' },
  { q: 'How to install required software on your laptop', tag: 'Software', time: '3 min read' },
  { q: 'Setting up multi-factor authentication (MFA)', tag: 'Access', time: '4 min read' },
  { q: 'Requesting a new hardware device', tag: 'Hardware', time: '2 min read' },
];

export default function IT() {
  const [tickets, setTickets] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', category: 'Software', priority: 'Medium', desc: '' });

  const submit = () => {
    if (!form.title) return;
    setTickets(prev => [
      { id: `IT-${String(Math.floor(Math.random() * 900) + 100)}`, title: form.title, desc: form.desc, category: form.category, date: 'Today', status: 'open' },
      ...prev,
    ]);
    setShowModal(false);
    setForm({ title: '', category: 'Software', priority: 'Medium', desc: '' });
  };

  const filteredKB = KB.filter(k => k.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade">
      {/* My Tickets */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <span className="card-title">My Tickets</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Raise Ticket</button>
        </div>
        <div style={{ padding: '10px 20px' }}>
          {tickets.map(t => (
            <div key={t.id} className={styles.ticketCard}>
              <div className={styles.ticketId}>{t.id}</div>
              <div style={{ flex: 1 }}>
                <div className={styles.ticketTitle}>{t.title}</div>
                <div className={styles.ticketDesc}>{t.desc}</div>
                <div className={styles.ticketFooter}>
                  <span>{t.category} · {t.date}</span>
                  <span className={`badge badge-${t.status}`}>{t.status.replace('progress', 'IN PROGRESS').toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="card">
        <div className="card-header"><span className="card-title">Knowledge Base</span></div>
        <div className="card-body">
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-dim)' }}>🔍</span>
            <input className="field" style={{ paddingLeft: 38 }} placeholder="Search common solutions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {filteredKB.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ color: 'var(--lime)', fontSize: 16, flexShrink: 0 }}>?</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.q}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontFamily: 'var(--mono)' }}>{item.tag} · {item.time}</div>
              </div>
              <span style={{ color: 'var(--text-dim)', fontSize: 18 }}>›</span>
            </div>
          ))}
          {filteredKB.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>No results found. Try raising a ticket instead.</div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Raise IT Ticket">
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input className="field" placeholder="Brief description of the issue" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Category</label>
              <select className="field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option>Software</option><option>Hardware</option><option>Access</option><option>Network</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="field" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="field" style={{ minHeight: 100 }} placeholder="Describe the issue in detail..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Screenshot (optional)</label>
            <div className="upload-zone">
              <div className="upload-zone-icon">🖼</div>
              <div className="upload-zone-label">Attach screenshot</div>
              <div className="upload-zone-sub">PNG, JPG — max 5MB</div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit}>Submit Ticket</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
