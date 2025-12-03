import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cookieUtils } from '@/lib/cookies';
import { userStorage } from '@/lib/userStorage';

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isTenantSelectionRequired: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setAuth: (token: string, refreshToken: string, isTenantSelectionRequired: boolean) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

// Initial state from cookies if available
const getInitialState = (): AuthState => {
  const token = cookieUtils.getToken() || null;
  const refreshToken = cookieUtils.getRefreshToken() || null;
  
  return {
    token,
    refreshToken,
    isAuthenticated: !!(token && refreshToken),
    isTenantSelectionRequired: false,
    isLoading: false,
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setAuth: (token: string, refreshToken: string, isTenantSelectionRequired: boolean) => {
        // Store in cookies (source of truth for API)
        cookieUtils.setToken(token);
        cookieUtils.setRefreshToken(refreshToken);
        
        // Update store
        set({
          token,
          refreshToken,
          isAuthenticated: true,
          isTenantSelectionRequired,
          isLoading: false,
        });
      },

      clearAuth: () => {
        // Remove from cookies
        cookieUtils.removeTokens();
        
        // Remove user details from localStorage
        userStorage.removeUserDetails();
        
        // Clear catalog store
        if (typeof window !== 'undefined') {
          localStorage.removeItem('catalog-storage');
        }
        
        // Clear store
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isTenantSelectionRequired: false,
          isLoading: false,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isTenantSelectionRequired: state.isTenantSelectionRequired,
      }),
      // On rehydration, sync with cookies (cookies are source of truth)
      onRehydrateStorage: () => (state) => {
        if (state) {
          const cookieToken = cookieUtils.getToken();
          const cookieRefreshToken = cookieUtils.getRefreshToken();
          
          // If cookies exist, use them; otherwise clear if cookies are missing
          if (cookieToken && cookieRefreshToken) {
            state.token = cookieToken;
            state.refreshToken = cookieRefreshToken;
            state.isAuthenticated = true;
          } else if (!cookieToken || !cookieRefreshToken) {
            // Cookies are missing, clear everything
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isTenantSelectionRequired = false;
          }
        }
      },
    }
  )
);

