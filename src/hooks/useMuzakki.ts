import { useState, useEffect } from 'react';
import { apiCall } from '../lib/supabase';

interface Muzakki {
  id: string;
  relawan_id: string;
  name: string;
  phone: string;
  city: string;
  notes: string;
  status: 'baru' | 'follow-up' | 'donasi';
  created_at: string;
  last_contact: string;
}

export function useMuzakki(relawanId: string | null) {
  const [muzakkiList, setMuzakkiList] = useState<Muzakki[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMuzakki = async () => {
    if (!relawanId) {
      console.log('⏭️ Skipping fetchMuzakki: No relawan ID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching muzakki for relawan:', relawanId);
      setLoading(true);
      const response = await apiCall(`/muzakki?relawan_id=${relawanId}`);
      console.log('✅ Muzakki fetched:', response.data?.length || 0, 'items');
      setMuzakkiList(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data muzakki';
      setError(errorMessage);
      console.error('❌ Error fetching muzakki:', {
        relawanId,
        error: errorMessage,
        fullError: err
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuzakki();
  }, [relawanId]);

  const addMuzakki = async (data: {
    name: string;
    phone: string;
    city?: string;
    notes?: string;
    status?: 'baru' | 'follow-up' | 'donasi';
  }) => {
    console.log('🔍 addMuzakki called with data:', data);
    console.log('🔍 Current relawanId:', relawanId);
    
    if (!relawanId) {
      console.error('❌ Error: Relawan ID tidak ditemukan!');
      console.error('Debug info:', {
        relawanId,
        typeOfRelawanId: typeof relawanId,
        isNull: relawanId === null,
        isUndefined: relawanId === undefined
      });
      throw new Error('Relawan ID tidak ditemukan. Silakan logout dan login kembali.');
    }

    try {
      console.log('📤 Sending API request with relawan_id:', relawanId);
      const response = await apiCall('/muzakki', {
        method: 'POST',
        body: JSON.stringify({
          relawan_id: relawanId,
          ...data
        })
      });

      console.log('✅ Muzakki added successfully:', response.data);

      // Refresh list
      await fetchMuzakki();

      return response.data;
    } catch (error: any) {
      console.error('❌ Error adding muzakki:', {
        error: error.message,
        fullError: error,
        relawanId
      });
      throw error;
    }
  };

  const updateMuzakki = async (muzakkiId: string, updates: Partial<Muzakki>) => {
    if (!relawanId) throw new Error('Relawan ID tidak ditemukan');

    try {
      const response = await apiCall(`/muzakki/${muzakkiId}`, {
        method: 'PUT',
        body: JSON.stringify({
          relawan_id: relawanId,
          ...updates
        })
      });

      // Refresh list
      await fetchMuzakki();

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMuzakki = async (muzakkiId: string) => {
    if (!relawanId) throw new Error('Relawan ID tidak ditemukan');

    try {
      await apiCall(`/muzakki/${muzakkiId}?relawan_id=${relawanId}`, {
        method: 'DELETE'
      });

      // Refresh list
      await fetchMuzakki();
    } catch (error) {
      throw error;
    }
  };

  return {
    muzakkiList,
    loading,
    error,
    addMuzakki,
    updateMuzakki,
    deleteMuzakki,
    refetch: fetchMuzakki
  };
}