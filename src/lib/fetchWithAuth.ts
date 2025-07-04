// Utility to make authenticated requests with JWT (supports both cookies and Authorization header)
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  console.log('[fetchWithAuth] Making request to:', url);
  
  // Get token from multiple sources for compatibility
  let token = sessionStorage.getItem('adminToken') || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  // Try to get token from enterprise session if not found
  if (!token) {
    try {
      const enterpriseSession = sessionStorage.getItem('enterprise_session');
      if (enterpriseSession) {
        const session = JSON.parse(enterpriseSession);
        token = session.accessToken;
      }
    } catch (error) {
      console.log('[fetchWithAuth] Error parsing enterprise session:', error);
    }
  }
  
  // Try to get token from admin_jwt cookie as fallback
  if (!token) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; admin_jwt=`);
    if (parts.length === 2) {
      token = parts.pop()!.split(';').shift() || null;
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[fetchWithAuth] Added Authorization header with token from:', 
      sessionStorage.getItem('adminToken') ? 'adminToken' :
      localStorage.getItem('authToken') ? 'authToken' :
      sessionStorage.getItem('enterprise_session') ? 'enterprise_session' : 'cookie');
  }
  
  // Use credentials: 'include' to send HttpOnly cookies (for local dev)
  const requestOptions = {
    ...options,
    headers,
    credentials: 'include' as RequestCredentials,
  };
  
  console.log('[fetchWithAuth] Request options:', requestOptions);
  
  return fetch(url, requestOptions);
}
