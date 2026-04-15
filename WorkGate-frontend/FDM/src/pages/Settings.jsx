import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { hasPermission } from '../permissions';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Settings.module.css';

const PASSWORD_KEY = 'wg-password-overrides';
const SETTINGS_KEY = 'wg-user-settings';
const HOME_ROUTE_KEY = 'wg-home-routes';

const HOME_OPTIONS = [
  { path: '/app', label: 'Dashboard', permission: 'dashboard' },
  { path: '/app/tasks', label: 'Tasks', permission: 'tasks' },
  { path: '/app/timesheet', label: 'Timesheet', permission: 'timesheet' },
  { path: '/app/leave', label: 'Leave', permission: 'leave' },
  { path: '/app/expenses', label: 'Expenses', permission: 'expenses' },
  { path: '/app/it', label: 'IT Support', permission: 'it-support' },
  { path: '/app/hr', label: 'HR Reports', permission: 'hr-support' },
  { path: '/app/leave-approval', label: 'Leave Approvals', permission: 'leave-approval' },
  { path: '/app/expense-approval', label: 'Expense Approval', permission: 'expense-approval' },
  { path: '/app/set-task', label: 'Set Task', permission: 'set-task' },
  { path: '/app/posting', label: 'Create Posting', permission: 'posting' },
  { path: '/app/it-management', label: 'IT Ticket Management', permission: 'it-management' },
  { path: '/app/hr-management', label: 'HR Report Management', permission: 'hr-management' },
  { path: '/app/admin', label: 'Admin Dashboard', permission: 'admin-dashboard' },
  { path: '/app/admin/employees', label: 'Manage Employees', permission: 'manage-employees' },
  { path: '/app/admin/add-employee', label: 'Add Employee', permission: 'add-employee' },
  { path: '/app/admin/client-codes', label: 'Client Codes', permission: 'client-codes' },
  { path: '/app/news', label: 'News Feed', permission: 'news' },
];

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

