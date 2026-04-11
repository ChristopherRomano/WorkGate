import { useState } from 'react';
import { managers, clientCodes } from '../data/mockData';
import '../styles/components.css';
import styles from './AddEmployee.module.css';

const EMPTY = {
  firstName: '', lastName: '', email: '', role: 'Consultant',
  tag: 'CONSULTANT_BENCH', manager: '', clientCode: '',
};

const TAGS = ['CONSULTANT_DEPLOYED', 'CONSULTANT_BENCH', 'MANAGER', 'ADMIN'];

export default function AddEmployee() {
  const [form, setForm] = useState(EMPTY);
  const [created, setCreated] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const canSubmit = form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.manager;

  const submit = () => {
    if (!canSubmit) return;
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const initials = `${form.firstName[0]}${form.lastName[0]}`.toUpperCase();
    const newEmp = {
      id: `e-new-${Date.now()}`,
      name, initials,
      email: form.email.trim(),
      role: form.role,
      tag: form.tag,
      manager: form.manager,
      clientCode: form.clientCode || 'INTERNAL',
      client: clientCodes.find(c => c.code === form.clientCode)?.client || 'FDM Internal',
      active: true,
    };
    setCreated(prev => [newEmp, ...prev]);
    setForm(EMPTY);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3500);
  };

  return (
    <div className="animate-fade">
      <div className={styles.layout}>
        <div className="card">
          <div className="card-header"><span className="card-title">New Employee Account</span></div>
          <div className={styles.formBody}>

            <div className={styles.twoCol}>
              <div className="form-group">
                <label>First Name</label>
                <input className="field" placeholder="First name" {...field('firstName')} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input className="field" placeholder="Last name" {...field('lastName')} />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input className="field" type="email" placeholder="firstname.lastname@fdmgroup.com" {...field('email')} />
            </div>

            <div className={styles.twoCol}>
              <div className="form-group">
                <label>Role</label>
                <select className="field" {...field('role')}>
                  <option value="Consultant">Consultant</option>
                  <option value="Manager">Manager</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tag / Security Level</label>
                <select className="field" {...field('tag')}>
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Line Manager</label>
              <select className="field" {...field('manager')}>
                <option value="">— Select manager —</option>
                {managers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Client Project Code <span className={styles.optional}>(optional)</span></label>
              <select className="field" {...field('clientCode')}>
                <option value="">— None / Internal —</option>
                {clientCodes.map(c => (
                  <option key={c.id} value={c.code}>{c.code} – {c.client}</option>
                ))}
              </select>
            </div>

            {showSuccess && <div className={styles.successBanner}>Account created successfully.</div>}

            <button className={`btn btn-primary ${styles.createBtn}`} onClick={submit} disabled={!canSubmit}>
              Create Account
            </button>
          </div>
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header"><span className="card-title">Recently Created</span></div>
          <div className={styles.recentBody}>
            {created.length === 0 && <div className={styles.recentEmpty}>No accounts created this session.</div>}
            {created.map(emp => (
              <div key={emp.id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>{emp.initials}</div>
                <div>
                  <div className={styles.recentName}>{emp.name}</div>
                  <div className={styles.recentMeta}>{emp.role} · {emp.tag}</div>
                  <div className={styles.recentMeta}>{emp.email}</div>
                  <div className={styles.recentMeta}>Manager: {emp.manager}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
