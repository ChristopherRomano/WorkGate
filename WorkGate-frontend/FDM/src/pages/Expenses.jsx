import { useState } from 'react';
import { expenses as initial } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Expenses.module.css';

const ICONS = { Train: '🚂', Hotel: '🏨', Lunch: '🍽', Taxi: '🚕', Flight: '✈️', Other: '📎' };
const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;
const ALLOWED_RECEIPT_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const ALLOWED_RECEIPT_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'];

const isAllowedReceipt = (file) => {
  if (!file) return false;
  if (ALLOWED_RECEIPT_TYPES.includes(file.type)) return true;
  const extension = file.name.split('.').pop()?.toLowerCase();
  return !!extension && ALLOWED_RECEIPT_EXTENSIONS.includes(extension);
};

const getIcon = (desc) => {
  const key = Object.keys(ICONS).find(k => desc.toLowerCase().includes(k.toLowerCase()));
  return ICONS[key] || '📎';
};


export default function Expenses() {
  const [items, setItems] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', currency: 'GBP (£)', date: '', project: 'CLIENT-003' });
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptError, setReceiptError] = useState('');

  const createRequest = async (amount,currency,date,description,evidence) => {
    let passedCurrency = "";
    switch (currency){
      
      case "GBP (£)":
        passedCurrency = "GBP"
        break;
      case "EUR (€)":
        passedCurrency = "EUR"
        break;
      case "USD ($)":
        passedCurrency = "USD"
        break;

    }

    const request = {
      username: "john",
      creationTime: (new Date()).getTime(),
      reason: description,
      amount : parseFloat(amount),
      purchaseDate : (new Date(date)).getTime(),
      currency: passedCurrency,
      evidence: "image",
    };
    try {
      const response = await fetch("http://localhost:8080/api/createExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }
    } 
    catch (error) {
      console.error(error);
    }
  };

  const submit = () => {
    if (!form.description || !form.amount || !receiptFile) {
      if (!receiptFile) {
        setReceiptError('Please attach a receipt file.');
      }
      return;
    }

    const sym = form.currency.match(/[£$€]/)?.[0] || '£';
    setItems(prev => [
      { id: `ex${Date.now()}`, description: form.description, date: form.date || 'Today', project: form.project, amount: `${sym}${parseFloat(form.amount).toFixed(2)}`, status: 'pending' },
      ...prev,
    ]);
    setShowModal(false);
    createRequest(form.amount,form.currency,form.date || new Date().getTime(),form.description,);
    setForm({ description: '', amount: '', currency: 'GBP (£)', date: '', project: 'CLIENT-003' });
    setReceiptFile(null);
    setReceiptError('');
  };

  const onReceiptChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setReceiptFile(null);
      setReceiptError('');
      return;
    }

    if (!isAllowedReceipt(file)) {
      setReceiptFile(null);
      setReceiptError('Invalid file type. Allowed: PDF, PNG, JPG, JPEG.');
      return;
    }

    if (file.size > MAX_RECEIPT_SIZE) {
      setReceiptFile(null);
      setReceiptError('File is too large. Maximum size is 10MB.');
      return;
    }

    setReceiptFile(file);
    setReceiptError('');
  };

  const pending = items.filter(e => e.status === 'pending');
  const pendingTotal = pending.reduce((sum, e) => sum + parseFloat(e.amount.replace(/[^0-9.]/g, '')), 0);

  // ── Render ──────────────────────────────────────────────────────────────────
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

      {/* New Claim Modal */}
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
              <label htmlFor="expense-receipt" style={{ display: 'block', cursor: 'pointer' }}>
                <div className="upload-zone-icon">📎</div>
                <div className="upload-zone-label">Click to upload receipt</div>
                <div className="upload-zone-sub">PDF, PNG, JPG, JPEG — max 10MB</div>
                <input
                  id="expense-receipt"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={onReceiptChange}
                  style={{ display: 'none' }}
                />
              </label>
              {receiptFile && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text)' }}>
                  Selected: <strong>{receiptFile.name}</strong>
                </div>
              )}
              {receiptError && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--danger)' }}>{receiptError}</div>
              )}
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