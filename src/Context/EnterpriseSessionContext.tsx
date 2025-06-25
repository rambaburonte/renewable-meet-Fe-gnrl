import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  enterpriseSessionManager, 
  SessionEvent, 
  AdminUser, 
  SessionData,
  getSessionInfo 
} from '../lib/enterpriseSessionManager';

interface EnterpriseSessionContextType {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  sessionInfo: any;
  
  // Session management
  login: (user: AdminUser, accessToken: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  
  // Session monitoring
  lastActivity: number;
  sessionHealth: 'healthy' | 'warning' | 'expired' | 'refreshing';
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const EnterpriseSessionContext = createContext<EnterpriseSessionContextType | undefined>(undefined);

export const EnterpriseSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionHealth, setSessionHealth] = useState<'healthy' | 'warning' | 'expired' | 'refreshing'>('healthy');
  const [error, setError] = useState<string | null>(null);

  // Update session info periodically
  const updateSessionInfo = useCallback(() => {
    const info = getSessionInfo();
    setSessionInfo(info);
    
    if (info) {
      // Determine session health
      const timeUntilExpiry = info.timeUntilExpiry;
      const timeSinceActivity = info.timeSinceActivity;
      
      if (info.isRefreshing) {
        setSessionHealth('refreshing');
      } else if (timeUntilExpiry <= 0) {
        setSessionHealth('expired');
      } else if (timeUntilExpiry <= 300) { // 5 minutes
        setSessionHealth('warning');
      } else {
        setSessionHealth('healthy');
      }
    }
  }, []);

  // Session event handlers
  useEffect(() => {
    const handleLogin = (event: SessionEvent, data: any) => {
      console.log('[EnterpriseSession] Login event:', data);
      setIsAuthenticated(true);
      setUser(data.user);
      setIsLoading(false);
      setError(null);
      updateSessionInfo();
    };

    const handleLogout = (event: SessionEvent, data: any) => {
      console.log('[EnterpriseSession] Logout event:', data);
      setIsAuthenticated(false);
      setUser(null);
      setSessionInfo(null);
      setSessionHealth('expired');
      setError(null);
    };

    const handleRefresh = (event: SessionEvent, data: any) => {
      console.log('[EnterpriseSession] Refresh event:', data);
      updateSessionInfo();
      setError(null);
    };

    const handleExpired = (event: SessionEvent, data: any) => {
      console.log('[EnterpriseSession] Session expired:', data);
      setIsAuthenticated(false);
      setUser(null);
      setSessionInfo(null);
      setSessionHealth('expired');
      
      // Show appropriate error message based on expiry reason
      switch (data?.reason) {
        case 'inactivity':
          setError('Session expired due to inactivity');
          break;
        case 'refresh_failed':
          setError('Session expired - please login again');
          break;
        case 'refresh_exhausted':
          setError('Unable to refresh session - please login again');
          break;
        default:
          setError('Session expired');
      }
    };

    const handleActivity = (event: SessionEvent, data: any) => {
      setLastActivity(data.timestamp);
      updateSessionInfo();
    };

    const handleError = (event: SessionEvent, data: any) => {
      console.error('[EnterpriseSession] Session error:', data);
      setError(`Session error: ${data.error?.message || 'Unknown error'}`);
    };

    // Register event listeners
    enterpriseSessionManager.on(SessionEvent.LOGIN, handleLogin);
    enterpriseSessionManager.on(SessionEvent.LOGOUT, handleLogout);
    enterpriseSessionManager.on(SessionEvent.REFRESH, handleRefresh);
    enterpriseSessionManager.on(SessionEvent.EXPIRED, handleExpired);
    enterpriseSessionManager.on(SessionEvent.ACTIVITY, handleActivity);
    enterpriseSessionManager.on(SessionEvent.ERROR, handleError);

    // Initialize session state
    const currentSession = enterpriseSessionManager.getSession();
    const isAuth = enterpriseSessionManager.isAuthenticated();
    
    setIsAuthenticated(isAuth);
    setUser(currentSession?.user || null);
    setIsLoading(false);
    updateSessionInfo();

    // Cleanup event listeners
    return () => {
      enterpriseSessionManager.off(SessionEvent.LOGIN, handleLogin);
      enterpriseSessionManager.off(SessionEvent.LOGOUT, handleLogout);
      enterpriseSessionManager.off(SessionEvent.REFRESH, handleRefresh);
      enterpriseSessionManager.off(SessionEvent.EXPIRED, handleExpired);
      enterpriseSessionManager.off(SessionEvent.ACTIVITY, handleActivity);
      enterpriseSessionManager.off(SessionEvent.ERROR, handleError);
    };
  }, [updateSessionInfo]);

  // Update session info periodically
  useEffect(() => {
    const interval = setInterval(updateSessionInfo, 60000); // Every 60 seconds (1 minute)
    return () => clearInterval(interval);
  }, [updateSessionInfo]);

  // Session management functions
  const login = useCallback(async (user: AdminUser, accessToken: string, refreshToken?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await enterpriseSessionManager.setSession(user, accessToken, refreshToken);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Call backend logout endpoint
      try {
        await fetch('/admin/api/admin/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${enterpriseSessionManager.getAccessToken()}`
          }
        });
      } catch (error) {
        console.warn('[EnterpriseSession] Backend logout failed:', error);
      }
      
      // Clear local session
      enterpriseSessionManager.clearSession();
      
    } catch (error: any) {
      setError(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const result = await enterpriseSessionManager.refreshSession();
      if (!result) {
        setError('Failed to refresh session');
      }
      return result;
    } catch (error: any) {
      setError(error.message || 'Session refresh failed');
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: EnterpriseSessionContextType = {
    isAuthenticated,
    isLoading,
    user,
    sessionInfo,
    login,
    logout,
    refreshSession,
    lastActivity,
    sessionHealth,
    error,
    clearError
  };

  return (
    <EnterpriseSessionContext.Provider value={contextValue}>
      {children}
    </EnterpriseSessionContext.Provider>
  );
};

export const useEnterpriseSession = (): EnterpriseSessionContextType => {
  const context = useContext(EnterpriseSessionContext);
  if (!context) {
    throw new Error('useEnterpriseSession must be used within an EnterpriseSessionProvider');
  }
  return context;
};

// Backward compatibility with existing AdminUserContext
export const useAdminUserContext = () => {
  const context = useEnterpriseSession();
  return {
    adminUser: context.user,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout,
    setAdminUser: (user: AdminUser | null) => {
      // For compatibility - this is not the preferred way in enterprise mode
      if (user) {
        console.warn('[EnterpriseSession] setAdminUser is deprecated, use login instead');
      } else {
        context.logout();
      }
    }
  };
};
