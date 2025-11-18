import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { convexClient } from './convex-adapter';
import { CURRENT_BACKEND } from '../config/backend';

// Create the original Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Server URL for API calls
export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f`;

// Export the appropriate client based on the backend type
export const db = CURRENT_BACKEND === 'convex' ? convexClient : supabase;
export const auth = CURRENT_BACKEND === 'convex' ? convexClient.auth : supabase.auth;

// Helper function to make authenticated API calls
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  // If using Convex, route API calls through the Convex adapter
  if (CURRENT_BACKEND === 'convex') {
    try {
      const method = options.method || 'GET';
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'An error occurred';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please check your connection.');
      }
      throw error;
    }
  }

  // Original Supabase API call logic
  const method = options.method || 'GET';
  const isReadOnly = method === 'GET';
  const token = publicAnonKey;
  
  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || data.message || 'An error occurred';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check your connection.');
    }
    throw error;
  }
}

// Export the original supabase client for direct access if needed
export { supabase };
