import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';
import styles from './Login.module.css';

const QUICK_STATS = [
  { value: '1,200+', label: 'Consultants active' },
  { value: '98.4%', label: 'Timesheets on time' },
  { value: '24/7', label: 'IT support coverage' },
];

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
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.brand}>
              <div className={styles.brandMark}>WorkGate</div>
              <div className={styles.brandSub}>Employee Portal</div>
            </div>

            <span className={styles.kicker}>Secure workforce access</span>
            <h1 className={styles.title}>One place for shifts, leave, support, and delivery admin.</h1>
            <p className={styles.copy}>
              Sign in to manage your weekly work, keep certifications current, and stay aligned with client and company updates.
            </p>

            <div className={styles.metrics}>
              {QUICK_STATS.map((item) => (
                <div key={item.label} className={styles.metricCard}>
                  <div className={styles.metricValue}>{item.value}</div>
                  <div className={styles.metricLabel}>{item.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.demoBox}>
              <div className={styles.demoLabel}>Demo accounts (tap to auto-login)</div>
              <div className={styles.demoGrid}>
                {ACCOUNTS.map(({ email, role }) => (
                  <button key={email} className={styles.demoBtn} onClick={() => quickLogin(email)}>
                    <span className={styles.demoRole}>{role}</span>
                    <span className={styles.demoUser}>{email}</span>
                    <span className={styles.demoPass}>password: pass</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.panelWrap}>
          <div className={`${styles.panel} animate-fade`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>Portal Login</span>
              <h2 className={styles.panelTitle}>Access your workspace</h2>
              <p className={styles.panelCopy}>Enter your username and password to continue.</p>
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
          </div>
        </section>
      </div>
    </div>
  );
}
