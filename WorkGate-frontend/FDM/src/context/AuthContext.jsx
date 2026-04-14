import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserData = async (username) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/employeeInfo?username=${encodeURIComponent(username)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        return null;
      }

      const userType = await response.text();
      const userData = await getUserData(username);

      if (!userData) return null;

      const fullUser = {
        ...userData,
        role: userType
      };

      setCurrentUser(fullUser);

      localStorage.setItem("username", username);
      localStorage.setItem("role", userType);

      return fullUser;

    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}