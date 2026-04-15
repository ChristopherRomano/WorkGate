import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // For testing purposes, set a default manager user
    return {
      id: 'test-manager',
      name: 'Test Manager',
      email: 'manager@workgate.com',
      role: 'manager',
      initials: 'TM',
      tag: 'MANAGER',
    };
  });
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // For testing purposes, return a mock user based on username
      const mockUsers = {
        manager: {
          id: 'test-manager',
          name: 'Test Manager',
          email: 'manager@workgate.com',
          role: 'manager',
          initials: 'TM',
          tag: 'MANAGER',
        },
        employee: {
          id: 'test-employee',
          name: 'Test Employee',
          email: 'employee@workgate.com',
          role: 'employee',
          initials: 'TE',
          tag: 'EMPLOYEE',
        },
        consultant: {
          id: 'test-consultant',
          name: 'Test Consultant',
          email: 'consultant@workgate.com',
          role: 'consultant',
          initials: 'TC',
          tag: 'BENCH',
          clientCode: 'INTERNAL',
          clientName: 'FDM Internal',
          projectEndDate: '2026-06-30',
        },
        ittech: {
          id: 'test-ittech',
          name: 'Test IT Tech',
          email: 'ittech@workgate.com',
          role: 'ittech',
          initials: 'TI',
          tag: 'IT',
        },
        hr: {
          id: 'test-hr',
          name: 'Test HR',
          email: 'hr@workgate.com',
          role: 'hr',
          initials: 'TH',
          tag: 'HR',
        },
        admin: {
          id: 'test-admin',
          name: 'Test Admin',
          email: 'admin@workgate.com',
          role: 'admin',
          initials: 'TA',
          tag: 'ADMIN',
        }
      };

      const user = mockUsers[username] || mockUsers.manager; // Default to manager
      setCurrentUser(user);
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
  };

  const updateCurrentUser = (updater) => {
    setCurrentUser((prev) => (
      typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
    ));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
