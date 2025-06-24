import { BASE_URL } from '../config';

export const logout = async () => {
  try {
    // Call logout endpoint to clear server-side session/cookie
    await fetch(`${BASE_URL}/admin/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    // Always clear local storage regardless of server response
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    
    // Redirect to login
    window.location.href = '/admin-login';
  }
};
