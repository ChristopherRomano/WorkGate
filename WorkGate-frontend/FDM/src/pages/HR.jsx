import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './HR.module.css';
import { useAuth } from '../context/AuthContext';
import { fetchMyHrReports, createHrReport } from '../api/api';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const mapStatus = (s) => {
  switch (String(s ?? '').toUpperCase()) {
    case 'RESOLVED':    return 'resolved';
    case 'IN_PROGRESS': return 'inprogress';
    default:            return 'pending';
  }
};

const mapReport = (item) => ({
  id: item.id,
  title: item.title ?? '',
  content: item.content ?? '',
  anon: item.anonymous ?? false,
  status: mapStatus(item.status),
  resolution: item.resolution ?? '',
  date: item.creationTime ? DATE_FORMATTER.format(new Date(Number(item.creationTime))) : '—',
});

const STATUS_BADGE  = { resolved: 'approved', inprogress: 'pending', pending: 'open' };
const STATUS_LABEL  = { resolved: 'RESOLVED', inprogress: 'IN PROGRESS', pending: 'PENDING' };

export default function HR() {
  const { currentUser } = useAuth();
  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadError, setLoadError]     = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formErrors, setFormErrors]   = useState({});
  const [form, setForm]               = useState({ title: '', content: '', anon: false });

  const username = currentUser?.email ?? currentUser?.username ?? '';

  const loadReports = useCallback(async () => {
    if (!username) { setLoading(false); return; }
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchMyHrReports(username);
      setReports(Array.isArray(data) ? [...data].sort((a, b) => b.id - a.id).map(mapReport) : []);
    } catch {
      setLoadError('Unable to load your reports right now.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const openModal  = () => { setShowModal(true);  setFormErrors({}); setSubmitError(''); };
  const closeModal = () => { setShowModal(false); setFormErrors({}); setSubmitError(''); };

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required.';
    else if (form.title.trim().length < 5) errors.title = 'Title must be at least 5 characters.';
    if (!form.content.trim()) errors.content = 'Details are required.';
    else if (form.content.trim().length < 20) errors.content = 'Please provide more detail (at least 20 characters).';
    return errors;
  };

  const submit = async () => {
    if (submitting) return;
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      await createHrReport({
        username,
        title: form.title.trim(),
        content: form.content.trim(),
        anonymous: form.anon,
        creationTime: Date.now(),
      });
      closeModal();
      setForm({ title: '', content: '', anon: false });
      await loadReports();
    } catch (e) {
      setSubmitError(e.message || 'Unable to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade">
      <div className="card">
        <div className="card-header">
          <span className="card-title">My HR Reports</span>
          <button className="btn btn-primary btn-sm" onClick={openModal}>+ Submit Report</button>
        </div>
        {loadError && (
          <div style={{ color: 'var(--danger)', padding: '0 20px 16px', fontSize: 13 }}>{loadError}</div>
        )}
        <div className={`card-body ${styles.reportBody}`}>
          {loading && <div className={styles.empty}>Loading reports…</div>}
          {!loading && reports.length === 0 && !loadError && (
            <div className={styles.empty}>No reports submitted yet.</div>
          )}
          {reports.map(r => (
            <div key={r.id} className={styles.reportItem}>
              <div className={styles.reportTitle}>{r.title}</div>
              <div className={styles.reportExcerpt}>{r.content}</div>
              {r.resolution && (
                <div className={styles.reportResolution}>
                  <strong>HR Response:</strong> {r.resolution}
                </div>
              )}
              <div className={styles.reportFooter}>
                <span>{r.date}</span>
                <span className={`badge badge-${STATUS_BADGE[r.status] ?? 'open'}`}>
                  {STATUS_LABEL[r.status] ?? r.status.toUpperCase()}
                </span>
                {r.anon && <span className={styles.anonBadge}>ANONYMOUS</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`card ${styles.confidentialCard}`}>
        <div className={styles.confidentialInner}>
          <span className={styles.confidentialIcon}>🔒</span>
          <div>
            <div className={styles.confidentialTitle}>Your reports are confidential</div>
            <div className={styles.confidentialBody}>
              Anonymous reports are processed by HR without revealing your identity. Non-anonymous reports allow HR to follow up with you directly via the portal.
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title="Submit HR Report">
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input
              className="field"
              placeholder="Brief subject of your report"
              value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); if (formErrors.title) setFormErrors(fe => ({ ...fe, title: '' })); }}
            />
            {formErrors.title && <div className={styles.fieldError}>{formErrors.title}</div>}
          </div>
          <div className="form-group">
            <label>Details</label>
            <textarea
              className="field"
              style={{ minHeight: 120 }}
              placeholder="Describe your feedback or complaint..."
              value={form.content}
              onChange={e => { setForm(f => ({ ...f, content: e.target.value })); if (formErrors.content) setFormErrors(fe => ({ ...fe, content: '' })); }}
            />
            {formErrors.content && <div className={styles.fieldError}>{formErrors.content}</div>}
          </div>
          <div className={styles.anonCheckRow}>
            <input type="checkbox" id="anon" className={styles.anonCheckbox} checked={form.anon} onChange={() => setForm(f => ({ ...f, anon: !f.anon }))} />
            <label htmlFor="anon" className={styles.anonLabel}>
              <strong className={styles.anonLabelTitle}>Submit anonymously</strong>
              Your identity will not be shared with HR or line management.
            </label>
          </div>
          {submitError && (
            <div style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px' }}>
              {submitError}
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
