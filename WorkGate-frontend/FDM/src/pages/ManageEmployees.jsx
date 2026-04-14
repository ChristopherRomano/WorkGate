import { useState, useMemo } from 'react';
import { users, employees as empList, managers, clientCodes } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ManageEmployees.module.css';

// ── Normalise users + employees into one list ────────────────────────────────
const buildPeople = () => [
  ...users.map(u => ({
    id: u.id,
    initials: u.initials,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    address: u.address || '',
    role: u.role,
    tag: u.tag || '',
    manager: u.manager || '',
    clientCode: u.clientCode || '',
    clientName: u.clientName || '',
    active: true,
  })),
  ...empList
    .filter(e => !users.some(u => u.name === e.name))
    .map(e => ({
      id: e.id,
      initials: e.initials,
      name: e.name,
      email: e.email,
      phone: '',
      address: '',
      role: 'consultant',
      tag: e.tag || '',
      manager: e.manager || '',
      clientCode: e.clientCode || '',
      clientName: e.client || '',
      active: e.active,
    })),
];

const ROLE_LABEL = {
  employee: 'Employee', consultant: 'Consultant', manager: 'Manager',
  admin: 'Admin', hr: 'HR', ittech: 'IT Tech',
};
const ROLES   = ['employee', 'consultant', 'manager', 'admin', 'hr', 'ittech'];
const TAGS    = ['CONSULTANT_DEPLOYED', 'CONSULTANT_BENCH', 'MANAGER', 'ADMIN', 'IT', 'HR', 'BENCH'];

const TABS = [
  { key: 'all',        label: 'All' },
  { key: 'manager',    label: 'Managers' },
  { key: 'consultant', label: 'Consultants' },
  { key: 'employee',   label: 'Employees' },
  { key: 'support',    label: 'Support' },
];

