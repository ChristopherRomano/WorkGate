import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';
import styles from './Login.module.css';

const ACCOUNTS = [
  { email: 'employee@workgate.com',   role: 'Employee' },
  { email: 'consultant@workgate.com', role: 'Consultant' },
  { email: 'manager@workgate.com',    role: 'Manager' },
  { email: 'ittech@workgate.com',     role: 'IT Technician' },
  { email: 'hr@workgate.com',         role: 'HR Rep' },
  { email: 'admin@workgate.com',      role: 'Administrator' },
];

const ROLE_HOME = {
  admin:  '/app/admin',
  ittech: '/app/it-management',
  hr:     '/app/hr-management',
};

function getUserKey(user) {
  return user?.username ?? user?.email ?? user?.id ?? user?.name ?? 'default-user';
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getPreferredHome(user) {
  const homeByUser = readJson('wg-home-routes', {});
  const userKey = getUserKey(user);
  return homeByUser[userKey] ?? ROLE_HOME[user.role] ?? '/app';
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = await login(username.trim(), password);

    if (!user) {
      setError('Invalid username or password.');
      return;
    }

    navigate(getPreferredHome(user));
  };


  const quickLogin = async (email) => {
    const user = await login(email, 'pass');
    if (user) {
      navigate(getPreferredHome(user));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.workspace}>
          <div className={styles.workspaceCard}>
            <header className={styles.brandRow}>
              <div>
                <div className={styles.brandMark}>WorkGate</div>
                <div className={styles.brandSub}>Employee Portal</div>
              </div>
              <span className={styles.badge}>Internal Use</span>
            </header>

            <div className={styles.workspaceIntro}>
              <h1 className={styles.title}>Sign in to your work environment</h1>
              <p className={styles.copy}>
                Access staffing, leave, approvals, and IT requests in one secure workspace for daily operations.
              </p>
            </div>

            <div className={styles.infoGrid}>
              <article className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Operations Status</h2>
                <ul className={styles.infoList}>
                  <li>Identity service: Operational</li>
                  <li>Approvals queue: Normal load</li>
                  <li>Last policy sync: Today, 08:15</li>
                </ul>
              </article>

              <article className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Service Notice</h2>
                <p className={styles.infoText}>
                  Next scheduled maintenance: Sunday, 28 April, 01:00-02:30 BST. Some services may be temporarily unavailable.
                </p>
              </article>
            </div>

            <div className={styles.supportBar}>
              <span className={styles.supportLabel}>Support</span>
              <p className={styles.supportText}>For access issues, contact IT Service Desk at ext. 104 or it-support@workgate.com</p>
            </div>
          </div>
        </section>

        <section className={styles.panelWrap}>
          <div className={`${styles.panel} animate-fade`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>Secure Access</span>
              <h2 className={styles.panelTitle}>WorkGate Sign In</h2>
              <p className={styles.panelCopy}>Enter your account credentials to continue to the portal.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  className="field"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. consultant"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>
                Sign In
              </button>
            </form>

            <div className={styles.demoBox}>
              <div className={styles.demoLabel}>Demo accounts (password: pass)</div>
              <div className={styles.demoGrid}>
                {ACCOUNTS.map(({ email, role }) => (
                  <button key={email} className={styles.demoBtn} onClick={() => quickLogin(email)}>
                    <span className={styles.demoRole}>{role}</span>
                    <span className={styles.demoUser}>{email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
