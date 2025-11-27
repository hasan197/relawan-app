/**
 * Backend Configuration
 * 
 * This file determines which backend provider to use for the application.
 * Switch between 'supabase' and 'convex' by changing the VITE_BACKEND_PROVIDER
 * environment variable.
 */

export type BackendProvider = 'supabase' | 'convex';

/**
 * Get the active backend provider from environment variable
 * Defaults to 'convex' for production to ensure data access
 */
export const BACKEND_PROVIDER: BackendProvider =
    (import.meta.env.VITE_BACKEND_PROVIDER as BackendProvider) || 
    (import.meta.env.PROD ? 'convex' : 'supabase');

/**
 * Check if Convex is the active backend
 */
export const isConvexBackend = (): boolean => BACKEND_PROVIDER === 'convex';

/**
 * Check if Supabase is the active backend
 */
export const isSupabaseBackend = (): boolean => BACKEND_PROVIDER === 'supabase';

/**
 * Log current backend configuration
 */
if (typeof window !== 'undefined') {
    console.log('🔧 Backend Provider:', BACKEND_PROVIDER);
    console.log('🔧 VITE_BACKEND_PROVIDER:', import.meta.env.VITE_BACKEND_PROVIDER);
    console.log('🔧 VITE_CONVEX_URL:', import.meta.env.VITE_CONVEX_URL);
}
