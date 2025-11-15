import { useState, useEffect } from 'react';
import { apiCall } from '../lib/supabase';

interface Donation {
  id: string;
  relawan_id: string;
  muzakki_id: string | null;
  amount: number;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
  type: 'incoming' | 'outgoing';
  receipt_number: string;
  notes: string;
  created_at: string;
}

export function useDonations(relawanId: string | null) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    if (!relawanId) {
      console.log('⏭️ Skipping fetchDonations: No relawan ID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching donations for relawan:', relawanId);
      setLoading(true);
      const response = await apiCall(`/donations?relawan_id=${relawanId}`);
      console.log('✅ Donations fetched:', response.data?.length || 0, 'items');
      setDonations(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data donasi';
      setError(errorMessage);
      console.error('❌ Error fetching donations:', {
        relawanId,
        error: errorMessage,
        fullError: err
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [relawanId]);

  const addDonation = async (data: {
    muzakki_id?: string;
    amount: number;
    category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
    type?: 'incoming' | 'outgoing';
    receipt_number?: string;
    notes?: string;
  }) => {
    if (!relawanId) throw new Error('Relawan ID tidak ditemukan');

    try {
      const response = await apiCall('/donations', {
        method: 'POST',
        body: JSON.stringify({
          relawan_id: relawanId,
          ...data
        })
      });

      // Refresh list
      await fetchDonations();

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getTotalDonations = () => {
    return donations
      .filter(d => d.type === 'incoming')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getTotalDistributed = () => {
    return donations
      .filter(d => d.type === 'outgoing')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getDonationsByCategory = () => {
    const byCategory: Record<string, number> = {
      zakat: 0,
      infaq: 0,
      sedekah: 0,
      wakaf: 0
    };

    donations
      .filter(d => d.type === 'incoming')
      .forEach(d => {
        byCategory[d.category] = (byCategory[d.category] || 0) + d.amount;
      });

    return byCategory;
  };

  return {
    donations,
    loading,
    error,
    addDonation,
    getTotalDonations,
    getTotalDistributed,
    getDonationsByCategory,
    refetch: fetchDonations
  };
}

// Hook for donations by muzakki
export function useMuzakkiDonations(muzakkiId: string | null) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    if (!muzakkiId) {
      console.log('⏭️ Skipping fetchDonations: No muzakki ID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching donations for muzakki:', muzakkiId);
      setLoading(true);
      const response = await apiCall(`/donations?muzakki_id=${muzakkiId}`);
      console.log('✅ Muzakki donations fetched:', response.data?.length || 0, 'items');
      setDonations(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data donasi';
      setError(errorMessage);
      console.error('❌ Error fetching donations:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [muzakkiId]);

  return {
    donations,
    loading,
    error,
    refetch: fetchDonations
  };
}