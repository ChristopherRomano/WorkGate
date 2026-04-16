import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Modal from './Modal';
import '../styles/components.css';
import styles from './Layout.module.css';

export default function Layout() {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [itOpen, setItOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Topbar onNewLeave={() => setLeaveOpen(true)} onNewIT={() => setItOpen(true)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      {/* Global Leave Modal */}
      <Modal isOpen={leaveOpen} onClose={() => setLeaveOpen(false)} title="Request Annual Leave">
        <div className="form-grid">
          <div className="form-grid form-grid-2">
            <div className="form-group"><label>Start Date</label><input className="field" type="date" /></div>
            <div className="form-group"><label>End Date</label><input className="field" type="date" /></div>
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea className="field" placeholder="Any notes for your manager..." />
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => setLeaveOpen(false)}>Submit Request</button>
            <button className="btn btn-ghost" onClick={() => setLeaveOpen(false)}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Global IT Modal */}
      <Modal isOpen={itOpen} onClose={() => setItOpen(false)} title="Raise IT Ticket">
        <div className="form-grid">
          <div className="form-group"><label>Title</label><input className="field" placeholder="Brief description of the issue" /></div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Category</label>
              <select className="field"><option>Software</option><option>Hardware</option><option>Access</option><option>Network</option></select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="field"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
            </div>
          </div>
          <div className="form-group"><label>Description</label><textarea className="field" style={{ minHeight: 90 }} placeholder="Describe the issue..." /></div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => setItOpen(false)}>Submit Ticket</button>
            <button className="btn btn-ghost" onClick={() => setItOpen(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
