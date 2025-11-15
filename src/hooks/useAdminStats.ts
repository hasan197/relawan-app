import { useState, useEffect } from 'react';
import { apiCall } from '../lib/supabase';

interface GlobalStats {
  total_donations: number;
  total_muzakki: number;
  total_relawan: number;
  total_regu: number;
  by_category: {
    zakat: number;
    infaq: number;
    sedekah: number;
    wakaf: number;
  };
}

interface ReguStats {
  id: string;
  name: string;
  pembimbing_name: string;
  total_donations: number;
  total_muzakki: number;
  member_count: number;
  target: number;
}

export function useAdminStats() {
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    total_donations: 0,
    total_muzakki: 0,
    total_relawan: 0,
    total_regu: 0,
    by_category: {
      zakat: 0,
      infaq: 0,
      sedekah: 0,
      wakaf: 0
    }
  });
  const [reguStats, setReguStats] = useState<ReguStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      console.log('🔄 Fetching admin statistics...');
      setLoading(true);
      setError(null);

      // Fetch global stats
      const globalResponse = await apiCall('/admin/stats/global');
      console.log('✅ Global stats fetched:', globalResponse.data);
      
      // Fetch regu stats
      const reguResponse = await apiCall('/admin/stats/regu');
      console.log('✅ Regu stats fetched:', reguResponse.data?.length || 0, 'regus');

      setGlobalStats(globalResponse.data || {
        total_donations: 0,
        total_muzakki: 0,
        total_relawan: 0,
        total_regu: 0,
        by_category: { zakat: 0, infaq: 0, sedekah: 0, wakaf: 0 }
      });
      
      setReguStats(reguResponse.data || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat statistik admin';
      setError(errorMessage);
      console.error('❌ Error fetching admin stats:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    globalStats,
    reguStats,
    loading,
    error,
    refetch: fetchStats
  };
}
