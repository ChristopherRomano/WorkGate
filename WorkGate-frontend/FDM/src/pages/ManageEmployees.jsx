import { useState, useEffect, useMemo } from 'react';
import { fetchEmployees, fetchManagers, fetchClientCodes, updateEmployeeProfile, updateEmployeeManager, deactivateEmployee, reactivateEmployee, deleteEmployee } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './ManageEmployees.module.css';

const ROLE_LABEL = {
  employee: 'Employee', consultant: 'Consultant', manager: 'Manager',
  admin: 'Admin', hr: 'HR', ittech: 'IT Tech',
};
const ROLES = ['employee', 'consultant', 'manager', 'admin', 'hr', 'ittech'];

const TABS = [
  { key: 'all',        label: 'All' },
  { key: 'manager',    label: 'Managers' },
  { key: 'consultant', label: 'Consultants' },
  { key: 'employee',   label: 'Employees' },
  { key: 'support',    label: 'Support' },
];

function mapTagToRole(tag) {
  switch ((tag ?? '').toUpperCase()) {
    case 'MANAGER':
      return 'manager';
    case 'HR':
      return 'hr';
    case 'IT':
      return 'ittech';
    case 'ADMIN':
      return 'admin';
    case 'BENCH':
    case 'DEPLOYED':
    case 'TRAINEE':
      return 'consultant';
    case 'EMPLOYEE':
    default:
      return 'employee';
  }
}

