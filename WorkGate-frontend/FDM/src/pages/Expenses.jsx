import { useState } from 'react';
import { expenses as initial } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Expenses.module.css';

const ICONS = { Train: '🚂', Hotel: '🏨', Lunch: '🍽', Taxi: '🚕', Flight: '✈️', Other: '📎' };
const getIcon = (desc) => {
  const key = Object.keys(ICONS).find(k => desc.toLowerCase().includes(k.toLowerCase()));
  return ICONS[key] || '📎';
};

export default function Expenses() {
  const [items, setItems] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', currency: 'GBP (£)', date: '', project: 'CLIENT-003' });

  const submit = () => {
    if (!form.description || !form.amount) return;
    const sym = form.currency.match(/[£$€]/)?.[0] || '£';
    setItems(prev => [
      { id: `ex${Date.now()}`, description: form.description, date: form.date || 'Today', project: form.project, amount: `${sym}${parseFloat(form.amount).toFixed(2)}`, status: 'pending' },
      ...prev,
    ]);
    setShowModal(false);
    setForm({ description: '', amount: '', currency: 'GBP (£)', date: '', project: 'CLIENT-003' });
  };

  const pending = items.filter(e => e.status === 'pending');
  const pendingTotal = pending.reduce((sum, e) => sum + parseFloat(e.amount.replace(/[^0-9.]/g, '')), 0);

  return (
    <div className="animate-fade">
      <div className={styles.statsGrid}>
        {[
          { icon: '⏳', val: pending.length, label: 'Pending claims' },
          { icon: '💰', val: `£${pendingTotal.toFixed(2)}`, label: 'Pending total', highlight: true },
          { icon: '✅', val: items.filter(e => e.status === 'approved').length, label: 'Paid claims' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Claims</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Claim</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th></th><th>Description</th><th>Date</th><th>Project</th><th>Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {items.map(e => (
                <tr key={e.id}>
                  <td className={styles.iconCell}>{getIcon(e.description)}</td>
                  <td><strong>{e.description}</strong></td>
                  <td>{e.date}</td>
                  <td className={styles.projectCell}>{e.project}</td>
                  <td><strong className={styles.amountCell}>{e.amount}</strong></td>
                  <td><span className={`badge badge-${e.status}`}>{e.status.toUpperCase()}</span></td>
                  <td>
                    {e.status === 'pending'
                      ? <button className="btn btn-danger" onClick={() => setItems(prev => prev.filter(i => i.id !== e.id))}>Cancel</button>
                      : <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Expense Claim">
        <div className="form-grid">
          <div className="form-group">
            <label>Description</label>
            <input className="field" placeholder="e.g. Train – London to Manchester" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Amount</label>
              <input className="field" type="number" placeholder="0.00" step="0.01" min="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select className="field" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                <option>GBP (£)</option><option>USD ($)</option><option>EUR (€)</option>
              </select>
            </div>
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Date</label>
              <input className="field" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Project Code</label>
              <select className="field" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))}>
                <option>CLIENT-003</option><option>CLIENT-001</option><option>INTERNAL</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Receipt</label>
            <div className="upload-zone">
              <div className="upload-zone-icon">📎</div>
              <div className="upload-zone-label">Click to upload or drag & drop</div>
              <div className="upload-zone-sub">PDF, PNG, JPG — max 10MB</div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit}>Submit Claim</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}