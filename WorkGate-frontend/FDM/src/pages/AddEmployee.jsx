import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee, fetchManagers, fetchClientCodes } from '../api/api';
import '../styles/components.css';
import styles from './AddEmployee.module.css';

const DOMAIN = '@fdmgroup.com';
const TEMP_PASSWORD = 'pass';
const EMPTY = {
  firstName: '',
  lastName: '',
  email: DOMAIN,
  role: 'consultant',
  consultantStatus: 'BENCH',
  managerEmail: '',
  clientCode: '',
};

const ROLES = [
  { value: 'consultant', label: 'Consultant' },
  { value: 'manager', label: 'Manager' },
  { value: 'hr', label: 'HR Rep' },
  { value: 'ittech', label: 'IT Technician' },
  { value: 'employee', label: 'Employee' },
];

const ROLE_TAG = {
  consultant: null,
  manager: 'MANAGER',
  hr: 'HR',
  ittech: 'IT',
  employee: 'EMPLOYEE',
};

const deriveTag = (role, consultantStatus) =>
  role === 'consultant' ? consultantStatus : ROLE_TAG[role] ?? 'EMPLOYEE';

function buildManagerName(manager) {
  const fullName = [manager?.name, manager?.surname]
    .filter(Boolean)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');

  if (fullName) {
    return fullName;
  }

  const localPart = manager?.email?.split('@')[0] ?? '';
  if (!localPart) {
    return 'Unnamed Manager';
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [managers, setManagers] = useState([]);
  const [clientCodes, setClientCodes] = useState([]);
  const [created, setCreated] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [errors, setErrors] = useState([]);
  const [copied, setCopied] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchClientCodes()
      .then((data) => setClientCodes(data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchManagers()
      .then((data) => {
        const managerOptions = (data ?? []).map((manager) => ({
          email: manager.email,
          name: buildManagerName(manager),
        }));
        setManagers(managerOptions);
      })
      .catch(() => {
        setErrors(['Could not load line managers from the database.']);
      })
      .finally(() => setLoadingManagers(false));
  }, []);

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((current) => ({ ...current, [key]: e.target.value })),
  });

  const deriveUsername = (firstName, lastName) =>
    `${(firstName?.[0] ?? '')}${lastName ?? ''}`.toLowerCase().replace(/[^a-z0-9]/g, '');

  const tag = deriveTag(form.role, form.consultantStatus);

  const validate = () => {
    const validationErrors = [];

    if (!form.firstName.trim()) validationErrors.push('First name is required.');
    if (!form.lastName.trim()) validationErrors.push('Last name is required.');
    if (!form.email.trim()) validationErrors.push('Email address is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) validationErrors.push('Email address is not valid.');
    if (!form.managerEmail) validationErrors.push('Line manager is required.');
    if (loadingManagers) validationErrors.push('Managers are still loading. Please wait a moment.');
    if (!loadingManagers && managers.length === 0) validationErrors.push('No managers are available in the database.');

    return validationErrors;
  };

  const submit = async () => {
    if (submitting) return;

    const validationErrors = validate();
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setSuccessMessage('');
    setSubmitting(true);

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const name = `${firstName} ${lastName}`.trim();
    const username = deriveUsername(firstName, lastName);
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
    const selectedManager = managers.find((manager) => manager.email === form.managerEmail);

    try {
      await createEmployee({
        email: form.email.trim(),
        username,
        name,
        initials,
        role: form.role,
        tag,
        managerEmail: form.managerEmail,
        password: TEMP_PASSWORD,
        clientCode: form.role === 'consultant' && form.consultantStatus === 'DEPLOYED' ? form.clientCode : '',
      });

      const newEmployee = {
        id: `e-new-${Date.now()}`,
        name,
        initials,
        email: form.email.trim(),
        role: form.role,
        tag,
        manager: selectedManager?.name ?? form.managerEmail,
        username,
        tempPassword: TEMP_PASSWORD,
      };

      setCreated((previous) => [newEmployee, ...previous]);
      setForm(EMPTY);
      setSuccessMessage('Employee created successfully with a database-backed line manager.');
    } catch (error) {
      setErrors([error.message || 'Could not create employee.']);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentials = (employee) => {
    const text = `Username: ${employee.username}\nPassword: ${employee.tempPassword}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(employee.id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="animate-fade">
      {/* Hub buttons */}
      <div className={styles.hubRow}>
        <button className={`btn btn-primary ${styles.hubBtn}`}>➕ Add Employee</button>
        <button className={`btn btn-ghost ${styles.hubBtn}`} onClick={() => navigate('/app/admin/client-codes')}>🏢 Client Codes</button>
      </div>

      <div className={styles.layout}>
        <div className="card">
          <div className="card-header"><span className="card-title">New Employee Account</span></div>
          <div className={styles.formBody}>
            <div className={styles.twoCol}>
              <div className="form-group">
                <label>First Name</label>
                <input className="field" placeholder="e.g. Sarah" {...field('firstName')} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input className="field" placeholder="e.g. O'Brien" {...field('lastName')} />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                className="field"
                type="text"
                placeholder={`firstname.lastname${DOMAIN}`}
                {...field('email')}
                onFocus={(e) => {
                  const pos = e.target.value.indexOf('@');
                  if (pos !== -1) e.target.setSelectionRange(pos, pos);
                }}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.endsWith(DOMAIN)) {
                    const prefix = value.includes('@') ? value.split('@')[0] : value;
                    value = prefix + DOMAIN;
                  }
                  setForm((current) => ({ ...current, email: value }));
                }}
              />
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
                  {ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
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

            {form.role === 'consultant' && form.consultantStatus === 'DEPLOYED' && (
              <div className="form-group">
                <label>Client Code</label>
                <select className="field" {...field('clientCode')}>
                  <option value="">— None —</option>
                  {clientCodes.map((cc) => (
                    <option key={cc.code} value={cc.code}>
                      {cc.code} — {cc.client}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Line Manager</label>
              <select className="field" {...field('managerEmail')} disabled={loadingManagers || managers.length === 0}>
                <option value="">
                  {loadingManagers ? 'Loading managers…' : 'Select a line manager'}
                </option>
                {managers.map((manager) => (
                  <option key={manager.email} value={manager.email}>
                    {manager.name} ({manager.email})
                  </option>
                ))}
              </select>
            </div>

            {successMessage && (
              <div style={{ fontSize: 13, color: 'var(--text)', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 8, padding: '10px 14px' }}>
                {successMessage}
              </div>
            )}

            {errors.length > 0 && (
              <div className={styles.errorBanner}>
                {errors.map((error, index) => <div key={index}>{error}</div>)}
              </div>
            )}

            <button
              className={`btn btn-primary ${styles.createBtn}`}
              onClick={submit}
              disabled={submitting || loadingManagers}
            >
              {submitting ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header"><span className="card-title">Recently Created</span></div>
          <div className={styles.recentBody}>
            {created.length === 0 && (
              <div className={styles.recentEmpty}>No accounts created this session.</div>
            )}
            {created.map((employee) => (
              <div key={employee.id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>{employee.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.recentName}>{employee.name}</div>
                  <div className={styles.recentMeta}>{employee.role} · {employee.email}</div>
                  <div className={styles.credBox}>
                    <div className={styles.credRow}>
                      <span className={styles.credLabel}>Username</span>
                      <span className={styles.credValue}>{employee.username}</span>
                    </div>
                    <div className={styles.credRow}>
                      <span className={styles.credLabel}>Temp password</span>
                      <span className={styles.credValue}>{employee.tempPassword}</span>
                    </div>
                    <div className={styles.credRow}>
                      <span className={styles.credLabel}>Manager</span>
                      <span className={styles.credValue}>{employee.manager}</span>
                    </div>
                    <button className={styles.copyBtn} onClick={() => copyCredentials(employee)}>
                      {copied === employee.id ? '✓ Copied!' : 'Copy credentials'}
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
