import React, { createContext, useContext, useState, useEffect } from 'react';
import { sessionManager, AdminUser, AdminSession, addSessionListener, removeSessionListener } from '../lib/sessionManager';

interface AdminUserContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
}

const AdminUserContext = createContext<AdminUserContextType | undefined>(undefined);

export const AdminUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize from session manager
    const currentSession = sessionManager.getSession();
    if (currentSession) {
      setAdminUser(currentSession.user);
      setIsAuthenticated(true);
    }

    // Listen for session changes
    const handleSessionChange = (session: AdminSession | null) => {
      if (session) {
        setAdminUser(session.user);
        setIsAuthenticated(true);
      } else {
        setAdminUser(null);
        setIsAuthenticated(false);
      }
    };

    addSessionListener(handleSessionChange);

    return () => {
      removeSessionListener(handleSessionChange);
    };
  }, []);

  const login = (user: AdminUser, token: string) => {
    sessionManager.setSession(user, token);
  };

  const logout = () => {
    sessionManager.clearSession();
  };

  return (
    <AdminUserContext.Provider value={{ adminUser, isAuthenticated, login, logout }}>
      {children}
    </AdminUserContext.Provider>
  );
};

export const useAdminUserContext = (): AdminUserContextType => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error('useAdminUserContext must be used within an AdminUserProvider');
  }
  return context;
};
