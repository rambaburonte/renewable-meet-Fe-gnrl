import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  sub: string; // subject (user email)
  role: string;
  iat: number; // issued at
  exp: number; // expiration
  jti?: string; // JWT ID for tracking
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface SessionData {
  user: AdminUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  issuedAt: number;
  sessionId: string;
}

export interface SessionConfig {
  autoRefresh: boolean;
  refreshThreshold: number; // minutes before expiry to refresh
  maxRetries: number;
  sessionTimeout: number; // minutes of inactivity
  enableActivityTracking: boolean;
}

// Default configuration
const DEFAULT_CONFIG: SessionConfig = {
  autoRefresh: true,
  refreshThreshold: 5, // Refresh 5 minutes before expiry
  maxRetries: 3,
  sessionTimeout: 30, // 30 minutes of inactivity
  enableActivityTracking: true
};

// Session events
export enum SessionEvent {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REFRESH = 'refresh',
  EXPIRED = 'expired',
  ACTIVITY = 'activity',
  ERROR = 'error'
}

type SessionEventHandler = (event: SessionEvent, data?: any) => void;

// Utility functions
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function isTokenExpired(token: string, thresholdMinutes: number = 0): boolean {
  try {
    const payload: JWTPayload = jwtDecode(token);
    const now = Date.now();
    const expiry = payload.exp * 1000;
    const threshold = thresholdMinutes * 60 * 1000;
    return now >= (expiry - threshold);
  } catch {
    return true;
  }
}

function getTokenPayload(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
}

