import { useState, useEffect } from 'react';
import { fetchClientCodes, addClientCode, removeClientCode } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ClientCodes.module.css';

const SECTORS = ['Banking', 'Consulting', 'Technology', 'Insurance', 'Internal', 'Other'];

export default function ClientCodes() {
  const [codes, setCodes]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({ code: '', client: '', sector: 'Banking' });
  const [formError, setFormError]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving]     = useState(false);

  useEffect(() => {
    fetchClientCodes()
      .then(data => setCodes(data))
      .finally(() => setLoading(false));
  }, []);

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const openModal = () => { setFormError(''); setShowModal(true); };
  const closeModal = () => { setForm({ code: '', client: '', sector: 'Banking' }); setFormError(''); setShowModal(false); };

  const submit = async () => {
    if (!form.code.trim() || !form.client.trim()) return;
    setFormError('');
    setSubmitting(true);
    try {
      const created = await addClientCode({
        code:   form.code.trim(),
        client: form.client.trim(),
        sector: form.sector,
      });
      setCodes(prev => [...prev, created]);
      closeModal();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmRemove = async () => {
    setRemoving(true);
    try {
      await removeClientCode(removeTarget.code);
      setCodes(prev => prev.filter(c => c.id !== removeTarget.id));
      setRemoveTarget(null);
    } catch (e) {
      setRemoveTarget(null);
    } finally {
      setRemoving(false);
    }
  };

  if (loading) return <div className="animate-fade" style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading…</div>;

  return (
    <div className="animate-fade">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Client Project Codes</span>
          <button className="btn btn-primary btn-sm" onClick={openModal}>+ Add Code</button>
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

      <Modal isOpen={showModal} onClose={closeModal} title="Add Client Project Code">
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
          {formError && (
            <div style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px' }}>
              {formError}
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit} disabled={!form.code.trim() || !form.client.trim() || submitting}>
              {submitting ? 'Adding…' : 'Add Code'}
            </button>
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
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
            <button className={`btn btn-primary ${styles.confirmRemoveBtn}`} onClick={confirmRemove} disabled={removing}>
              {removing ? 'Removing…' : 'Confirm Remove'}
            </button>
            <button className="btn btn-ghost" onClick={() => setRemoveTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
