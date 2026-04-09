import { NavLink } from 'react-router-dom';
import { currentUser } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';

const NAV = [
  { section: 'Overview', items: [
    { to: '/app',              icon: '◈', label: 'Dashboard' },
    { to: '/app/profile',      icon: '◉', label: 'My Profile' },
  ]},
  { section: 'Work', items: [
    { to: '/app/timesheet',    icon: '⏱', label: 'Timesheet' },
    { to: '/app/tasks',        icon: '✓', label: 'Tasks',      badge: 3 },
    { to: '/app/leave',        icon: '📅', label: 'Leave' },
    { to: '/app/expenses',     icon: '£', label: 'Expenses' },
  ]},
  { section: 'Company', items: [
    { to: '/app/news',         icon: '📢', label: 'News Feed',  badge: 2 },
  ]},
  { section: 'Support', items: [
    { to: '/app/it',           icon: '🖥', label: 'IT Support' },
    { to: '/app/hr',           icon: '📋', label: 'HR Reports' },
  ]},
  { section: 'Posting', items: [
    { to: '/app/posting',      icon: '�', label: 'Create Posting' },
  ]},
];


export default function Sidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>WorkGate</div>
        <div className={styles.logoSub}>Employee Portal</div>
      </div>

      {/* User badge */}
      <div className={styles.userBadge}>
        <div className={styles.avatar}>{currentUser.initials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{currentUser.name}</div>
          <span className={styles.roleTag}>
            {currentUser.tagCode === 'CONSULTANT_DEPLOYED' ? 'CONSULTANT · DEPLOYED' : currentUser.tag.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <div className={styles.sectionLabel}>{section}</div>
            {items.map(({ to, icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/app'}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{icon}</span>
                {label}
                {badge != null && (
                  <span className={styles.navBadge}>{badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Leave balance + Settings */}
      <div className={styles.bottom}>
<div className={styles.settingsWidget}>
          <div className={styles.settingsLabel}>Appearance</div>
          <div className={styles.themeButtons}>
            <button
              className={`${styles.themeBtn} ${theme === 'light' ? styles.themeBtnActive : ''}`}
              onClick={() => setTheme('light')}
            >
              ◑ Light
            </button>
            <button
              className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeBtnActive : ''}`}
              onClick={() => setTheme('dark')}
            >
              ● Dark
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