export default function ManageEmployees() {
  const [people, setPeople]               = useState(buildPeople);
  const [roleTab, setRoleTab]             = useState('all');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState(new Set());

  // Modals
  const [viewTarget, setViewTarget]             = useState(null);
  const [editTarget, setEditTarget]             = useState(null);
  const [editForm, setEditForm]                 = useState({});
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deleteTarget, setDeleteTarget]         = useState(null);
  const [resetTarget, setResetTarget]           = useState(null);
  const [bulkAction, setBulkAction]             = useState(null);
  const [bulkManager, setBulkManager]           = useState('');

  // ── Counts for tab badges ─────────────────────────────────────────────────
  const counts = useMemo(() => ({
    all:        people.length,
    manager:    people.filter(p => p.role === 'manager').length,
    consultant: people.filter(p => p.role === 'consultant').length,
    employee:   people.filter(p => p.role === 'employee').length,
    support:    people.filter(p => ['admin','hr','ittech'].includes(p.role)).length,
  }), [people]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = people;
    if (roleTab === 'support') list = list.filter(p => ['admin','hr','ittech'].includes(p.role));
    else if (roleTab !== 'all') list = list.filter(p => p.role === roleTab);
    if (statusFilter !== 'all') list = list.filter(p => p.active === (statusFilter === 'active'));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.email     && p.email.toLowerCase().includes(q)) ||
        (p.manager   && p.manager.toLowerCase().includes(q)) ||
        (p.clientCode && p.clientCode.toLowerCase().includes(q)) ||
        ROLE_LABEL[p.role]?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [people, roleTab, statusFilter, search]);

  // ── Selection ─────────────────────────────────────────────────────────────
  const filteredIds  = filtered.map(p => p.id);
  const allSelected  = filteredIds.length > 0 && filteredIds.every(id => selected.has(id));
  const someSelected = selected.size > 0;

  const toggleSelect = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => { const n = new Set(prev); filteredIds.forEach(id => n.delete(id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); filteredIds.forEach(id => n.add(id)); return n; });
    }
  };

  const clearSelection = () => setSelected(new Set());

  // ── CRUD helpers ──────────────────────────────────────────────────────────
  const openEdit = (person) => {
    setEditTarget(person);
    setEditForm({
      name: person.name, email: person.email, phone: person.phone,
      address: person.address, role: person.role, tag: person.tag,
      manager: person.manager, clientCode: person.clientCode,
    });
  };

  const saveEdit = () => {
    setPeople(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...editForm } : p));
    setEditTarget(null);
  };

  const toggleActive = (person) => {
    if (person.active) setDeactivateTarget(person);
    else setPeople(prev => prev.map(p => p.id === person.id ? { ...p, active: true } : p));
  };

  const confirmDeactivate = () => {
    setPeople(prev => prev.map(p => p.id === deactivateTarget.id ? { ...p, active: false } : p));
    setDeactivateTarget(null);
  };

  const confirmDelete = () => {
    setPeople(prev => prev.filter(p => p.id !== deleteTarget.id));
    setSelected(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n; });
    setDeleteTarget(null);
  };

  // ── Bulk actions ──────────────────────────────────────────────────────────
  const executeBulk = () => {
    if (bulkAction === 'deactivate') {
      setPeople(prev => prev.map(p => selected.has(p.id) ? { ...p, active: false } : p));
    } else if (bulkAction === 'reactivate') {
      setPeople(prev => prev.map(p => selected.has(p.id) ? { ...p, active: true } : p));
    } else if (bulkAction === 'delete') {
      setPeople(prev => prev.filter(p => !selected.has(p.id)));
    } else if (bulkAction === 'reassign' && bulkManager) {
      setPeople(prev => prev.map(p => selected.has(p.id) ? { ...p, manager: bulkManager } : p));
    }
    clearSelection();
    setBulkAction(null);
    setBulkManager('');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade">

      {/* Controls: role tabs + status + search */}
      <div className={styles.controlsBar}>
        <div className={styles.tabsRow}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`btn ${roleTab === key ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => { setRoleTab(key); clearSelection(); }}
            >
              {label}
              <span className={styles.tabCount}>{counts[key]}</span>
            </button>
          ))}

          <div className={styles.statusToggle}>
            {[['all','All'],['active','Active'],['inactive','Inactive']].map(([val, label]) => (
              <button
                key={val}
                className={`${styles.statusBtn} ${statusFilter === val ? styles.statusActive : ''}`}
                onClick={() => setStatusFilter(val)}
              >{label}</button>
            ))}
          </div>
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search name, email, manager, code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className={styles.searchClear} onClick={() => setSearch('')}>×</button>}
        </div>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selected.size} selected</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setBulkAction('reactivate')}>Reactivate</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setBulkAction('deactivate')}>Deactivate</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setBulkAction('reassign')}>Reassign Manager</button>
          <button className={`btn btn-sm ${styles.bulkDeleteBtn}`} onClick={() => setBulkAction('delete')}>Delete</button>
          <button className="btn btn-ghost btn-sm" onClick={clearSelection}>Clear</button>
        </div>
      )}

      {/* Main table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee Accounts</span>
          <span className={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-wrap">
          <table style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th className={styles.colCheck}>
                  <input type="checkbox" className={styles.checkbox} checked={allSelected} onChange={toggleAll} />
                </th>
                <th className={styles.colEmp}>Employee</th>
                <th className={styles.colRole}>Role</th>
                <th className={styles.colClient}>Client / Code</th>
                <th className={styles.colManager}>Manager</th>
                <th className={styles.colStatus}>Status</th>
                <th className={styles.colActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>No employees found.</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className={!p.active ? styles.inactiveRow : ''}>
                  <td className={styles.colCheck} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className={styles.checkbox} checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} />
                  </td>
                  <td className={styles.colEmp}>
                    <div className={styles.empCell}>
                      <div className={styles.empAvatar}>{p.initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className={styles.empName}>{p.name}</div>
                        <div className={styles.empEmail}>{p.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.colRole}>
                    <span className={`${styles.roleChip} ${styles[`role_${p.role}`]}`}>
                      {ROLE_LABEL[p.role] || p.role}
                    </span>
                    {p.tag && <div className={styles.empTag}>{p.tag}</div>}
                  </td>
                  <td className={`${styles.colClient} ${styles.mono}`}>{p.clientCode || p.clientName || '—'}</td>
                  <td className={styles.colManager} style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.manager || '—'}</td>
                  <td className={styles.colStatus}>
                    <div className={styles.statusCell}>
                      <span className={`badge badge-${p.active ? 'approved' : 'rejected'}`}>
                        {p.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </td>
                  <td className={styles.colActions}>
                    <div className={styles.rowActions}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewTarget(p)}>View</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button
                        className={`btn btn-sm ${p.active ? styles.deactivateBtn : styles.reactivateBtn}`}
                        onClick={() => toggleActive(p)}
                      >{p.active ? 'Deactivate' : 'Reactivate'}</button>
                      <button className={`btn btn-sm ${styles.deleteBtn}`} onClick={() => setDeleteTarget(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ VIEW PROFILE ══════════════════════════════════════════════════════ */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Employee Profile">
        {viewTarget && (
          <div className="form-grid">
            <div className={styles.viewHeader}>
              <div className={styles.viewAvatar}>{viewTarget.initials}</div>
              <div className={styles.viewHeaderInfo}>
                <div className={styles.viewName}>{viewTarget.name}</div>
                <div className={styles.viewBadges}>
                  <span className={`${styles.roleChip} ${styles[`role_${viewTarget.role}`]}`}>
                    {ROLE_LABEL[viewTarget.role]}
                  </span>
                  <span className={`badge badge-${viewTarget.active ? 'approved' : 'rejected'}`}>
                    {viewTarget.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.viewSections}>
              <div className={styles.viewSection}>
                <div className="section-title">Contact</div>
                <div className={styles.viewRow}><span>Email</span><span>{viewTarget.email || '—'}</span></div>
                <div className={styles.viewRow}><span>Phone</span><span>{viewTarget.phone || '—'}</span></div>
                <div className={styles.viewRow}><span>Address</span><span>{viewTarget.address || '—'}</span></div>
              </div>
              <div className={styles.viewSection}>
                <div className="section-title">Assignment</div>
                <div className={styles.viewRow}><span>Manager</span><span>{viewTarget.manager || '—'}</span></div>
                <div className={styles.viewRow}><span>Client Code</span><span className={styles.mono}>{viewTarget.clientCode || '—'}</span></div>
                <div className={styles.viewRow}><span>Client</span><span>{viewTarget.clientName || '—'}</span></div>
              </div>
              <div className={styles.viewSection}>
                <div className="section-title">Access</div>
                <div className={styles.viewRow}><span>Role</span><span>{ROLE_LABEL[viewTarget.role]}</span></div>
                <div className={styles.viewRow}><span>Tag</span><span className={styles.mono}>{viewTarget.tag || '—'}</span></div>
                <div className={styles.viewRow}><span>Account</span><span>{viewTarget.active ? 'Active' : 'Deactivated'}</span></div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => { setViewTarget(null); openEdit(viewTarget); }}>
                Edit Profile
              </button>
              <button className="btn btn-ghost" onClick={() => { setViewTarget(null); setResetTarget(viewTarget); }}>
                Reset Password
              </button>
              <button
                className={`btn btn-sm ${viewTarget.active ? styles.deactivateBtn : styles.reactivateBtn}`}
                style={{ flex: 0 }}
                onClick={() => { setViewTarget(null); toggleActive(viewTarget); }}
              >
                {viewTarget.active ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══ EDIT EMPLOYEE ═════════════════════════════════════════════════════ */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Employee">
        {editTarget && (
          <div className="form-grid">
            <div className={styles.editHeader}>
              <div className={styles.empAvatar}>{editTarget.initials}</div>
              <div>
                <div className={styles.empName}>{editTarget.name}</div>
                <div className={styles.empEmail}>{editTarget.email}</div>
              </div>
            </div>

            <div className="divider" />
            <div className="section-title">Identity</div>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input className="field" value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="field" type="email" value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Phone</label>
                <input className="field" value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className="field" value={editForm.address || ''} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
              </div>
            </div>

            <div className="divider" />
            <div className="section-title">Access & Role</div>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Role</label>
                <select className="field" value={editForm.role || ''} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tag / Security Level</label>
                <select className="field" value={editForm.tag || ''} onChange={e => setEditForm(f => ({ ...f, tag: e.target.value }))}>
                  <option value="">— None —</option>
                  {TAGS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="divider" />
            <div className="section-title">Assignment</div>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Line Manager</label>
                <select className="field" value={editForm.manager || ''} onChange={e => setEditForm(f => ({ ...f, manager: e.target.value }))}>
                  <option value="">— Unassigned —</option>
                  {managers.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Client Project Code</label>
                <select className="field" value={editForm.clientCode || ''} onChange={e => setEditForm(f => ({ ...f, clientCode: e.target.value }))}>
                  <option value="">— None —</option>
                  {clientCodes.map(c => <option key={c.id} value={c.code}>{c.code} – {c.client}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-ghost" onClick={() => setEditTarget(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══ DEACTIVATE SINGLE ═════════════════════════════════════════════════ */}
      <Modal isOpen={!!deactivateTarget} onClose={() => setDeactivateTarget(null)} title="Deactivate Account">
        {deactivateTarget && (
          <div className="form-grid">
            <div className={styles.warnBox}>
              <span className={styles.warnIcon}>⚠️</span>
              <div><strong>{deactivateTarget.name}</strong> will lose access to WorkGate immediately. This can be reversed by reactivating the account.</div>
            </div>
            <div className="modal-actions">
              <button className={`btn btn-primary ${styles.dangerBtn}`} onClick={confirmDeactivate}>Confirm Deactivation</button>
              <button className="btn btn-ghost" onClick={() => setDeactivateTarget(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══ DELETE SINGLE ═════════════════════════════════════════════════════ */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Account">
        {deleteTarget && (
          <div className="form-grid">
            <div className={styles.warnBox}>
              <span className={styles.warnIcon}>🗑️</span>
              <div><strong>{deleteTarget.name}</strong>'s account will be <strong>permanently deleted</strong> from WorkGate. This cannot be undone.</div>
            </div>
            <div className="modal-actions">
              <button className={`btn btn-primary ${styles.dangerBtn}`} onClick={confirmDelete}>Delete Permanently</button>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══ BULK ACTION ═══════════════════════════════════════════════════════ */}
      <Modal
        isOpen={!!bulkAction}
        onClose={() => { setBulkAction(null); setBulkManager(''); }}
        title={
          bulkAction === 'deactivate' ? `Deactivate ${selected.size} Accounts` :
          bulkAction === 'reactivate' ? `Reactivate ${selected.size} Accounts` :
          bulkAction === 'delete'     ? `Delete ${selected.size} Accounts` :
          `Reassign ${selected.size} Employees`
        }
      >
        <div className="form-grid">
          <div className={bulkAction === 'delete' ? styles.warnBoxRed : styles.warnBox}>
            <span className={styles.warnIcon}>{bulkAction === 'delete' ? '🗑️' : bulkAction === 'reassign' ? '🔄' : '⚠️'}</span>
            <div>
              {bulkAction === 'deactivate' && <><strong>{selected.size} accounts</strong> will be deactivated and lose WorkGate access immediately.</>}
              {bulkAction === 'reactivate' && <><strong>{selected.size} accounts</strong> will be reactivated and restored to full access.</>}
              {bulkAction === 'delete'     && <><strong>{selected.size} accounts</strong> will be <strong>permanently deleted</strong>. This cannot be undone.</>}
              {bulkAction === 'reassign'   && <>Select a new manager for the <strong>{selected.size} selected employees</strong>.</>}
            </div>
          </div>
          {bulkAction === 'reassign' && (
            <div className="form-group">
              <label>New Manager</label>
              <select className="field" value={bulkManager} onChange={e => setBulkManager(e.target.value)}>
                <option value="">— Select manager —</option>
                {managers.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          )}
          <div className="modal-actions">
            <button
              className={`btn btn-primary ${(bulkAction === 'delete' || bulkAction === 'deactivate') ? styles.dangerBtn : ''}`}
              onClick={executeBulk}
              disabled={bulkAction === 'reassign' && !bulkManager}
            >
              Confirm
            </button>
            <button className="btn btn-ghost" onClick={() => { setBulkAction(null); setBulkManager(''); }}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* ══ RESET PASSWORD ════════════════════════════════════════════════════ */}
      <Modal isOpen={!!resetTarget} onClose={() => setResetTarget(null)} title="Reset Password">
        {resetTarget && (
          <div className="form-grid">
            <div className={styles.infoBox}>
              <span className={styles.warnIcon}>🔑</span>
              <div>A password reset link will be sent to <strong>{resetTarget.email}</strong>. They'll be prompted to set a new password on next login.</div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setResetTarget(null)}>Send Reset Link</button>
              <button className="btn btn-ghost" onClick={() => setResetTarget(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
