type BackendType = 'supabase' | 'convex';

// Define the type for import.meta.env
declare global {
  interface ImportMetaEnv {
    VITE_BACKEND?: string;
  }
}

// Default to supabase for backward compatibility
export const CURRENT_BACKEND: BackendType = (import.meta.env.VITE_BACKEND as BackendType) || 'supabase';
