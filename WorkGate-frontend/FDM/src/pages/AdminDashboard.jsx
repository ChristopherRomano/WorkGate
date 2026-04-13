import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { users, employees, clientCodes } from '../data/mockData';
import '../styles/components.css';
import styles from './AdminDashboard.module.css';

// Merge users + employees into a normalised list for the directory
const allPeople = [
  ...users.map(u => ({
    id: u.id,
    initials: u.initials,
    name: u.name,
    email: u.email,
    role: u.role,
    client: u.clientName || null,
    manager: u.manager || null,
    active: true,
  })),
  ...employees
    .filter(e => !users.some(u => u.name === e.name))
    .map(e => ({
      id: e.id,
      initials: e.initials,
      name: e.name,
      email: e.email,
      role: 'consultant',
      client: e.client || null,
      manager: e.manager || null,
      active: e.active,
    })),
];

const ROLE_LABEL = {
  employee:   'Employee',
  consultant: 'Consultant',
  manager:    'Manager',
  admin:      'Admin',
  hr:         'HR',
  ittech:     'IT Tech',
};

const TABS = [
  { key: 'all',        label: 'All' },
  { key: 'manager',    label: 'Managers' },
  { key: 'consultant', label: 'Consultants' },
  { key: 'employee',   label: 'Employees' },
  { key: 'support',    label: 'Support' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState('all');
  const [search, setSearch] = useState('');

  const stats = [
    { icon: '👥', label: 'Total People',     value: allPeople.length },
    { icon: '✅', label: 'Active Accounts',  value: allPeople.filter(p => p.active).length, highlight: true },
    { icon: '🏢', label: 'Client Codes',     value: clientCodes.length },
    { icon: '🗂', label: 'Managers',         value: allPeople.filter(p => p.role === 'manager').length },
  ];

  const actions = [
    { icon: '➕', label: 'Add Employee',     sub: 'Create a new user account',              path: '/app/admin/add-employee' },
    { icon: '👥', label: 'Manage Employees', sub: 'Edit permissions, deactivate accounts', path: '/app/admin/employees' },
    { icon: '🏢', label: 'Client Codes',     sub: 'Add or remove project codes',           path: '/app/admin/client-codes' },
  ];

  const counts = useMemo(() => ({
    all:        allPeople.length,
    manager:    allPeople.filter(p => p.role === 'manager').length,
    consultant: allPeople.filter(p => p.role === 'consultant').length,
    employee:   allPeople.filter(p => p.role === 'employee').length,
    support:    allPeople.filter(p => ['admin','hr','ittech'].includes(p.role)).length,
  }), []);

  const filtered = useMemo(() => {
    let list = allPeople;

    if (roleTab === 'support') {
      list = list.filter(p => ['admin', 'hr', 'ittech'].includes(p.role));
    } else if (roleTab !== 'all') {
      list = list.filter(p => p.role === roleTab);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        ROLE_LABEL[p.role]?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [roleTab, search]);

  return (
    <div className="animate-fade">
      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map(({ icon, label, value, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className={styles.actionsGrid}>
        {actions.map(({ icon, label, sub, path }) => (
          <button key={label} className={styles.actionCard} onClick={() => navigate(path)}>
            <div className={styles.actionIcon}>{icon}</div>
            <div className={styles.actionLabel}>{label}</div>
            <div className={styles.actionSub}>{sub}</div>
          </button>
        ))}
      </div>

      {/* Directory */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">People Directory</span>
        </div>

        {/* Tab bar + search */}
        <div className={styles.directoryControls}>
          <div className={styles.roleTabs}>
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                className={`btn ${roleTab === key ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                onClick={() => setRoleTab(key)}
              >
                {label}
                <span className={styles.tabCount}>{counts[key]}</span>
              </button>
            ))}
          </div>

          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>×</button>
            )}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Client / Dept</th>
                <th>Manager</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '28px 16px' }}>
                    No results found.
                  </td>
                </tr>
              )}
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.empCell}>
                      <div className={styles.empAvatar}>{p.initials}</div>
                      <div>
                        <div className={styles.empName}>{p.name}</div>
                        <div className={styles.empEmail}>{p.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.roleChip} ${styles[`role_${p.role}`]}`}>
                      {ROLE_LABEL[p.role] || p.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.client || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.manager || '—'}</td>
                  <td>
                    <span className={`badge badge-${p.active ? 'approved' : 'rejected'}`}>
                      {p.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
