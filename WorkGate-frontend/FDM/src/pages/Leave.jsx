import { useState } from 'react';
import { leaveRequests as initial, currentUser } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';

export default function Leave() {
  const [requests, setRequests] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ start: '', end: '', notes: '' });

  const usedDays = currentUser.leaveTotal - currentUser.leaveBalance;
  const pct = (usedDays / currentUser.leaveTotal) * 100;

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const cancel = (id) => setRequests(prev => prev.filter(r => r.id !== id));

  const submit = () => {
    if (!form.start || !form.end) return;
    setRequests(prev => [
      { id: `lr${Date.now()}`, start: form.start, end: form.end, days: 1, status: 'pending' },
      ...prev,
    ]);
    setShowModal(false);
    setForm({ start: '', end: '', notes: '' });
  };

  return (
    <div className="animate-fade">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '✅', val: usedDays, label: 'Days used' },
          { icon: '📅', val: currentUser.leaveBalance, label: 'Days remaining', highlight: true },
          { icon: '⏳', val: requests.filter(r => r.status === 'pending').length, label: 'Pending requests' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} style={{
            background: 'var(--surface)', border: `1px solid ${highlight ? 'var(--border-bright)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', padding: '18px 20px',
            boxShadow: highlight ? '0 0 22px var(--lime-glow)' : 'none',
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 700, color: 'var(--lime)', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Balance bar */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>Leave used this year</span>
            <span style={{ fontFamily: 'var(--mono)', color: 'var(--lime)' }}>{usedDays} / {currentUser.leaveTotal} days</span>
          </div>
          <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--lime)', borderRadius: 3, transition: 'width 1s ease' }} />
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Leave History</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Request Leave</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Start</th><th>End</th><th>Days</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.start}</strong></td>
                  <td>{r.end}</td>
                  <td>{r.days}</td>
                  <td><span className={`badge badge-${r.status}`}>{r.status.toUpperCase()}</span></td>
                  <td>
                    {r.status === 'pending'
                      ? <button className="btn btn-danger" onClick={() => cancel(r.id)}>Cancel</button>
                      : <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Annual Leave">
        <div className="form-grid">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Start Date</label>
              <input className="field" type="date" min={getTodayDate()} value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input className="field" type="date" min={form.start || getTodayDate()} value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} />
            </div>
          </div>
          {form.start && form.end && (
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
              📅 <strong style={{ color: 'var(--lime)' }}>{currentUser.leaveBalance} days</strong> remaining after approval
            </div>
          )}
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea className="field" placeholder="Any additional notes for your manager..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit}>Submit Request</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
