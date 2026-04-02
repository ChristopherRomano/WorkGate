import { useState } from 'react';
import Modal from '../components/Modal';
import '../styles/components.css';

const initial = [
  { id: 'hr1', title: 'Workplace Feedback – Team Communication', excerpt: 'General feedback about team communication processes on client site. Submitted anonymously.', date: '20 Mar 2026', status: 'resolved', anon: true },
];

export default function HR() {
  const [reports, setReports] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', anon: false });

  const submit = () => {
    if (!form.title) return;
    setReports(prev => [
      { id: `hr${Date.now()}`, title: form.title, excerpt: form.content, date: 'Today', status: 'pending', anon: form.anon },
      ...prev,
    ]);
    setShowModal(false);
    setForm({ title: '', content: '', anon: false });
  };

  return (
    <div className="animate-fade">
      <div className="card">
        <div className="card-header">
          <span className="card-title">My HR Reports</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Submit Report</button>
        </div>
        <div className="card-body" style={{ padding: '4px 20px' }}>
          {reports.map(r => (
            <div key={r.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{r.excerpt}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
                <span>{r.date}</span>
                <span className={`badge badge-${r.status === 'resolved' ? 'resolved' : 'pending'}`}>{r.status.toUpperCase()}</span>
                {r.anon && (
                  <span style={{ padding: '1px 7px', borderRadius: 3, background: 'var(--surface-3)', border: '1px solid var(--border)', fontSize: 9 }}>ANONYMOUS</span>
                )}
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>No reports submitted yet.</div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 28 }}>🔒</span>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Your reports are confidential</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Anonymous reports are processed by HR without revealing your identity. Non-anonymous reports allow HR to follow up with you directly via the portal.
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit HR Report">
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input className="field" placeholder="Brief subject of your report" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Details</label>
            <textarea className="field" style={{ minHeight: 120 }} placeholder="Describe your feedback or complaint..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <input type="checkbox" id="anon" checked={form.anon} onChange={() => setForm(f => ({ ...f, anon: !f.anon }))} style={{ width: 'auto', marginTop: 2, accentColor: 'var(--lime)' }} />
            <label htmlFor="anon" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 2 }}>Submit anonymously</strong>
              Your identity will not be shared with HR or line management.
            </label>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit}>Submit Report</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
