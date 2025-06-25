// Authentication utility functions
import { enterpriseSessionManager } from './enterpriseSessionManager';

export const isAdmin = (): boolean => {
  return enterpriseSessionManager.isAuthenticated();
};

export const getAdminUser = () => {
  return enterpriseSessionManager.getUser();
};

export const clearAdminSession = () => {
  enterpriseSessionManager.clearSession();
};

export const getAdminToken = (): string | null => {
  return enterpriseSessionManager.getAccessToken();
};

export const isAuthenticated = (): boolean => {
  return enterpriseSessionManager.isAuthenticated();
};

export const checkAndCleanExpiredSession = (): boolean => {
  return enterpriseSessionManager.isAuthenticated();
};
