import { getApiUrl, ENDPOINTS } from './constants';
import { useAuthStore } from '@/store/authStore';
import type { BuyerSearchRequest, BuyerSearchResponse } from './types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  is_tenant_selection_required: boolean;
}

interface UserDetails {
  [key: string]: unknown; // User data structure will depend on your API response
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { token } = useAuthStore.getState();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `API Error: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

const apiClient = {
  request,
  
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getCurrentUser(): Promise<UserDetails> {
    return request<UserDetails>(ENDPOINTS.USERS.ME, {
      method: 'GET',
    });
  },

  async searchBuyers(payload: BuyerSearchRequest): Promise<BuyerSearchResponse> {
    return request<BuyerSearchResponse>(ENDPOINTS.BUYERS.SEARCH, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export { apiClient, ApiError };
export type { 
  LoginRequest, 
  LoginResponse, 
  UserDetails,
};

