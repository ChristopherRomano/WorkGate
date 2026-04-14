import { useState, useEffect } from 'react';
import { createEmployee, fetchEmployees, fetchClientCodes } from '../api/api';
import '../styles/components.css';
import styles from './AddEmployee.module.css';

const EMPTY = {
  firstName: '', lastName: '', email: '', role: 'consultant',
  consultantStatus: 'BENCH', managerEmail: '', clientCode: '',
};

const ROLES = [
  { value: 'consultant',  label: 'Consultant' },
  { value: 'manager',     label: 'Manager' },
  { value: 'hr',          label: 'HR Rep' },
  { value: 'ittech',      label: 'IT Technician' },
  { value: 'employee',    label: 'Employee' },
];

const ROLE_TAG = {
  consultant: null,       // determined by consultantStatus
  manager:    'MANAGER',
  hr:         'HR',
  ittech:     'IT',
  employee:   'EMPLOYEE',
};

const deriveTag = (role, consultantStatus) =>
  role === 'consultant' ? consultantStatus : ROLE_TAG[role] ?? 'OTHER';

export default function AddEmployee() {
  const [form, setForm] = useState(EMPTY);
  const [managers, setManagers] = useState([]);
  const [clientCodes, setClientCodes] = useState([]);
  const [created, setCreated] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [copied, setCopied] = useState(null); // id of entry whose creds were copied

  useEffect(() => {
    fetchEmployees()
      .then(list => setManagers(list.filter(e => e.role === 'manager')))
      .catch(() => {});
    fetchClientCodes()
      .then(setClientCodes)
      .catch(() => {});
  }, []);

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const deriveUsername = (firstName, lastName) =>
    `${firstName[0]}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '');

  const tag = deriveTag(form.role, form.consultantStatus);

  const validate = () => {
    const errs = [];
    if (!form.firstName.trim()) errs.push('First name is required.');
    if (!form.lastName.trim())  errs.push('Last name is required.');
    if (!form.email.trim())     errs.push('Email address is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.push('Email address is not valid.');
    return errs;
  };

  const submit = async () => {
    if (submitting) return;
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setSubmitting(true);

    const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const username = deriveUsername(form.firstName.trim(), form.lastName.trim());
    const initials = `${form.firstName[0]}${form.lastName[0]}`.toUpperCase();

    try {
      const result = await createEmployee({
        email: form.email.trim(),
        username,
        name,
        initials,
        role: form.role,
        tag,
        managerEmail: form.managerEmail || undefined,
      });
      setCreated(prev => [{ ...result, clientCode: form.clientCode || 'INTERNAL' }, ...prev]);
      setForm(EMPTY);
    } catch (e) {
      setErrors([e.message]);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentials = (emp) => {
    const text = `Username: ${emp.username}\nPassword: ${emp.tempPassword}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(emp.id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="animate-fade">
      <div className={styles.layout}>
        {/* ── Form ─────────────────────────────────────────────────────────── */}
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
              {form.firstName.trim() && form.lastName.trim() && (
                <div className={styles.usernamePreview}>
                  Username will be: <strong>{deriveUsername(form.firstName.trim(), form.lastName.trim())}</strong>
                </div>
              )}
            </div>

            <div className={styles.twoCol}>
              <div className="form-group">
                <label>Role</label>
                <select className="field" {...field('role')}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              {form.role === 'consultant' ? (
                <div className="form-group">
                  <label>Deployment Status</label>
                  <select className="field" {...field('consultantStatus')}>
                    <option value="BENCH">Bench</option>
                    <option value="DEPLOYED">Deployed</option>
                    <option value="TRAINEE">Trainee</option>
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Tag</label>
                  <input className="field" value={tag} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} readOnly />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Line Manager <span className={styles.optional}>(optional)</span></label>
              <select className="field" {...field('managerEmail')}>
                <option value="">— None / unassigned —</option>
                {managers.map(m => (
                  <option key={m.email} value={m.email}>
                    {m.name} ({m.email})
                  </option>
                ))}
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

            {errors.length > 0 && (
              <div className={styles.errorBanner}>
                {errors.map((e, i) => <div key={i}>{e}</div>)}
              </div>
            )}

            <button
              className={`btn btn-primary ${styles.createBtn}`}
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </div>

        {/* ── Recently Created ─────────────────────────────────────────────── */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header"><span className="card-title">Recently Created</span></div>
          <div className={styles.recentBody}>
            {created.length === 0 && (
              <div className={styles.recentEmpty}>No accounts created this session.</div>
            )}
            {created.map(emp => (
              <div key={emp.id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>{emp.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.recentName}>{emp.name}</div>
                  <div className={styles.recentMeta}>{emp.role} · {emp.email}</div>

                  <div className={styles.credBox}>
                    <div className={styles.credRow}>
                      <span className={styles.credLabel}>Username</span>
                      <span className={styles.credValue}>{emp.username}</span>
                    </div>
                    <div className={styles.credRow}>
                      <span className={styles.credLabel}>Temp password</span>
                      <span className={styles.credValue}>{emp.tempPassword}</span>
                    </div>
                    <button
                      className={styles.copyBtn}
                      onClick={() => copyCredentials(emp)}
                    >
                      {copied === emp.id ? '✓ Copied!' : 'Copy credentials'}
                    </button>
                  </div>

                  <div className={styles.credNote}>
                    Share these credentials securely — password must be changed on first login.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
