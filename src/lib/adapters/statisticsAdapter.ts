import { apiCall } from '../supabase';
import { BACKEND_PROVIDER } from '../backendConfig';
import { Statistics } from '../../hooks/useStatistics';

/**
 * Statistics Adapter
 * 
 * Routes statistics requests to the appropriate backend (Supabase or Convex)
 * based on the BACKEND_PROVIDER configuration.
 */

/**
 * Fetch statistics for a relawan from Supabase backend
 */
async function fetchStatisticsFromSupabase(relawanId: string): Promise<Statistics> {
    console.log('📊 Fetching statistics from Supabase for:', relawanId);
    const response = await apiCall(`/statistics/${relawanId}`);
    return response.data;
}

/**
 * Fetch statistics for a relawan from Convex backend
 */
async function fetchStatisticsFromConvex(relawanId: string): Promise<Statistics> {
    console.log('📊 Fetching statistics from Convex for:', relawanId);

    // Dynamically import Convex client to avoid loading it when using Supabase
    const { ConvexHttpClient } = await import('convex/browser');
    const { api } = await import('../../convex/_generated/api');

    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
        throw new Error('VITE_CONVEX_URL is not configured');
    }

    const client = new ConvexHttpClient(convexUrl);

    try {
        const result = await client.query(api.statistics.getRelawanStatistics, {
            relawanId: relawanId as any, // Convex ID type
        });

        return result as Statistics;
    } catch (error) {
        console.error('❌ Error fetching from Convex:', error);
        throw error;
    }
}

/**
 * Fetch statistics for a relawan
 * Automatically routes to the correct backend based on configuration
 */
export async function fetchStatistics(relawanId: string): Promise<Statistics> {
    if (BACKEND_PROVIDER === 'convex') {
        return fetchStatisticsFromConvex(relawanId);
    } else {
        return fetchStatisticsFromSupabase(relawanId);
    }
}
