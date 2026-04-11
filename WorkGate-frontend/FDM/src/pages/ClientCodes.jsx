import { useState } from 'react';
import { clientCodes as initial } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ClientCodes.module.css';

const SECTORS = ['Banking', 'Consulting', 'Technology', 'Insurance', 'Internal', 'Other'];

export default function ClientCodes() {
  const [codes, setCodes] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', client: '', sector: 'Banking' });
  const [removeTarget, setRemoveTarget] = useState(null);

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const canSubmit = form.code.trim() && form.client.trim();

  const submit = () => {
    if (!canSubmit) return;
    const code = form.code.trim().toUpperCase();
    if (codes.find(c => c.code === code)) return; // no duplicates
    setCodes(prev => [...prev, { id: `cc-${Date.now()}`, code, client: form.client.trim(), sector: form.sector }]);
    setForm({ code: '', client: '', sector: 'Banking' });
    setShowModal(false);
  };

  const confirmRemove = () => {
    setCodes(prev => prev.filter(c => c.id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <div className="animate-fade">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Client Project Codes</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Code</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Code</th><th>Client</th><th>Sector</th><th>Action</th></tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c.id}>
                  <td><span className={styles.codeTag}>{c.code}</span></td>
                  <td><strong>{c.client}</strong></td>
                  <td><span className={styles.sectorBadge}>{c.sector}</span></td>
                  <td>
                    <button className={`btn btn-sm ${styles.removeBtn}`} onClick={() => setRemoveTarget(c)}>Remove</button>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr><td colSpan={4} className={styles.empty}>No client codes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Client Project Code">
        <div className="form-grid">
          <div className="form-group">
            <label>Project Code</label>
            <input className="field" placeholder="e.g. CLIENT-007" {...field('code')} />
          </div>
          <div className="form-group">
            <label>Client Name</label>
            <input className="field" placeholder="e.g. Goldman Sachs" {...field('client')} />
          </div>
          <div className="form-group">
            <label>Sector</label>
            <select className="field" {...field('sector')}>
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit} disabled={!canSubmit}>Add Code</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!removeTarget} onClose={() => setRemoveTarget(null)} title="Remove Client Code">
        <div className="form-grid">
          {removeTarget && (
            <div className={styles.warnBox}>
              <div className={styles.warnIcon}>⚠️</div>
              <div>
                Removing <strong>{removeTarget.code}</strong> ({removeTarget.client}) will make this code unavailable for new assignments. Existing employee records are not affected.
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button className={`btn btn-primary ${styles.confirmRemoveBtn}`} onClick={confirmRemove}>Confirm Remove</button>
            <button className="btn btn-ghost" onClick={() => setRemoveTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
