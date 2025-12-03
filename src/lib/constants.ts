const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Log warning in development if API_BASE_URL is not set
if (import.meta.env.DEV && !API_BASE_URL) {
  console.warn(
    '⚠️ VITE_API_BASE_URL is not set. API requests will fail. ' +
    'Please add VITE_API_BASE_URL to your .env file and restart the dev server.'
  );
}

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/v1/login',
  },
  USERS: {
    ME: '/users/v1/me',
  },
  BUYERS: {
    SEARCH: '/buyer/v2/account/search',
  },
  DOCUMENTS: {
    SSRM_SEARCH: '/document/v2/ssrm/search',
  },
  ENTITY: {
    CATALOG_LIST: '/entity/v2/product/catalog_list',
    COLLECTION_SEARCH: '/entity/v3/collection/search',
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  // If no base URL is set, throw a helpful error
  if (!API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL is not set in environment variables. ' +
      'Please add it to your .env file and restart the dev server.'
    );
  }
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};

