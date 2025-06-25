// Enterprise session debugging utility
import { enterpriseSessionManager, getSessionInfo } from './enterpriseSessionManager';

export const debugSession = () => {
  const session = enterpriseSessionManager.getSession();
  const isAuth = enterpriseSessionManager.isAuthenticated();
  const sessionInfo = getSessionInfo();

  console.log('=== ENTERPRISE SESSION DEBUG ===');
  console.log('Session exists:', !!session);
  console.log('Is authenticated:', isAuth);
  
  if (session) {
    console.log('Session ID:', session.sessionId);
    console.log('User:', session.user);
    console.log('Access token exists:', !!session.accessToken);
    console.log('Refresh token exists:', !!session.refreshToken);
    console.log('Issued at:', new Date(session.issuedAt));
    console.log('Expires at:', new Date(session.expiresAt));
  }
  
  if (sessionInfo) {
    console.log('Time until expiry:', sessionInfo.timeUntilExpiry, 'seconds');
    console.log('Time since activity:', sessionInfo.timeSinceActivity, 'seconds');
    console.log('Is refreshing:', sessionInfo.isRefreshing);
  }
  
  console.log('SessionStorage enterprise_session:', 
    !!sessionStorage.getItem('enterprise_session'));
  console.log('Cookie admin_jwt:', !!document.cookie.includes('admin_jwt'));
  console.log('================================');

  return {
    session,
    isAuthenticated: isAuth,
    sessionInfo,
    storage: {
      enterprise_session: !!sessionStorage.getItem('enterprise_session'),
      admin_jwt_cookie: document.cookie.includes('admin_jwt')
    }
  };
};

// Export enterprise session manager for direct access
export const debugSessionManager = () => {
  console.log('=== SESSION MANAGER DEBUG ===');
  console.log('Current session:', enterpriseSessionManager.getSession());
  console.log('Is authenticated:', enterpriseSessionManager.isAuthenticated());
  console.log('Session info:', getSessionInfo());
  console.log('=============================');
  return enterpriseSessionManager;
};

// Call these functions in browser console to debug session issues
(window as any).debugSession = debugSession;
(window as any).debugSessionManager = debugSessionManager;
(window as any).enterpriseSessionManager = enterpriseSessionManager;
