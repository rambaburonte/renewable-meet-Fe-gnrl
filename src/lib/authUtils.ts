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
};
