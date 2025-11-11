import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../lib/supabase';

export interface Statistics {
  total_donations: number;
  total_muzakki: number;
  total_distributed: number;
  donations_by_category: {
    zakat: number;
    infaq: number;
    sedekah: number;
    wakaf: number;
  };
  monthly_target: number;
  monthly_progress: number;
  muzakki_target: number;
  muzakki_progress: number;
  recent_activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'donation' | 'follow-up' | 'distribution';
  title: string;
  amount?: number;
  time: Date;
  muzakki_name?: string;
  category?: string;
}

export function useStatistics(relawanId: string | null) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!relawanId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching statistics for relawan:', relawanId);
      const response = await apiCall(`/statistics/${relawanId}`);
      console.log('✅ Statistics fetched:', response.data);
      
      // Convert activity times to Date objects
      if (response.data && response.data.recent_activities) {
        response.data.recent_activities = response.data.recent_activities.map((activity: any) => ({
          ...activity,
          time: new Date(activity.time)
        }));
      }
      
      setStatistics(response.data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat statistik';
      setError(errorMessage);
      console.error('❌ Error fetching statistics:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [relawanId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  };
}
