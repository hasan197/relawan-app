import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { BACKEND_PROVIDER } from './backendConfig';
import { routeToConvex } from './convexRouter';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Server URL for API calls
export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f`;

// Helper function to make authenticated API calls
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  // Try to get token from localStorage
  const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;

  // Use stored token if available, otherwise fall back to publicAnonKey
  const token = storedToken || publicAnonKey;

  // Prepare headers with Authorization
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  // Update options with headers
  const updatedOptions = {
    ...options,
    headers,
  };

  // Route to Convex if configured
  if (BACKEND_PROVIDER === 'convex') {
    console.log(`🔀 Backend: Convex (${endpoint})`);
    return routeToConvex(endpoint, updatedOptions);
  }

  // Otherwise, use Supabase Edge Functions (default)
  console.log(`🔀 Backend: Supabase (${endpoint})`);

  // For GET requests (read-only), use publicAnonKey
  // For POST/PUT/DELETE, use user's access token
  const method = options.method || 'GET';
  const isReadOnly = method === 'GET';

  console.log(`📡 API Call: ${method} ${endpoint}`, {
    isReadOnly,
    usingPublicKey: !storedToken,
    hasAuthToken: !!storedToken
  });

  try {
    // Handle FormData - don't set Content-Type for FormData
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      ...updatedOptions,
      headers: {
        ...headers,
        // Only set Content-Type for non-FormData requests
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || data.message || 'Terjadi kesalahan';
      console.error(`❌ API Error [${response.status}]:`, {
        endpoint,
        status: response.status,
        error: errorMessage,
        fullResponse: data
      });
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    // If it's a network error (not JSON response)
    if (error.message === 'Failed to fetch') {
      console.error('❌ Network Error:', {
        endpoint,
        message: 'Cannot connect to server. Please check your connection.'
      });
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    }

    // Re-throw the error with context
    console.error('❌ API Call Failed:', {
      endpoint,
      error: error.message
    });
    throw error;
  }
}