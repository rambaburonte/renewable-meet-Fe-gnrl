import { BASE_URL } from '../config';

export class AdminApiService {
  private static readonly API_BASE = `${BASE_URL}/admin`;

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
        console.error('[AdminApiService] Error parsing enterprise session:', error);
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
    const url = `${this.API_BASE}${endpoint}`;
    
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

  // Session Options API
  static async insertSession(sessionOption: string, website: string): Promise<any> {
    return this.apiCall(`/sessions/${website}`, {
      method: 'POST',
      body: JSON.stringify({ sessionOption }),
    });
  }

  static async getAllSessionOptions(website: string): Promise<any> {
    return this.apiCall(`/api/admin/session-options/${website}`);
  }

  static async editSession(id: number, newSessionName: string, website: string): Promise<any> {
    return this.apiCall(`/sessions/${website}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ sessionName: newSessionName }),
    });
  }

  static async deleteSession(id: number, website: string): Promise<any> {
    return this.apiCall(`/sessions/${website}/${id}`, {
      method: 'DELETE',
    });
  }

  // Interested-In Options API
  static async insertInterestedInOption(interestedInOption: string, website: string): Promise<any> {
    return this.apiCall(`/interested-in/${website}`, {
      method: 'POST',
      body: JSON.stringify({ interestedInOption }),
    });
  }

  static async getAllInterestedInOptions(website: string): Promise<any> {
    return this.apiCall(`/api/admin/interested-in/${website}`);
  }

  static async editInterestedInOption(id: number, newOption: string, website: string): Promise<any> {
    return this.apiCall(`/interested-in/${website}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ option: newOption }),
    });
  }

  static async deleteInterestedInOption(id: number, website: string): Promise<any> {
    return this.apiCall(`/interested-in/${website}/${id}`, {
      method: 'DELETE',
    });
  }

  // Accommodation API
  static async insertAccommodation(accommodation: any, website: string): Promise<any> {
    return this.apiCall(`/api/admin/accommodation/${website}`, {
      method: 'POST',
      body: JSON.stringify(accommodation),
    });
  }

  static async editAccommodation(id: number, accommodation: any, website: string): Promise<any> {
    return this.apiCall(`/api/admin/accommodation/edit/${website}/${id}`, {
      method: 'POST',
      body: JSON.stringify(accommodation),
    });
  }

  static async deleteAccommodation(id: number, website: string): Promise<any> {
    return this.apiCall(`/api/admin/accommodation/delete/${website}/${id}`, {
      method: 'POST',
    });
  }

  // Pricing Config API
  static async insertPricingConfig(config: any, website: string): Promise<any> {
    return this.apiCall(`/api/admin/pricing-config/${website}`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  static async getPricingConfigDetails(id: number, website: string): Promise<any> {
    return this.apiCall(`/api/admin/pricing-config/details/${website}/${id}`, {
      method: 'POST',
    });
  }

  // Registration Forms API
  static async getAllRegistrationForms(website: string): Promise<any> {
    return this.apiCall(`/api/admin/registration-forms/${website}`, {
      method: 'POST',
    });
  }

  // Abstract Submissions API
  static async getAllAbstractSubmissions(website: string): Promise<any> {
    return this.apiCall(`/api/admin/abstract-submissions/${website}`);
  }

  // Discounts API
  static async getAllDiscounts(website: string): Promise<any> {
    return this.apiCall(`/api/admin/discounts/${website}`);
  }

  // Admin Authentication API
  static async login(email: string, password: string): Promise<any> {
    return this.apiCall('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async logout(): Promise<any> {
    return this.apiCall('/api/admin/logout', {
      method: 'POST',
    });
  }

  // Health check
  static async healthCheck(): Promise<any> {
    return this.apiCall('/api/admin/health');
  }
}

export default AdminApiService;
