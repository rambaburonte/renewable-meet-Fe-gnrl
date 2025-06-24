// Utility to make authenticated requests with JWT (supports both cookies and Authorization header)
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  console.log('[fetchWithAuth] Making request to:', url);
  
  // Get token from sessionStorage (for production deployment)
  const token = sessionStorage.getItem('adminToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  // Add Authorization header if token exists (for production)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[fetchWithAuth] Added Authorization header');
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
