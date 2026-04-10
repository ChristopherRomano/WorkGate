import { useState } from 'react';
import { leaveRequests as initial, currentUser } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Leave.module.css';

export default function Leave() {
  const [requests, setRequests] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ start: '', end: '', notes: '' });

  const usedDays = currentUser.leaveTotal - currentUser.leaveBalance;
  const pct = (usedDays / currentUser.leaveTotal) * 100;

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const formatDate = (iso) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const calcDays = (start, end) => {
    const ms = new Date(end + 'T00:00:00') - new Date(start + 'T00:00:00');
    return Math.max(1, Math.round(ms / 86400000) + 1);
  };

  const cancel = (id) => setRequests(prev => prev.filter(r => r.id !== id));

  const createRequest = async (start,end,notes) => {

    const request = {
      username: "john",
      creationTime: (new Date()).getTime(),
      startOfLeave:  new Date(start).getTime(),
      endOfLeave : new Date(end).getTime(),
      reason : notes,
    };

    try {
      const response = await fetch("http://localhost:8080/api/createAnnualLeave", {
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
    if (!form.start || !form.end) return;
    setRequests(prev => [
      {
        id: `lr${Date.now()}`,
        start: formatDate(form.start),
        end: formatDate(form.end),
        days: calcDays(form.start, form.end),
        status: 'pending',
      },
      ...prev,
    ]);
    setShowModal(false);

    createRequest(form.start,form.end,form.notes);

    setForm({ start: '', end: '', notes: '' });
  };

  return (
    <div className="animate-fade">
      <div className={styles.statsGrid}>
        {[
          { icon: '✅', val: usedDays, label: 'Days used' },
          { icon: '📅', val: currentUser.leaveBalance, label: 'Days remaining', highlight: true },
          { icon: '⏳', val: requests.filter(r => r.status === 'pending').length, label: 'Pending requests' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className={`card ${styles.balanceCard}`}>
        <div className="card-body">
          <div className={styles.balanceRow}>
            <span>Leave used this year</span>
            <span className={styles.balanceCount}>{usedDays} / {currentUser.leaveTotal} days</span>
          </div>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

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
                      : <span className={styles.emptyCell}>—</span>
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
            <div className={styles.dateHint}>
              📅 <strong className={styles.dateHintVal}>{currentUser.leaveBalance} days</strong> remaining after approval
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
