import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components.css';
import styles from './Login.module.css';

const QUICK_STATS = [
  { value: '1,200+', label: 'Consultants active' },
  { value: '98.4%', label: 'Timesheets on time' },
  { value: '24/7', label: 'IT support coverage' },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/app');
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

            <div className={styles.notice}>
              <div className={styles.noticeLabel}>Today</div>
              <div className={styles.noticeBody}>
                Scheduled maintenance window complete. Core services are available for Monday, 6 April 2026 access.
              </div>
            </div>
          </div>
        </section>

        <section className={styles.panelWrap}>
          <div className={`${styles.panel} animate-fade`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>Portal Login</span>
              <h2 className={styles.panelTitle}>Access your workspace</h2>
              <p className={styles.panelCopy}>Use your company email and password to continue into WorkGate.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Work Email</label>
                <input
                  id="email"
                  className="field"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@fdm.com"
                />
              </div>

              <div className="form-group">
                <div className={styles.passwordRow}>
                  <label htmlFor="password">Password</label>
                  <Link className={styles.inlineLink} to="/login">Forgot password?</Link>
                </div>
                <input
                  id="password"
                  className="field"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className={styles.formMeta}>
                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span>Keep me signed in on this device</span>
                </label>
                <span className={styles.metaText}>SSO available on managed laptops</span>
              </div>

              <button className="btn btn-primary" type="submit">Sign In</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
