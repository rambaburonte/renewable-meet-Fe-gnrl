// Authentication utility functions

export const isAdmin = (): boolean => {
  try {
    const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{}');
    return adminUser && adminUser.role === 'ADMIN';
  } catch {
    return false;
  }
};

export const getAdminUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem('adminUser') || '{}');
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  sessionStorage.removeItem('adminUser');
  sessionStorage.removeItem('adminToken');
};

export const getAdminToken = (): string | null => {
  return sessionStorage.getItem('adminToken');
};

export const isAuthenticated = (): boolean => {
  const adminUser = getAdminUser();
  const token = getAdminToken();
  return (adminUser && adminUser.role === 'ADMIN') || !!token;
};
