import { useState } from 'react';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './HR.module.css';

const initial = [
  { id: 'hr1', title: 'Workplace Feedback – Team Communication', excerpt: 'General feedback about team communication processes on client site. Submitted anonymously.', date: '20 Mar 2026', status: 'resolved', anon: true },
];

export default function HR() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', anon: false });

  const createRequest = async (content,title,anonymous) => {

    const request = {
      username: currentUser?.username ,
      creationTime: new Date().getTime(),
      content: content,
      title: title,
      anonymous: anonymous,
    };

    try {
      const response = await fetch("http://localhost:8080/api/createEmployeeReport", {
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
    if (!form.title) return;
    setReports(prev => [
      { id: `hr${Date.now()}`, title: form.title, excerpt: form.content, date: 'Today', status: 'pending', anon: form.anon },
      ...prev,
    ]);
    setShowModal(false);
    createRequest(form.content,form.title,form.anon)
    setForm({ title: '', content: '', anon: false });
  };

  return (
    <div className="animate-fade">
      <div className="card">
        <div className="card-header">
          <span className="card-title">My HR Reports</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Submit Report</button>
        </div>
        <div className={`card-body ${styles.reportBody}`}>
          {reports.map(r => (
            <div key={r.id} className={styles.reportItem}>
              <div className={styles.reportTitle}>{r.title}</div>
              <div className={styles.reportExcerpt}>{r.excerpt}</div>
              <div className={styles.reportFooter}>
                <span>{r.date}</span>
                <span className={`badge badge-${r.status === 'resolved' ? 'resolved' : 'pending'}`}>{r.status.toUpperCase()}</span>
                {r.anon && <span className={styles.anonBadge}>ANONYMOUS</span>}
              </div>
            </div>
          ))}
          {reports.length === 0 && <div className={styles.empty}>No reports submitted yet.</div>}
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
          <div className={styles.anonCheckRow}>
            <input type="checkbox" id="anon" className={styles.anonCheckbox} checked={form.anon} onChange={() => setForm(f => ({ ...f, anon: !f.anon }))} />
            <label htmlFor="anon" className={styles.anonLabel}>
              <strong className={styles.anonLabelTitle}>Submit anonymously</strong>
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
