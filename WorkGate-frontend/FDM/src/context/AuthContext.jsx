import { createContext, useContext, useState } from 'react';
import { loginUser } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // For testing purposes, set a default manager user
    return {
      id: 'test-manager',
      name: 'Test Manager',
      email: 'manager@workgate.com',
      role: 'manager',
      initials: 'TM'
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
          initials: 'TM'
        },
        employee: {
          id: 'test-employee',
          name: 'Test Employee',
          email: 'employee@workgate.com',
          role: 'employee',
          initials: 'TE'
        },
        admin: {
          id: 'test-admin',
          name: 'Test Admin',
          email: 'admin@workgate.com',
          role: 'admin',
          initials: 'TA'
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

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
