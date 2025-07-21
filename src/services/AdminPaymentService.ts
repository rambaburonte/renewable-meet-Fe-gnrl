
import { PAYMENT_API_URL } from '../config';

// Admin Payment API Service
export class AdminPaymentService {

  // Per-vertical endpoints (no website param, use path)
  static async getAllPaymentsOptics(): Promise<any> {
    const token = this.getAuthToken();
    const url = `${this.API_BASE}/all/optics`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
  }

  static async getAllPaymentsRenewable(): Promise<any> {
    const token = this.getAuthToken();
    const url = `${this.API_BASE}/all/renewable`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
  }

  static async getAllPaymentsNursing(): Promise<any> {
    const token = this.getAuthToken();
    const url = `${this.API_BASE}/all/nursing`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
  }

  static async getPaymentByIdOptics(id: number): Promise<any> {
    const token = this.getAuthToken();
    const url = `${this.API_BASE}/session/optics/${id}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
  }

  static async getPaymentByIdRenewable(id: number): Promise<any> {
    const token = this.getAuthToken();
    const url = `${this.API_BASE}/session/renewable/${id}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
  }

  static async getPaymentByIdNursing(id: number): Promise<any> {
    const token = this.getAuthToken();
    const url = `${this.API_BASE}/session/nursing/${id}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
  }
  private static readonly API_BASE = `${PAYMENT_API_URL}/api/payments`;

  private static getAuthToken(): string | null {
    // First try the standard token storage locations
    let token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      // Try to get token from enterprise session
      try {
        const enterpriseSession = sessionStorage.getItem('enterprise_session');
        if (enterpriseSession) {
          const session = JSON.parse(enterpriseSession);
          token = session.accessToken;
        }
      } catch (error) {
        // Removed console.log('[AdminPaymentService] Error parsing enterprise session:', error);
      }
    }
    
    if (!token) {
      // Try to get token from admin_jwt cookie as fallback
      const value = `; ${document.cookie}`;
      const parts = value.split(`; admin_jwt=`);
      if (parts.length === 2) {
        token = parts.pop()!.split(';').shift() || null;
      }
    }
    
    return token;
  }

  private static async apiCall(endpoint: string, options: RequestInit = {}, website?: string): Promise<any> {
    const token = this.getAuthToken();
    if (!website) throw new Error('Website/vertical is required for payment API calls');
    // Insert website as a path segment: /api/payments/{website}/...
    let url = `${PAYMENT_API_URL}/api/payments/${website}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // Get all payments
  static async getAllPayments(website: string): Promise<any> {
    return this.apiCall('/all', {}, website);
  }

  // Get payment statistics
  static async getPaymentStats(website: string): Promise<any> {
    return this.apiCall('/statistics', {}, website);
  }

  // Get payments by status
  static async getPaymentsByStatus(status: string, website: string): Promise<any> {
    return this.apiCall(`/status/${status}`, {}, website);
  }

  // Search by customer email
  static async searchByEmail(email: string, website: string): Promise<any> {
    return this.apiCall(`/customer/${encodeURIComponent(email)}`, {}, website);
  }

  // Search by session ID
  static async searchBySession(sessionId: string, website: string): Promise<any> {
    return this.apiCall(`/session/${sessionId}`, {}, website);
  }

  // Get expired payments
  static async getExpiredPayments(website: string): Promise<any> {
    return this.apiCall('/expired', {}, website);
  }

  // Expire stale payments
  static async expireStalePayments(website: string): Promise<any> {
    return this.apiCall('/expire-stale', { method: 'GET' }, website);
  }

  // Get recent payments
  static async getRecentPayments(website: string): Promise<any> {
    return this.apiCall('/recent', {}, website);
  }

  // Get payment by ID
  static async getPaymentById(id: number, website: string): Promise<any> {
    return this.apiCall(`/${id}`, {}, website);
  }

  // Get completed payments with registrations
  static async getCompletedPaymentsWithRegistrations(website: string): Promise<any> {
    return this.apiCall('/completed-with-registrations', {}, website);
  }

  // Test admin authentication
  static async testAdminAuth(website: string): Promise<any> {
    return this.apiCall('/admin/test', {}, website);
  }

  // Health check
  static async healthCheck(website: string): Promise<any> {
    return this.apiCall('/admin/health', {}, website);
  }
}

export default AdminPaymentService;
