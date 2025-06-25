import { isTokenValid } from './jwtUtils';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

// Utility to get cookie by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
}

// Session event listeners
type SessionListener = (session: AdminSession | null) => void;
const sessionListeners: SessionListener[] = [];

export function addSessionListener(listener: SessionListener) {
  sessionListeners.push(listener);
}

export function removeSessionListener(listener: SessionListener) {
  const index = sessionListeners.indexOf(listener);
  if (index > -1) {
    sessionListeners.splice(index, 1);
  }
}

function notifySessionChange(session: AdminSession | null) {
  sessionListeners.forEach(listener => listener(session));
}

// Core session management
export class SessionManager {
  private static instance: SessionManager;
  private currentSession: AdminSession | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeSession();
    this.startPeriodicCheck();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }
  private initializeSession() {
    try {
      const storedUser = sessionStorage.getItem('adminUser');
      const storedToken = sessionStorage.getItem('adminToken');
      
      console.log('[SessionManager] Initializing session...');
      console.log('[SessionManager] Stored user:', storedUser);
      console.log('[SessionManager] Stored token exists:', !!storedToken);

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        if (this.isValidSession(user, storedToken)) {
          this.currentSession = {
            user,
            token: storedToken,
            expiresAt: this.getTokenExpiry(storedToken)
          };
          console.log('[SessionManager] Session restored from storage');
          notifySessionChange(this.currentSession);
          return;
        }
      }

      // Try to get token from cookie if not in sessionStorage (only if cookie is not HttpOnly)
      try {
        const cookieToken = getCookie('admin_jwt');
        if (cookieToken && storedUser) {
          const user = JSON.parse(storedUser);
          if (this.isValidSession(user, cookieToken)) {
            this.setSession(user, cookieToken);
            console.log('[SessionManager] Session restored from cookie');
            return;
          }
        }
      } catch (error) {
        console.log('[SessionManager] Cannot read cookie (likely HttpOnly):', error);
      }

      // If we have a user but no valid token, try to keep the session for cookie-based auth
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user && user.role === 'ADMIN') {
            // Create a session without token for cookie-based auth
            this.currentSession = {
              user,
              token: '', // Empty token for cookie-based auth
              expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours default
            };
            console.log('[SessionManager] Session restored (cookie-based auth)');
            notifySessionChange(this.currentSession);
            return;
          }
        } catch (error) {
          console.error('[SessionManager] Error parsing stored user:', error);
        }
      }

      // No valid session found
      this.clearSession();
      console.log('[SessionManager] No valid session found');
    } catch (error) {
      console.error('[SessionManager] Error initializing session:', error);
      this.clearSession();
    }
  }

  private isValidSession(user: AdminUser, token: string): boolean {
    return !!(user && user.role === 'ADMIN' && token && isTokenValid(token));
  }

  private getTokenExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return 0;
    }
  }
  private startPeriodicCheck() {
    // Check session validity every 30 seconds
    this.sessionCheckInterval = setInterval(() => {
      if (this.currentSession) {
        const now = Date.now();
        
        // If we have a token, check if it's still valid
        if (this.currentSession.token && !isTokenValid(this.currentSession.token)) {
          console.log('[SessionManager] JWT token expired, logging out');
          this.clearSession();
          return;
        }
        
        // Check session expiry time
        if (now >= this.currentSession.expiresAt) {
          console.log('[SessionManager] Session expired, logging out');
          this.clearSession();
        }
      }
    }, 30000);
  }
  setSession(user: AdminUser, token: string): void {
    // Validate user data
    if (!user || user.role !== 'ADMIN') {
      console.error('[SessionManager] Invalid user data provided');
      this.clearSession();
      return;
    }

    // If we have a token, validate it
    if (token && !isTokenValid(token)) {
      console.error('[SessionManager] Invalid token provided');
      this.clearSession();
      return;
    }

    // Create session with appropriate expiry
    let expiresAt: number;
    if (token) {
      expiresAt = this.getTokenExpiry(token);
    } else {
      // For cookie-based auth without token, set a default expiry (24 hours)
      expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    }

    this.currentSession = {
      user,
      token: token || '',
      expiresAt
    };

    // Store in sessionStorage
    sessionStorage.setItem('adminUser', JSON.stringify(user));
    if (token) {
      sessionStorage.setItem('adminToken', token);
    }

    console.log('[SessionManager] Session set successfully');
    console.log('[SessionManager] User:', user.email);
    console.log('[SessionManager] Has token:', !!token);
    console.log('[SessionManager] Session expires at:', new Date(this.currentSession.expiresAt));

    notifySessionChange(this.currentSession);
  }

  clearSession(): void {
    this.currentSession = null;
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    
    console.log('[SessionManager] Session cleared');
    notifySessionChange(null);
  }

  getSession(): AdminSession | null {
    return this.currentSession;
  }
  isAuthenticated(): boolean {
    if (!this.currentSession) return false;
    
    // If we have a token, validate it
    if (this.currentSession.token) {
      return isTokenValid(this.currentSession.token);
    }
    
    // If no token but we have a user (cookie-based auth), check if session is still valid
    if (this.currentSession.user && this.currentSession.user.role === 'ADMIN') {
      // For cookie-based auth, assume valid until expiry time
      return Date.now() < this.currentSession.expiresAt;
    }
    
    return false;
  }

  getUser(): AdminUser | null {
    return this.currentSession?.user || null;
  }

  getToken(): string | null {
    return this.currentSession?.token || null;
  }

  destroy(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
    this.clearSession();
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

// Convenience functions
export const setAdminSession = (user: AdminUser, token: string) => sessionManager.setSession(user, token);
export const clearAdminSession = () => sessionManager.clearSession();
export const getAdminSession = () => sessionManager.getSession();
export const isAdminAuthenticated = () => sessionManager.isAuthenticated();
export const getAdminUser = () => sessionManager.getUser();
export const getAdminToken = () => sessionManager.getToken();