// Enterprise-level Session Manager
export class EnterpriseSessionManager {
  private static instance: EnterpriseSessionManager;
  private currentSession: SessionData | null = null;
  private config: SessionConfig;
  private eventHandlers: Map<SessionEvent, SessionEventHandler[]> = new Map();
  private refreshTimer: NodeJS.Timeout | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private refreshPromise: Promise<boolean> | null = null;
  private isRefreshing: boolean = false;
  private constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeSession();
    this.setupCrossTabSync();
    this.setupActivityTracking();
    this.startSessionMonitoring();
  }

  static getInstance(config?: Partial<SessionConfig>): EnterpriseSessionManager {
    if (!EnterpriseSessionManager.instance) {
      EnterpriseSessionManager.instance = new EnterpriseSessionManager(config);
    }
    return EnterpriseSessionManager.instance;
  }

  // Event management
  on(event: SessionEvent, handler: SessionEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: SessionEvent, handler: SessionEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: SessionEvent, data?: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(event, data);
      } catch (error) {
        console.error(`[SessionManager] Error in event handler for ${event}:`, error);
      }
    });
  }

  // Session initialization
  private initializeSession(): void {
    try {
      console.log('[SessionManager] Initializing enterprise session...');
      
      const storedSession = sessionStorage.getItem('enterprise_session');
      if (storedSession) {
        const session: SessionData = JSON.parse(storedSession);
        
        // Validate stored session
        if (this.validateStoredSession(session)) {
          this.currentSession = session;
          this.lastActivity = Date.now();
          this.emit(SessionEvent.LOGIN, { user: session.user, restored: true });
          console.log('[SessionManager] Session restored from storage');
          return;
        }
      }

      // Try to restore from cookie
      this.tryRestoreFromCookie();
      
    } catch (error) {
      console.error('[SessionManager] Error initializing session:', error);
      this.clearSession();
    }
  }

  private validateStoredSession(session: SessionData): boolean {
    // Check if session has required fields
    if (!session.user || !session.accessToken || !session.sessionId) {
      return false;
    }

    // Check if access token is still valid
    if (isTokenExpired(session.accessToken)) {
      console.log('[SessionManager] Stored session token expired');
      return false;
    }

    // Check session timeout (inactivity)
    const inactiveTime = Date.now() - this.lastActivity;
    const timeoutMs = this.config.sessionTimeout * 60 * 1000;
    if (inactiveTime > timeoutMs) {
      console.log('[SessionManager] Session timed out due to inactivity');
      return false;
    }

    return true;
  }

  private tryRestoreFromCookie(): void {
    try {
      const cookieToken = getCookie('admin_jwt');
      if (cookieToken) {
        const payload = getTokenPayload(cookieToken);
        if (payload && !isTokenExpired(cookieToken)) {
          // Create user object from token payload
          const user: AdminUser = {
            id: 0, // Will be updated when we get full user data
            email: payload.sub,
            name: payload.sub.split('@')[0], // Fallback name
            role: payload.role
          };

          this.setSession(user, cookieToken);
          console.log('[SessionManager] Session restored from cookie');
          return;
        }
      }
    } catch (error) {
      console.log('[SessionManager] Could not restore from cookie:', error);
    }

    this.clearSession();
  }  // Cross-tab synchronization
  private setupCrossTabSync(): void {
    console.log('[SessionManager] Setting up cross-tab synchronization');
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      console.log('[SessionManager] Storage event detected:', event.key, event.newValue, event.oldValue);
      
      if (event.key === 'enterprise_session') {
        this.handleCrossTabSessionChange(event);
      } else if (event.key && event.key.startsWith('admin_session_sync_')) {
        this.handleCrossTabSyncEvent(event);
      }
    });

    // Also listen for session changes via a custom event (for same-tab communication)
    window.addEventListener('admin_session_change', ((event: CustomEvent) => {
      console.log('[SessionManager] Custom session change event:', event.detail);
      this.handleCustomSessionEvent(event.detail);
    }) as EventListener);
  }

  private handleCrossTabSessionChange(event: StorageEvent): void {
    console.log('[SessionManager] Cross-tab session change detected:', {
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      currentSession: !!this.currentSession
    });
    
    if (event.newValue === null && this.currentSession) {
      // Session was cleared in another tab and we have a current session
      console.log('[SessionManager] Session cleared in another tab - logging out');
      this.currentSession = null;
      this.emit(SessionEvent.LOGOUT, { reason: 'cross_tab_logout' });
    } else if (event.newValue && !this.currentSession) {
      // Session was created in another tab and we don't have a session
      try {
        const newSession: SessionData = JSON.parse(event.newValue);
        console.log('[SessionManager] Session created in another tab - logging in');
        this.currentSession = newSession;
        this.lastActivity = Date.now();
        this.emit(SessionEvent.LOGIN, { user: newSession.user, restored: true, source: 'cross_tab' });
      } catch (error) {
        console.error('[SessionManager] Error parsing cross-tab session:', error);
      }
    } else if (event.newValue && this.currentSession) {
      // Session was updated in another tab - sync the changes
      try {
        const newSession: SessionData = JSON.parse(event.newValue);
        if (newSession.sessionId !== this.currentSession.sessionId || 
            newSession.accessToken !== this.currentSession.accessToken) {
          console.log('[SessionManager] Session updated in another tab - syncing');
          this.currentSession = newSession;
          this.lastActivity = Date.now();
          this.emit(SessionEvent.REFRESH, { source: 'cross_tab' });
        }
      } catch (error) {
        console.error('[SessionManager] Error parsing updated cross-tab session:', error);
      }
    }
  }

  private handleCrossTabSyncEvent(event: StorageEvent): void {
    if (!event.newValue) return;
    
    try {
      const syncData = JSON.parse(event.newValue);
      console.log('[SessionManager] Cross-tab sync event:', syncData);
      
      switch (syncData.type) {
        case 'login':
          if (syncData.session && !this.currentSession) {
            console.log('[SessionManager] Login sync from another tab');
            this.currentSession = syncData.session;
            this.lastActivity = Date.now();
            this.emit(SessionEvent.LOGIN, { user: syncData.session.user, restored: true, source: 'cross_tab' });
          }
          break;
        case 'refresh_success':
          // Another tab successfully refreshed the token
          if (syncData.session) {
            console.log('[SessionManager] Token refresh sync from another tab');
            this.currentSession = syncData.session;
            this.lastActivity = Date.now();
            sessionStorage.setItem('enterprise_session', JSON.stringify(syncData.session));
            this.emit(SessionEvent.REFRESH, { source: 'cross_tab' });
          }
          break;
        case 'logout':
          // Another tab logged out
          if (this.currentSession) {
            console.log('[SessionManager] Logout sync from another tab');
            this.currentSession = null;
            sessionStorage.removeItem('enterprise_session');
            this.emit(SessionEvent.LOGOUT, { reason: 'cross_tab_logout' });
          }
          break;
      }
    } catch (error) {
      console.error('[SessionManager] Error parsing cross-tab sync event:', error);
    }
  }

  private handleCustomSessionEvent(detail: any): void {
    console.log('[SessionManager] Custom session event:', detail);
    
    switch (detail.type) {
      case 'force_logout':
        if (this.currentSession) {
          console.log('[SessionManager] Force logout from custom event');
          this.currentSession = null;
          sessionStorage.removeItem('enterprise_session');
          this.emit(SessionEvent.LOGOUT, { reason: 'force_logout' });
        }
        break;
      case 'force_login':
        if (detail.session && !this.currentSession) {
          console.log('[SessionManager] Force login from custom event');
          this.currentSession = detail.session;
          this.lastActivity = Date.now();
          sessionStorage.setItem('enterprise_session', JSON.stringify(detail.session));
          this.emit(SessionEvent.LOGIN, { user: detail.session.user, restored: true, source: 'custom_event' });
        }
        break;
    }
  }
  private broadcastSessionChange(type: 'login' | 'logout' | 'refresh_success', data?: any): void {
    const syncData = {
      type,
      timestamp: Date.now(),
      session: this.currentSession,
      tabId: Date.now() + '_' + Math.random().toString(36).substr(2, 9), // Unique tab identifier
      ...data
    };
    
    console.log('[SessionManager] Broadcasting session change:', syncData);
    
    // Use localStorage for cross-tab communication (triggers storage events)
    const syncKey = `admin_session_sync_${syncData.timestamp}`;
    localStorage.setItem(syncKey, JSON.stringify(syncData));
    
    // Also dispatch a custom event for same-tab components
    window.dispatchEvent(new CustomEvent('admin_session_change', { detail: syncData }));
    
    // Clean up the sync key after a short delay
    setTimeout(() => {
      localStorage.removeItem(syncKey);
    }, 1000);
    
    // Also update the main session storage to ensure consistency
    if (type === 'login' && this.currentSession) {
      sessionStorage.setItem('enterprise_session', JSON.stringify(this.currentSession));
    } else if (type === 'logout') {
      sessionStorage.removeItem('enterprise_session');
    }
  }

  // Activity tracking
  private setupActivityTracking(): void {
    if (!this.config.enableActivityTracking) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const trackActivity = () => {
      this.lastActivity = Date.now();
      this.emit(SessionEvent.ACTIVITY, { timestamp: this.lastActivity });
    };

    events.forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true });
    });
  }

  // Session monitoring
  private startSessionMonitoring(): void {
    // Check session every 30 seconds
    setInterval(() => {
      if (this.currentSession) {
        this.checkSessionHealth();
      }
    }, 120000); // Check session every 2 minutes instead of 30 seconds
  }

  private checkSessionHealth(): void {
    if (!this.currentSession) return;

    const now = Date.now();
    
    // Check for inactivity timeout
    const inactiveTime = now - this.lastActivity;
    const timeoutMs = this.config.sessionTimeout * 60 * 1000;
    
    if (inactiveTime > timeoutMs) {
      console.log('[SessionManager] Session expired due to inactivity');
      this.emit(SessionEvent.EXPIRED, { reason: 'inactivity' });
      this.clearSession();
      return;
    }

    // Check if token needs refresh
    if (this.config.autoRefresh && this.shouldRefreshToken()) {
      this.refreshSession();
    }
  }

  private shouldRefreshToken(): boolean {
    if (!this.currentSession || this.isRefreshing) return false;
    
    return isTokenExpired(this.currentSession.accessToken, this.config.refreshThreshold);
  }

  // Session management
  async setSession(user: AdminUser, accessToken: string, refreshToken?: string): Promise<void> {
    try {
      const payload = getTokenPayload(accessToken);
      if (!payload) {
        throw new Error('Invalid access token');
      }

      const session: SessionData = {
        user,
        accessToken,
        refreshToken,
        expiresAt: payload.exp * 1000,
        issuedAt: payload.iat * 1000,
        sessionId: generateSessionId()
      };

      this.currentSession = session;
      this.lastActivity = Date.now();

      // Store in sessionStorage
      sessionStorage.setItem('enterprise_session', JSON.stringify(session));
      
      // Also store token in the expected locations for backward compatibility with admin services
      localStorage.setItem('authToken', accessToken);
      sessionStorage.setItem('adminToken', accessToken);

      // Schedule token refresh
      this.scheduleTokenRefresh();      this.emit(SessionEvent.LOGIN, { user, sessionId: session.sessionId });

      console.log('[SessionManager] Enterprise session established');
      console.log('[SessionManager] Session ID:', session.sessionId);
      console.log('[SessionManager] Expires at:', new Date(session.expiresAt));

      // Broadcast session change to other tabs
      this.broadcastSessionChange('login', { user, sessionId: session.sessionId });

    } catch (error) {
      console.error('[SessionManager] Error setting session:', error);
      this.emit(SessionEvent.ERROR, { action: 'setSession', error });
      throw error;
    }
  }

  private scheduleTokenRefresh(): void {
    if (!this.currentSession || !this.config.autoRefresh) return;

    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Calculate when to refresh (threshold minutes before expiry)
    const refreshTime = this.currentSession.expiresAt - (this.config.refreshThreshold * 60 * 1000);
    const delay = Math.max(0, refreshTime - Date.now());

    this.refreshTimer = setTimeout(() => {
      this.refreshSession();
    }, delay);

    console.log('[SessionManager] Token refresh scheduled in', Math.round(delay / 1000), 'seconds');
  }

  async refreshSession(): Promise<boolean> {
    if (this.isRefreshing) {
      // Return existing refresh promise if already refreshing
      return this.refreshPromise || Promise.resolve(false);
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<boolean> {
    if (!this.currentSession) return false;

    let attempts = 0;
    const maxRetries = this.config.maxRetries;

    while (attempts < maxRetries) {
      try {
        console.log(`[SessionManager] Attempting token refresh (${attempts + 1}/${maxRetries})`);

        const response = await fetch('/admin/api/admin/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${this.currentSession.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: this.currentSession.refreshToken,
            sessionId: this.currentSession.sessionId
          })
        });

        if (response.ok) {
          const data = await response.json();
          await this.setSession(this.currentSession.user, data.accessToken, data.refreshToken);
          
          this.emit(SessionEvent.REFRESH, { 
            sessionId: this.currentSession.sessionId,
            attempt: attempts + 1 
          });
          
          console.log('[SessionManager] Token refreshed successfully');

          // Broadcast refresh success to other tabs
          this.broadcastSessionChange('refresh_success');

          return true;
        }

        if (response.status === 401) {
          // Refresh token is invalid, need to re-login
          console.log('[SessionManager] Refresh token invalid, session expired');
          this.emit(SessionEvent.EXPIRED, { reason: 'refresh_failed' });
          this.clearSession();
          return false;
        }

        throw new Error(`Refresh failed with status ${response.status}`);

      } catch (error) {
        attempts++;
        console.error(`[SessionManager] Refresh attempt ${attempts} failed:`, error);
        
        if (attempts < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
      }
    }

    // All refresh attempts failed
    console.error('[SessionManager] All refresh attempts failed');
    this.emit(SessionEvent.ERROR, { action: 'refresh', attempts });
    this.emit(SessionEvent.EXPIRED, { reason: 'refresh_exhausted' });
    this.clearSession();
    return false;
  }
  clearSession(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }

    const sessionId = this.currentSession?.sessionId;
    this.currentSession = null;
    this.isRefreshing = false;
    this.refreshPromise = null;

    // Clear storage
    sessionStorage.removeItem('enterprise_session');
    
    // Also clear the compatibility token storage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('adminToken');

    this.emit(SessionEvent.LOGOUT, { sessionId });
    console.log('[SessionManager] Session cleared');

    // Broadcast logout to other tabs
    this.broadcastSessionChange('logout', { sessionId });
  }

  // Getters
  getSession(): SessionData | null {
    return this.currentSession;
  }

  getUser(): AdminUser | null {
    return this.currentSession?.user || null;
  }

  getAccessToken(): string | null {
    return this.currentSession?.accessToken || null;
  }

  isAuthenticated(): boolean {
    if (!this.currentSession) return false;
    
    // Check if token is still valid
    if (isTokenExpired(this.currentSession.accessToken)) {
      return false;
    }

    // Check activity timeout
    const inactiveTime = Date.now() - this.lastActivity;
    const timeoutMs = this.config.sessionTimeout * 60 * 1000;
    
    return inactiveTime <= timeoutMs;
  }

  getSessionInfo() {
    if (!this.currentSession) return null;

    const now = Date.now();
    const timeUntilExpiry = this.currentSession.expiresAt - now;
    const timeSinceActivity = now - this.lastActivity;

    return {
      sessionId: this.currentSession.sessionId,
      user: this.currentSession.user,
      issuedAt: new Date(this.currentSession.issuedAt),
      expiresAt: new Date(this.currentSession.expiresAt),
      timeUntilExpiry: Math.round(timeUntilExpiry / 1000),
      timeSinceActivity: Math.round(timeSinceActivity / 1000),
      isRefreshing: this.isRefreshing
    };
  }

  // Configuration
  updateConfig(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('[SessionManager] Configuration updated:', this.config);
  }

  // Cleanup
  destroy(): void {
    this.clearSession();
    this.eventHandlers.clear();
    console.log('[SessionManager] Session manager destroyed');
  }
}

// Export singleton instance
export const enterpriseSessionManager = EnterpriseSessionManager.getInstance();

// Export convenience functions
export const setAdminSession = (user: AdminUser, accessToken: string, refreshToken?: string) => 
  enterpriseSessionManager.setSession(user, accessToken, refreshToken);

export const clearAdminSession = () => enterpriseSessionManager.clearSession();
export const getAdminSession = () => enterpriseSessionManager.getSession();
export const getAdminUser = () => enterpriseSessionManager.getUser();
export const getAdminToken = () => enterpriseSessionManager.getAccessToken();
export const isAdminAuthenticated = () => enterpriseSessionManager.isAuthenticated();
export const refreshAdminSession = () => enterpriseSessionManager.refreshSession();
export const getSessionInfo = () => enterpriseSessionManager.getSessionInfo();
