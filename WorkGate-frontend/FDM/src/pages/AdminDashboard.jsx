import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employees, clientCodes } from '../data/mockData';
import '../styles/components.css';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const active = employees.filter(e => e.active).length;
  const inactive = employees.filter(e => !e.active).length;

  const stats = [
    { icon: '👥', label: 'Total Employees', value: employees.length },
    { icon: '✅', label: 'Active Accounts',  value: active, highlight: true },
    { icon: '🚫', label: 'Inactive Accounts', value: inactive },
    { icon: '🏢', label: 'Client Codes',     value: clientCodes.length },
  ];

  const actions = [
    { icon: '➕', label: 'Add Employee',      sub: 'Create a new user account', path: '/app/admin/add-employee' },
    { icon: '👥', label: 'Manage Employees', sub: 'Edit permissions, deactivate accounts', path: '/app/admin/employees' },
    { icon: '🏢', label: 'Client Codes',     sub: 'Add or remove project codes', path: '/app/admin/client-codes' },
  ];

  return (
    <div className="animate-fade">
      <div className={styles.statsGrid}>
        {stats.map(({ icon, label, value, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className={styles.actionsGrid}>
        {actions.map(({ icon, label, sub, path }) => (
          <button key={label} className={styles.actionCard} onClick={() => navigate(path)}>
            <div className={styles.actionIcon}>{icon}</div>
            <div className={styles.actionLabel}>{label}</div>
            <div className={styles.actionSub}>{sub}</div>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Employee Overview</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/admin/employees')}>View All</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employee</th><th>Role</th><th>Client</th><th>Manager</th><th>Status</th></tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id}>
                  <td>
                    <div className={styles.empCell}>
                      <div className={styles.empAvatar}>{e.initials}</div>
                      <div>
                        <div className={styles.empName}>{e.name}</div>
                        <div className={styles.empEmail}>{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{e.role}</td>
                  <td>{e.client}</td>
                  <td>{e.manager}</td>
                  <td>
                    <span className={`badge badge-${e.active ? 'approved' : 'rejected'}`}>
                      {e.active ? 'ACTIVE' : 'INACTIVE'}
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
