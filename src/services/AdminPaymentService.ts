import { PAYMENT_API_URL } from '../config';

// Admin Payment API Service
export class AdminPaymentService {
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

  private static async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.getAuthToken();
    const response = await fetch(`${this.API_BASE}${endpoint}`, {
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

  // Get all payments - Fixed to match backend endpoint
  static async getAllPayments(): Promise<any> {
    return this.apiCall('/all');
  }

  // Get payment statistics - Fixed to match backend endpoint
  static async getPaymentStats(): Promise<any> {
    return this.apiCall('/statistics');
  }

  // Get payments by status
  static async getPaymentsByStatus(status: string): Promise<any> {
    return this.apiCall(`/status/${status}`);
  }

  // Search by customer email
  static async searchByEmail(email: string): Promise<any> {
    return this.apiCall(`/customer/${encodeURIComponent(email)}`);
  }

  // Search by session ID
  static async searchBySession(sessionId: string): Promise<any> {
    return this.apiCall(`/session/${sessionId}`);
  }

  // Get expired payments
  static async getExpiredPayments(): Promise<any> {
    return this.apiCall('/expired');
  }

  // Expire stale payments - Fixed HTTP method
  static async expireStalePayments(): Promise<any> {
    return this.apiCall('/expire-stale', { method: 'GET' });
  }

  // Get recent payments - Fixed to match backend endpoint
  static async getRecentPayments(): Promise<any> {
    return this.apiCall('/recent');
  }

  // Get payment dashboard data - Removed (not implemented in backend)
  // static async getDashboardData(): Promise<any> {
  //   return this.apiCall('/admin/dashboard');
  // }

  // Get payment by ID - Added to match backend endpoint
  static async getPaymentById(id: number): Promise<any> {
    return this.apiCall(`/${id}`);
  }

  // Get completed payments with registrations - Added to match backend endpoint
  static async getCompletedPaymentsWithRegistrations(): Promise<any> {
    return this.apiCall('/completed-with-registrations');
  }

  // Test admin authentication
  static async testAdminAuth(): Promise<any> {
    return this.apiCall('/admin/test');
  }

  // Health check
  static async healthCheck(): Promise<any> {
    return this.apiCall('/admin/health');
  }
}

export default AdminPaymentService;
