// src/lib/api.tsx
import axios, { InternalAxiosRequestConfig } from "axios";
import { baseApi, geckoApi } from "@/constants/api";
import {
  SIWE_ADDRESS,
  SIWE_CHAIN_ID,
  SIWE_SESSION_ID,
} from "@/constants/storage";

// Declare module augmentation to add our custom properties to Axios types
declare module "axios" {
  interface InternalAxiosRequestConfig {
    requireAuth?: boolean;
    skipSessionId?: boolean;
    address?: string;
    chainId?: number;
  }
}

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: baseApi,
});

// List of endpoints or base URLs that don't require authentication
const publicEndpoints = [
  "/siwe/nonce", // SIWE nonce endpoint is always public
  geckoApi, // All external APIs like CoinGecko are public
];

// Helper to check if a URL is public
const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return publicEndpoints.some((endpoint) => url.includes(endpoint));
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get URL for checking public endpoints
    const url = config.url || "";
    const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url;

    // Determine if authentication is required
    const skipAuth = Boolean(config.skipSessionId) || isPublicEndpoint(fullUrl);
    const requireAuth =
      config.requireAuth !== undefined ? config.requireAuth : !skipAuth;

    // Get sessionId from Zustand store
    const sessionId = localStorage.getItem(SIWE_SESSION_ID);
    const chainId = Number(localStorage.getItem(SIWE_CHAIN_ID));
    const address = localStorage.getItem(SIWE_ADDRESS);

    // If auth is required but we have no session, reject the request
    if (requireAuth && !sessionId && !address && !chainId) {
      return Promise.reject(
        new Error("Authentication required but no session found")
      );
    }

    // Add sessionId, address, and chainId to request data if auth is required
    if (requireAuth && sessionId) {
      if (config.data) {
        config.data = {
          ...config.data,
          sessionId,
          address,
          chainId,
        };
      } else if (config.data === undefined) {
        config.data = {
          sessionId,
          address,
          chainId,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// TODO: implement error handle
// // Response interceptor to handle auth errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Check if error is due to authentication issues
//     if (
//       error.message ===
//       "Authentication required for this request but no sessionId available"
//     ) {
//       // You could trigger a login prompt or redirect here
//       // console.error('Authentication required. Please log in.');
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
