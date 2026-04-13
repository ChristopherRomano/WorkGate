import { createContext, useContext, useState } from 'react';
import { loginUser } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (username, password) => {
    try {
      const user = await loginUser(username, password);
      setCurrentUser(user);
      localStorage.setItem('role', user.role);
      return user;
    } catch {
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
