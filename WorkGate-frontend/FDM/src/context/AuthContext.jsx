import { createContext, useContext, useState } from 'react';
import { fetchEmployeeProfile, loginUser } from '../api/api';

const AuthContext = createContext(null);

const CURRENT_USER_KEY = 'wg-current-user';

function roleFromTag(tag) {
  const normalizedTag = String(tag ?? '').toUpperCase();

  switch (normalizedTag) {
    case 'MANAGER':
      return 'manager';
    case 'IT':
      return 'ittech';
    case 'HR':
      return 'hr';
    case 'ADMIN':
      return 'admin';
    case 'BENCH':
    case 'DEPLOYED':
      return 'consultant';
    case 'TRAINEE':
    case 'EMPLOYEE':
    default:
      return 'employee';
  }
}

function toCurrentUser(profile, loginResponse) {
  const tag = profile?.tag ?? loginResponse?.tag;
  const email = profile?.email ?? loginResponse?.username ?? '';
  const firstName = profile?.name ?? '';
  const surname = profile?.surname ?? '';
  const name = [firstName, surname].filter(Boolean).join(' ').trim() || (loginResponse?.username ?? email);
  const initials = profile?.initials ?? (name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'U');

  return {
    id: profile?.id ?? email,
    username: profile?.username ?? loginResponse?.username ?? email,
    email,
    firstName,
    surname,
    name,
    initials,
    role: roleFromTag(tag),
    tag,
    managerEmail: profile?.managerEmail,
    annualLeaveBalance: Number(profile?.annualLeaveBalance ?? 10),
    annualLeaveTotal: Number(profile?.annualLeaveTotal ?? 25),
    clientCode: profile?.activeClientCode,
    clientName: profile?.clientName,
    projectEndDate: profile?.endDate ? String(profile.endDate) : undefined,
  };
}

function readCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readCurrentUser);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const loginResponse = await loginUser(username.trim(), password);

      if (!loginResponse?.username) {
        return null;
      }

      let profile = null;

      try {
        profile = await fetchEmployeeProfile(loginResponse.username);
      } catch {
        profile = null;
      }

      const user = toCurrentUser(profile, loginResponse);
      setCurrentUser(user);
      saveCurrentUser(user);
      localStorage.setItem('role', user.role);
      return user;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('role');
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateCurrentUser = (updater) => {
    setCurrentUser((prev) => {
      const nextUser = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveCurrentUser(nextUser);
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
