import { useState } from 'react';
import { employees as initial, managers, clientCodes } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ManageEmployees.module.css';

const TAGS = ['CONSULTANT_DEPLOYED', 'CONSULTANT_BENCH', 'MANAGER', 'ADMIN'];

export default function ManageEmployees() {
  const [employees, setEmployees] = useState(initial);
  const [filter, setFilter] = useState('all');
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const filtered = filter === 'all' ? employees : employees.filter(e => e.active === (filter === 'active'));

  const openEdit = (emp) => {
    setEditTarget(emp);
    setEditForm({ role: emp.role, tag: emp.tag, manager: emp.manager, clientCode: emp.clientCode });
  };

  const saveEdit = () => {
    setEmployees(prev => prev.map(e => e.id === editTarget.id ? { ...e, ...editForm } : e));
    setEditTarget(null);
  };

  const toggleActive = (emp) => {
    if (emp.active) {
      setDeactivateTarget(emp);
    } else {
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, active: true } : e));
    }
  };

  const confirmDeactivate = () => {
    setEmployees(prev => prev.map(e => e.id === deactivateTarget.id ? { ...e, active: false } : e));
    setDeactivateTarget(null);
  };

  return (
    <div className="animate-fade">
      <div className={styles.filters}>
        {[['all', 'All Employees'], ['active', 'Active'], ['inactive', 'Inactive']].map(([val, label]) => (
          <button key={val} className={`btn ${filter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee Accounts</span>
          <span className={styles.count}>{filtered.length} employee{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employee</th><th>Role / Tag</th><th>Client Code</th><th>Manager</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className={!emp.active ? styles.inactiveRow : ''}>
                  <td>
                    <div className={styles.empCell}>
                      <div className={styles.empAvatar}>{emp.initials}</div>
                      <div>
                        <div className={styles.empName}>{emp.name}</div>
                        <div className={styles.empEmail}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.empRole}>{emp.role}</div>
                    <div className={styles.empTag}>{emp.tag}</div>
                  </td>
                  <td className={styles.mono}>{emp.clientCode}</td>
                  <td>{emp.manager}</td>
                  <td>
                    <span className={`badge badge-${emp.active ? 'approved' : 'rejected'}`}>
                      {emp.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(emp)}>Edit</button>
                      <button
                        className={`btn btn-sm ${emp.active ? styles.deactivateBtn : styles.reactivateBtn}`}
                        onClick={() => toggleActive(emp)}
                      >
                        {emp.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className={styles.empty}>No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Permissions Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Employee Permissions">
        <div className="form-grid">
          {editTarget && (
            <div className={styles.editSummary}>
              <strong>{editTarget.name}</strong>
              <span className={styles.editEmail}>{editTarget.email}</span>
            </div>
          )}
          <div className="form-group">
            <label>Role</label>
            <select className="field" value={editForm.role || ''} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
              <option>Consultant</option>
              <option>Manager</option>
              <option>Administrator</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tag / Security Level</label>
            <select className="field" value={editForm.tag || ''} onChange={e => setEditForm(f => ({ ...f, tag: e.target.value }))}>
              {TAGS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Line Manager</label>
            <select className="field" value={editForm.manager || ''} onChange={e => setEditForm(f => ({ ...f, manager: e.target.value }))}>
              {managers.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Client Project Code</label>
            <select className="field" value={editForm.clientCode || ''} onChange={e => setEditForm(f => ({ ...f, clientCode: e.target.value }))}>
              {clientCodes.map(c => <option key={c.id} value={c.code}>{c.code} – {c.client}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            <button className="btn btn-ghost" onClick={() => setEditTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Confirm Modal */}
      <Modal isOpen={!!deactivateTarget} onClose={() => setDeactivateTarget(null)} title="Deactivate Account">
        <div className="form-grid">
          {deactivateTarget && (
            <div className={styles.warnBox}>
              <div className={styles.warnIcon}>⚠️</div>
              <div>
                <strong>{deactivateTarget.name}</strong> will lose access to WorkGate immediately.
                This action can be reversed by reactivating the account.
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button className={`btn btn-primary ${styles.confirmDeactivateBtn}`} onClick={confirmDeactivate}>Confirm Deactivation</button>
            <button className="btn btn-ghost" onClick={() => setDeactivateTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
