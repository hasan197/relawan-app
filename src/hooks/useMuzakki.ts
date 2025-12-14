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
      const errorMessage = err.message === 'SERVER_UNAVAILABLE' 
        ? 'Server belum aktif. Mohon deploy Supabase Edge Function terlebih dahulu.'
        : (err.message || 'Gagal memuat data muzakki');
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
    category?: 'muzakki' | 'donatur' | 'prospek';
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
          category: data.category || 'prospek', // Default to 'prospek' if not provided
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

// Hook for single muzakki detail
export function useSingleMuzakki(muzakkiId: string | null) {
  const [muzakki, setMuzakki] = useState<Muzakki | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMuzakki = async () => {
    if (!muzakkiId) {
      console.log('⏭️ Skipping fetchMuzakki: No muzakki ID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching single muzakki:', muzakkiId);
      setLoading(true);
      const response = await apiCall(`/muzakki/${muzakkiId}`);
      console.log('✅ Muzakki fetched:', response.data);
      setMuzakki(response.data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data muzakki';
      setError(errorMessage);
      console.error('❌ Error fetching muzakki:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuzakki();
  }, [muzakkiId]);

  return {
    muzakki,
    loading,
    error,
    refetch: fetchMuzakki
  };
}

// Hook for muzakki communications
interface Communication {
  id: string;
  muzakki_id: string;
  relawan_id: string;
  type: 'call' | 'whatsapp' | 'meeting' | 'other';
  notes: string;
  created_at: string;
}

export function useCommunications(muzakkiId: string | null) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunications = async () => {
    if (!muzakkiId) {
      console.log('⏭️ Skipping fetchCommunications: No muzakki ID');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching communications for muzakki:', muzakkiId);
      setLoading(true);
      const response = await apiCall(`/communications/${muzakkiId}`);
      console.log('✅ Communications fetched:', response.data?.length || 0, 'items');
      setCommunications(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat riwayat komunikasi';
      setError(errorMessage);
      console.error('❌ Error fetching communications:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [muzakkiId]);

  const addCommunication = async (
    data: {
      type: 'call' | 'whatsapp' | 'meeting' | 'other';
      notes: string;
    },
    relawanId: string
  ) => {
    if (!muzakkiId) throw new Error('Muzakki ID tidak ditemukan');
    if (!relawanId) throw new Error('Relawan ID tidak ditemukan');

    try {
      const response = await apiCall('/communications', {
        method: 'POST',
        body: JSON.stringify({
          relawan_id: relawanId,
          muzakki_id: muzakkiId,
          ...data
        })
      });

      await fetchCommunications();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    communications,
    loading,
    error,
    addCommunication,
    refetch: fetchCommunications
  };
}

// Hook for updating muzakki
export function useUpdateMuzakki() {
  const [updating, setUpdating] = useState(false);

  const updateMuzakki = async (muzakkiId: string, updates: Partial<Muzakki>) => {
    setUpdating(true);
    try {
      const response = await apiCall(`/muzakki/${muzakkiId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateMuzakki,
    updating
  };
}

// Hook for adding communication
export function useAddCommunication() {
  const [adding, setAdding] = useState(false);

  const addCommunication = async (
    muzakkiId: string,
    relawanId: string,
    data: {
      type: 'call' | 'whatsapp' | 'meeting' | 'other';
      notes: string;
    }
  ) => {
    setAdding(true);
    try {
      if (!relawanId) {
        throw new Error('Relawan ID tidak ditemukan');
      }
      
      const response = await apiCall('/communications', {
        method: 'POST',
        body: JSON.stringify({
          relawan_id: relawanId,
          muzakki_id: muzakkiId,
          ...data
        })
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setAdding(false);
    }
  };

  return {
    addCommunication,
    adding
  };
}

// Hook for deleting muzakki
export function useDeleteMuzakki() {
  const [deleting, setDeleting] = useState(false);

  const deleteMuzakki = async (muzakkiId: string) => {
    setDeleting(true);
    try {
      await apiCall(`/muzakki/${muzakkiId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteMuzakki,
    deleting
  };
}

// Hook for adding muzakki
export function useAddMuzakki() {
  const [adding, setAdding] = useState(false);

  const addMuzakki = async (
    relawanId: string,
    data: {
      name: string;
      phone: string;
      city?: string;
      notes?: string;
      status?: 'baru' | 'follow-up' | 'donasi';
      category: 'muzakki' | 'donatur' | 'prospek';
    }
  ) => {
    setAdding(true);
    try {
      if (!relawanId) {
        throw new Error('Relawan ID tidak ditemukan');
      }
      
      const response = await apiCall('/muzakki', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          city: data.city,
          notes: data.notes,
          category: data.category,
          status: data.status
        })
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setAdding(false);
    }
  };

  return {
    addMuzakki,
    adding
  };
}