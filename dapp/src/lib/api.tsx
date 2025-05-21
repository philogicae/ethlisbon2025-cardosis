// src/lib/api.tsx
import axios, { InternalAxiosRequestConfig } from "axios";
import { useAppStore } from "@/stores/useAppStore";
import { baseApi, geckoApi } from "@/constants/api";

// Declare module augmentation to add our custom properties to Axios types
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    requireAuth?: boolean;
    skipSessionId?: boolean;
  }
}

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: baseApi,
});

// List of endpoints or base URLs that don't require authentication
const publicEndpoints = [
  '/siwe/nonce', // SIWE nonce endpoint is always public
  geckoApi, // All external APIs like CoinGecko are public
];

// Helper to check if a URL is public
const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return publicEndpoints.some(endpoint => url.includes(endpoint));
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get URL for checking public endpoints
    const url = config.url || '';
    const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url;
    
    // Determine if authentication is required
    const skipAuth = Boolean(config.skipSessionId) || isPublicEndpoint(fullUrl);
    const requireAuth = config.requireAuth !== undefined ? config.requireAuth : !skipAuth;
    
    // Get sessionId from Zustand store
    const sessionId = useAppStore.getState().sessionId;

    // If auth is required but we have no session, reject the request
    if (requireAuth && !sessionId) {
      return Promise.reject(new Error('Authentication required for this request but no sessionId available'));
    }

    // If we have a session ID and we're not explicitly skipping it, add it to the request
    if (sessionId && !skipAuth) {
      // For query params (GET requests)
      config.params = {
        ...config.params,
        sessionId,
      };

      // For request body (POST, PUT, etc)
      if (config.data && typeof config.data === "object") {
        config.data = {
          ...config.data,
          sessionId,
        };
      } else if (config.data === undefined) {
        config.data = { sessionId };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to authentication issues
    if (error.message === 'Authentication required for this request but no sessionId available') {
      // You could trigger a login prompt or redirect here
      console.error('Authentication required. Please log in.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
