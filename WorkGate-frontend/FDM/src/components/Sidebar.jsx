import { NavLink } from 'react-router-dom';
import { currentUser } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';

const NAV = [
  { section: 'Overview', items: [
    { to: '/',            icon: '◈', label: 'Dashboard' },
    { to: '/profile',     icon: '◉', label: 'My Profile' },
  ]},
  { section: 'Work', items: [
    { to: '/timesheet',   icon: '⏱', label: 'Timesheet' },
    { to: '/tasks',       icon: '✓', label: 'Tasks',      badge: 3 },
    { to: '/leave',       icon: '📅', label: 'Leave' },
    { to: '/expenses',    icon: '£', label: 'Expenses' },
  ]},
  { section: 'Company', items: [
    { to: '/news',        icon: '📢', label: 'News Feed',  badge: 2 },
    { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  ]},
  { section: 'Support', items: [
    { to: '/it',          icon: '🖥', label: 'IT Support' },
    { to: '/hr',          icon: '📋', label: 'HR Reports' },
  ]},
];

const usedDays = currentUser.leaveTotal - currentUser.leaveBalance;
const pct = (usedDays / currentUser.leaveTotal) * 100;

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
                end={to === '/'}
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
        <div className={styles.leaveWidget}>
          <div className={styles.leaveLabel}>Annual Leave</div>
          <div className={styles.leaveTrack}>
            <div className={styles.leaveFill} style={{ width: `${pct}%` }} />
          </div>
          <div className={styles.leaveNums}>
            <span>{currentUser.leaveBalance} remaining</span>
            <span>{usedDays} used</span>
          </div>
        </div>

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