export default function Settings() {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const userKey = getUserKey(currentUser);

  const initialSettings = useMemo(() => {
    const allSettings = readJson(SETTINGS_KEY, {});
    return allSettings[userKey] ?? {
      inAppNotifications: true,
      emailNotifications: true,
      weeklySummary: true,
    };
  }, [userKey]);

  const initialHome = useMemo(() => {
    const allHome = readJson(HOME_ROUTE_KEY, {});
    return allHome[userKey] ?? '/app';
  }, [userKey]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [settings, setSettings] = useState(initialSettings);
  const [defaultHome, setDefaultHome] = useState(initialHome);
  const [saveMessage, setSaveMessage] = useState('');
  const [dangerMessage, setDangerMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState('');

  if (!currentUser) return null;

  const visibleHomes = HOME_OPTIONS.filter((option) => hasPermission(currentUser.role, option.permission));

  useEffect(() => {
    if (visibleHomes.length === 0) return;
    const exists = visibleHomes.some((option) => option.path === defaultHome);
    if (!exists) {
      setDefaultHome(visibleHomes[0].path);
    }
  }, [defaultHome, visibleHomes]);

  const onChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return false;
    }

    const savedPasswords = readJson(PASSWORD_KEY, {});
    const existingPassword = savedPasswords[userKey] ?? 'pass';

    if (currentPassword !== existingPassword) {
      setPasswordError('Current password is incorrect.');
      return false;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return false;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from current password.');
      return false;
    }

    const updated = { ...savedPasswords, [userKey]: newPassword };
    localStorage.setItem(PASSWORD_KEY, JSON.stringify(updated));
    localStorage.setItem('wg-last-password-change', new Date().toISOString());

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess('Password updated successfully in frontend settings.');
    return true;
  };

  const onConfirmChangePassword = () => {
    const success = onChangePassword({ preventDefault: () => {} });
    if (success) {
      setShowPasswordModal(false);
    }
  };

  const onSavePreferences = () => {
    const allSettings = readJson(SETTINGS_KEY, {});
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...allSettings, [userKey]: settings }));

    const allowedHome = visibleHomes.some((option) => option.path === defaultHome) ? defaultHome : '/app';
    const allHomes = readJson(HOME_ROUTE_KEY, {});
    localStorage.setItem(HOME_ROUTE_KEY, JSON.stringify({ ...allHomes, [userKey]: allowedHome }));

    setSaveMessage('Preferences saved.');
  };

  const onResetPreferences = () => {
    const allSettings = readJson(SETTINGS_KEY, {});
    const allHomes = readJson(HOME_ROUTE_KEY, {});

    delete allSettings[userKey];
    delete allHomes[userKey];

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(allSettings));
    localStorage.setItem(HOME_ROUTE_KEY, JSON.stringify(allHomes));

    setSettings({
      inAppNotifications: true,
      emailNotifications: true,
      weeklySummary: true,
    });
    setDefaultHome('/app');
    setDangerMessage('Local preferences were reset for this account.');
  };

  const onResetPassword = () => {
    const allPasswords = readJson(PASSWORD_KEY, {});
    delete allPasswords[userKey];
    localStorage.setItem(PASSWORD_KEY, JSON.stringify(allPasswords));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setDangerMessage('Password override cleared. Demo password is now "pass".');
  };

  const openConfirm = (action) => {
    setPasswordError('');
    setPasswordSuccess('');
    setDangerMessage('');
    setPendingAction(action);
  };

  const closeConfirm = () => setPendingAction('');

  const confirmMeta = {
    'reset-password': {
      title: 'Reset Password Override',
      text: 'This will reset your local password override and restore demo default password "pass".',
      button: 'Yes, Reset Password',
      action: () => { onResetPassword(); closeConfirm(); },
    },
    'reset-preferences': {
      title: 'Reset Local Preferences',
      text: 'This will clear saved theme, notification, and home-page preferences for this account.',
      button: 'Yes, Reset Preferences',
      action: () => { onResetPreferences(); closeConfirm(); },
    },
  };

  const modalConfig = confirmMeta[pendingAction];

  return (
    <div className={`animate-fade ${styles.page}`}>
      <section className={`card ${styles.headerCard}`}>
        <div className="card-body">
          <div className={styles.headerTitle}>Settings</div>
          <div className={styles.headerSub}>Manage your appearance, notifications, and account safety controls.</div>
        </div>
      </section>

      <div className={styles.mainGrid}>
        <section className="card">
          <div className="card-header">
            <span className="card-title">Appearance</span>
          </div>
          <div className="card-body">
            <div className={styles.prefItem}>
              <div>
                <div className={styles.prefLabel}>Theme</div>
                <div className={styles.prefSub}>Choose your preferred interface theme.</div>
              </div>
              <div className={styles.themeButtons}>
                <button
                  className={`${styles.themeBtn} ${theme === 'light' ? styles.themeBtnActive : ''}`}
                  onClick={() => setTheme('light')}
                  type="button"
                >
                  Light
                </button>
                <button
                  className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeBtnActive : ''}`}
                  onClick={() => setTheme('dark')}
                  type="button"
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <span className="card-title">App Preferences</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="default-home">Default Landing Page</label>
              <select
                id="default-home"
                className={`field ${styles.selectField}`}
                value={defaultHome}
                onChange={(e) => setDefaultHome(e.target.value)}
              >
                {visibleHomes.map((option) => (
                  <option key={option.path} value={option.path}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.toggleList}>
              <label className={styles.toggleRow}>
                <span>In-app notifications</span>
                <input
                  type="checkbox"
                  checked={settings.inAppNotifications}
                  onChange={(e) => setSettings((prev) => ({ ...prev, inAppNotifications: e.target.checked }))}
                />
              </label>
              <label className={styles.toggleRow}>
                <span>Email notifications</span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                />
              </label>
              <label className={styles.toggleRow}>
                <span>Weekly summary digest</span>
                <input
                  type="checkbox"
                  checked={settings.weeklySummary}
                  onChange={(e) => setSettings((prev) => ({ ...prev, weeklySummary: e.target.checked }))}
                />
              </label>
            </div>

            <div className={styles.actions}>
              <button className="btn btn-primary" type="button" onClick={onSavePreferences}>Save Preferences</button>
              {saveMessage && <span className={styles.saveMessage}>{saveMessage}</span>}
            </div>
          </div>
        </section>
      </div>

      <section className={`card ${styles.dangerCard}`}>
        <div className="card-header">
          <span className="card-title">Danger Zone</span>
        </div>
        <div className="card-body">
          <p className={styles.dangerText}>
            These actions are high-impact and should be used carefully. Password change is intentionally placed here.
          </p>

          <div className={styles.dangerActions}>
            <button className="btn btn-danger" type="button" onClick={() => setShowPasswordModal(true)}>
              Change Password
            </button>
            <button className="btn btn-danger" type="button" onClick={() => openConfirm('reset-password')}>
              Reset Password To Demo Default
            </button>
            <button className="btn btn-danger" type="button" onClick={() => openConfirm('reset-preferences')}>
              Reset Local Preferences
            </button>
          </div>

          {dangerMessage && <div className={styles.warningMsg}>{dangerMessage}</div>}
        </div>
      </section>

      <Modal isOpen={Boolean(modalConfig)} onClose={closeConfirm} title={modalConfig?.title ?? 'Confirm Action'}>
        <div className={styles.confirmText}>{modalConfig?.text}</div>
        <div className="modal-actions">
          <button className="btn btn-danger" type="button" onClick={modalConfig?.action}>
            {modalConfig?.button ?? 'Confirm'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={closeConfirm}>Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); onConfirmChangePassword(); }}>
          <div className="form-group">
            <label htmlFor="current-password-modal">Current Password</label>
            <input
              id="current-password-modal"
              className="field"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password-modal">New Password</label>
            <input
              id="new-password-modal"
              className="field"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password-modal">Confirm Password</label>
            <input
              id="confirm-password-modal"
              className="field"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {passwordError && <div className={styles.errorMsg}>{passwordError}</div>}
          {passwordSuccess && <div className={styles.successMsg}>{passwordSuccess}</div>}

          <div className="modal-actions">
            <button className="btn btn-primary" type="submit">Save New Password</button>
            <button className="btn btn-ghost" type="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