function buildFullName(person) {
  const baseName = person?.name?.trim() ?? '';
  const surname = person?.surname?.trim() ?? '';

  if (baseName && surname) {
    if (baseName.toLowerCase().includes(surname.toLowerCase()) || baseName.includes(' ')) {
      return baseName;
    }
    return `${baseName} ${surname}`;
  }

  if (baseName) {
    return baseName;
  }

  if (surname) {
    return surname;
  }

  const emailName = person?.email?.split('@')[0] ?? '';
  if (!emailName) {
    return 'Unknown Employee';
  }

  return emailName
    .split(/[._-]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function buildInitials(name, fallbackInitials) {
  if (fallbackInitials?.trim()) {
    return fallbackInitials.trim().toUpperCase();
  }

  const letters = (name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return letters || 'WG';
}

function normaliseEmployee(person) {
  const name = buildFullName(person);
  const role = mapTagToRole(person?.tag);

  return {
    id: person?.id,
    name,
    initials: buildInitials(name, person?.initials),
    email: person?.email ?? '',
    role,
    tag: person?.tag ?? 'EMPLOYEE',
    manager: person?.managerEmail ?? '',
    active: person?.active ?? true,
    phone: person?.phoneNumber ?? '',
    address: person?.address ?? '',
    emergencyContact: person?.emergencyContact ?? '',
    emergencyPhone: person?.emergencyContactNumber ?? '',
    clientCode: person?.activeClientCode ?? '',
  };
}

export default function ManageEmployees() {
  const [people, setPeople]             = useState([]);
  const [managers, setManagers]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [error, setError]               = useState('');
  const [roleTab, setRoleTab]           = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState(new Set());

  // Modals
  const [viewTarget, setViewTarget]             = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deleteTarget, setDeleteTarget]         = useState(null);
  const [bulkAction, setBulkAction]             = useState(null);
  const [actionError, setActionError]           = useState('');
  const [managerDraft, setManagerDraft]         = useState('');
  const [savingManager, setSavingManager]       = useState(false);
  const [clientCodes, setClientCodes]           = useState([]);
  const [clientCodeDraft, setClientCodeDraft]   = useState('');
  const [savingClientCode, setSavingClientCode] = useState(false);

  useEffect(() => {
    fetchEmployees()
      .then((data) => setPeople((data ?? []).map(normaliseEmployee)))
      .catch(() => setError('Could not load employees.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchManagers()
      .then((data) => setManagers((data ?? []).map(normaliseEmployee)))
      .catch(() => setActionError('Could not load managers from the database.'))
      .finally(() => setLoadingManagers(false));
  }, []);

  useEffect(() => {
    fetchClientCodes()
      .then((data) => setClientCodes(data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setManagerDraft(viewTarget?.manager ?? '');
    setClientCodeDraft(viewTarget?.clientCode ?? '');
  }, [viewTarget]);

  const managerDirectory = useMemo(
    () => new Map(managers.map((manager) => [manager.email, manager])),
    [managers]
  );

  const formatManager = (managerEmail) => {
    if (!managerEmail) return '—';
    const manager = managerDirectory.get(managerEmail);
    return manager ? `${manager.name} (${manager.email})` : managerEmail;
  };

  // ── Counts ────────────────────────────────────────────────────────────────
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
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.manager?.toLowerCase().includes(q) ||
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
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const toggleAll = () => {
    if (allSelected) setSelected(prev => { const n = new Set(prev); filteredIds.forEach(id => n.delete(id)); return n; });
    else             setSelected(prev => { const n = new Set(prev); filteredIds.forEach(id => n.add(id)); return n; });
  };
  const clearSelection = () => setSelected(new Set());

  // ── Single actions ────────────────────────────────────────────────────────
  const confirmDeactivate = async () => {
    setActionError('');
    try {
      await deactivateEmployee(deactivateTarget.email);
      setPeople(prev => prev.map(p => p.email === deactivateTarget.email ? { ...p, active: false } : p));
      setDeactivateTarget(null);
    } catch (e) {
      setActionError(e.message);
    }
  };

  const handleReactivate = async (person) => {
    setActionError('');
    try {
      await reactivateEmployee(person.email);
      setPeople(prev => prev.map(p => p.email === person.email ? { ...p, active: true } : p));
    } catch (e) {
      setActionError(e.message);
    }
  };

  const confirmDelete = async () => {
    setActionError('');
    try {
      await deleteEmployee(deleteTarget.email);
      setPeople(prev => prev.filter(p => p.email !== deleteTarget.email));
      setSelected(prev => { const n = new Set(prev); n.delete(deleteTarget.id); return n; });
      setDeleteTarget(null);
    } catch (e) {
      setActionError(e.message);
    }
  };

  const saveManager = async () => {
    if (!viewTarget) return;

    setActionError('');
    setSavingManager(true);
    try {
      const updated = await updateEmployeeManager(viewTarget.email, managerDraft);
      const updatedEmployee = normaliseEmployee(updated);

      setPeople((previous) => previous.map((person) => person.email === updatedEmployee.email ? updatedEmployee : person));
      setViewTarget(updatedEmployee);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setSavingManager(false);
    }
  };

  const saveClientCode = async () => {
    if (!viewTarget) return;
    setActionError('');
    setSavingClientCode(true);
    try {
      const updated = await updateEmployeeProfile({ email: viewTarget.email, clientCode: clientCodeDraft });
      const updatedEmployee = { ...viewTarget, clientCode: updated?.activeClientCode ?? clientCodeDraft };
      setPeople((prev) => prev.map((p) => p.email === updatedEmployee.email ? updatedEmployee : p));
      setViewTarget(updatedEmployee);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setSavingClientCode(false);
    }
  };

  // ── Bulk actions ──────────────────────────────────────────────────────────
  const executeBulk = async () => {
    setActionError('');
    const targets = people.filter(p => selected.has(p.id));
    try {
      if (bulkAction === 'deactivate') {
        await Promise.all(targets.map(p => deactivateEmployee(p.email)));
        setPeople(prev => prev.map(p => selected.has(p.id) ? { ...p, active: false } : p));
      } else if (bulkAction === 'reactivate') {
        await Promise.all(targets.map(p => reactivateEmployee(p.email)));
        setPeople(prev => prev.map(p => selected.has(p.id) ? { ...p, active: true } : p));
      } else if (bulkAction === 'delete') {
        await Promise.all(targets.map(p => deleteEmployee(p.email)));
        setPeople(prev => prev.filter(p => !selected.has(p.id)));
      }
      clearSelection();
      setBulkAction(null);
    } catch (e) {
      setActionError(e.message);
    }
  };

  if (loading) return <div className="animate-fade" style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading employees…</div>;
  if (error)   return <div className="animate-fade" style={{ padding: '2rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="animate-fade">

      {actionError && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--danger)' }}>
          {actionError}
        </div>
      )}

      {/* Controls */}
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
              <button key={val} className={`${styles.statusBtn} ${statusFilter === val ? styles.statusActive : ''}`} onClick={() => setStatusFilter(val)}>{label}</button>
            ))}
          </div>
        </div>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input className={styles.searchInput} placeholder="Search name, email, role…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className={styles.searchClear} onClick={() => setSearch('')}>×</button>}
        </div>
      </div>

      {/* Bulk bar */}
      {someSelected && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selected.size} selected</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setBulkAction('reactivate')}>Reactivate</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setBulkAction('deactivate')}>Deactivate</button>
          <button className={`btn btn-sm ${styles.bulkDeleteBtn}`} onClick={() => setBulkAction('delete')}>Delete</button>
          <button className="btn btn-ghost btn-sm" onClick={clearSelection}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee Accounts</span>
          <span className={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-wrap">
          <table style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th className={styles.colCheck}><input type="checkbox" className={styles.checkbox} checked={allSelected} onChange={toggleAll} /></th>
                <th className={styles.colEmp}>Employee</th>
                <th className={styles.colRole}>Role</th>
                <th className={styles.colTag}>Tag</th>
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
                  </td>
                  <td className={`${styles.colTag} ${styles.mono}`} style={{ fontSize: 11, color: 'var(--text-dim)' }}>{p.tag || '—'}</td>
                  <td className={styles.colManager} style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatManager(p.manager)}</td>
                  <td className={styles.colStatus}>
                    <span className={`badge badge-${p.active ? 'approved' : 'rejected'}`}>
                      {p.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className={styles.colActions}>
                    <div className={styles.rowActions}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewTarget(p)}>View</button>
                      {p.active
                        ? <button className={`btn btn-sm ${styles.deactivateBtn}`} onClick={() => setDeactivateTarget(p)}>Deactivate</button>
                        : <button className={`btn btn-sm ${styles.reactivateBtn}`} onClick={() => handleReactivate(p)}>Reactivate</button>
                      }
                      <button className={`btn btn-sm ${styles.deleteBtn}`} onClick={() => setDeleteTarget(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PROFILE */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Employee Profile">
        {viewTarget && (
          <div className="form-grid">
            <div className={styles.viewHeader}>
              <div className={styles.viewAvatar}>{viewTarget.initials}</div>
              <div className={styles.viewHeaderInfo}>
                <div className={styles.viewName}>{viewTarget.name}</div>
                <div className={styles.viewBadges}>
                  <span className={`${styles.roleChip} ${styles[`role_${viewTarget.role}`]}`}>{ROLE_LABEL[viewTarget.role]}</span>
                  <span className={`badge badge-${viewTarget.active ? 'approved' : 'rejected'}`}>{viewTarget.active ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
            </div>
            <div className={styles.viewSections}>
              <div className={styles.viewSection}>
                <div className="section-title">Contact</div>
                <div className={styles.viewRow}><span>Email</span><span>{viewTarget.email || '—'}</span></div>
              </div>
              <div className={styles.viewSection}>
                <div className="section-title">Assignment</div>
                <div className={styles.viewRow}><span>Manager</span><span>{formatManager(viewTarget.manager)}</span></div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label>Change Line Manager</label>
                  <select
                    className="field"
                    value={managerDraft}
                    onChange={(e) => setManagerDraft(e.target.value)}
                    disabled={loadingManagers || savingManager}
                  >
                    <option value="">
                      {loadingManagers ? 'Loading managers…' : 'Select a manager'}
                    </option>
                    {managers
                      .filter((manager) => manager.email !== viewTarget.email)
                      .map((manager) => (
                        <option key={manager.email} value={manager.email}>
                          {manager.name} ({manager.email})
                        </option>
                      ))}
                  </select>
                </div>
                {viewTarget.role === 'consultant' && (
                  <div className="form-group" style={{ marginTop: 12 }}>
                    <label>Client Code</label>
                    <select
                      className="field"
                      value={clientCodeDraft}
                      onChange={(e) => setClientCodeDraft(e.target.value)}
                      disabled={savingClientCode}
                    >
                      <option value="">— None —</option>
                      {clientCodes.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.code} — {cc.client}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className={styles.viewSection}>
                <div className="section-title">Access</div>
                <div className={styles.viewRow}><span>Role</span><span>{ROLE_LABEL[viewTarget.role]}</span></div>
                <div className={styles.viewRow}><span>Tag</span><span className={styles.mono}>{viewTarget.tag || '—'}</span></div>
              </div>
            </div>
            <div className={styles.viewActions}>
              <button
                className="btn btn-primary"
                onClick={saveManager}
                disabled={savingManager || loadingManagers || !managerDraft || managerDraft === viewTarget.manager}
              >
                {savingManager ? 'Saving…' : 'Save Manager'}
              </button>
              {viewTarget.role === 'consultant' && (
                <button
                  className="btn btn-primary"
                  onClick={saveClientCode}
                  disabled={savingClientCode || clientCodeDraft === viewTarget.clientCode}
                >
                  {savingClientCode ? 'Saving…' : 'Save Client Code'}
                </button>
              )}
              {viewTarget.active
                ? <button className={`btn btn-sm ${styles.deactivateBtn}`} onClick={() => { setViewTarget(null); setDeactivateTarget(viewTarget); }}>Deactivate</button>
                : <button className={`btn btn-sm ${styles.reactivateBtn}`} onClick={() => { setViewTarget(null); handleReactivate(viewTarget); }}>Reactivate</button>
              }
              <button className={`btn btn-sm ${styles.deleteBtn}`} onClick={() => { setViewTarget(null); setDeleteTarget(viewTarget); }}>Delete</button>
              <button className="btn btn-ghost" onClick={() => setViewTarget(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* DEACTIVATE */}
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

      {/* DELETE */}
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

      {/* BULK */}
      <Modal
        isOpen={!!bulkAction}
        onClose={() => setBulkAction(null)}
        title={
          bulkAction === 'deactivate' ? `Deactivate ${selected.size} Accounts` :
          bulkAction === 'reactivate' ? `Reactivate ${selected.size} Accounts` :
          `Delete ${selected.size} Accounts`
        }
      >
        <div className="form-grid">
          <div className={bulkAction === 'delete' ? styles.warnBoxRed : styles.warnBox}>
            <span className={styles.warnIcon}>{bulkAction === 'delete' ? '🗑️' : '⚠️'}</span>
            <div>
              {bulkAction === 'deactivate' && <><strong>{selected.size} accounts</strong> will be deactivated and lose WorkGate access immediately.</>}
              {bulkAction === 'reactivate' && <><strong>{selected.size} accounts</strong> will be reactivated and restored to full access.</>}
              {bulkAction === 'delete'     && <><strong>{selected.size} accounts</strong> will be <strong>permanently deleted</strong>. This cannot be undone.</>}
            </div>
          </div>
          <div className="modal-actions">
            <button
              className={`btn btn-primary ${(bulkAction === 'delete' || bulkAction === 'deactivate') ? styles.dangerBtn : ''}`}
              onClick={executeBulk}
            >
              Confirm
            </button>
            <button className="btn btn-ghost" onClick={() => setBulkAction(null)}>Cancel</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
