import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../lib/supabase';

export interface ReguMember {
  id: string;
  full_name: string;
  phone: string;
  total_donations?: number;
  total_muzakki?: number;
  joined_at: string;
}

export interface Regu {
  id: string;
  name: string;
  pembimbing_name: string;
  pembimbing_id?: string;
  member_count: number;
  total_donations: number;
  target_amount?: number;
  join_code?: string;
  created_at: string;
}

export function useRegu(reguId: string | null) {
  const [regu, setRegu] = useState<Regu | null>(null);
  const [members, setMembers] = useState<ReguMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualReguId, setActualReguId] = useState<string | null>(null);

  const fetchRegu = useCallback(async () => {
    if (!reguId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching regu:', reguId);
      
      // Try to fetch by ID first
      let response;
      try {
        response = await apiCall(`/regu/${reguId}`);
      } catch (err: any) {
        // If 404 and reguId looks like a code (short string), try by-code endpoint
        if (err.message?.includes('tidak ditemukan') && reguId.length <= 8) {
          console.log('🔄 Regu not found by ID, trying by join code:', reguId);
          response = await apiCall(`/regu/by-code/${reguId}`);
        } else {
          throw err;
        }
      }
      
      console.log('✅ Regu fetched:', response.data);
      setRegu(response.data);
      setActualReguId(response.data.id); // Save actual regu ID
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data regu';
      setError(errorMessage);
      console.error('❌ Error fetching regu:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [reguId]);

  const fetchMembers = useCallback(async () => {
    // Wait until we have actual regu ID
    const idToUse = actualReguId || reguId;
    
    if (!idToUse) {
      return;
    }

    try {
      console.log('🔄 Fetching regu members for:', idToUse);
      const response = await apiCall(`/regu/${idToUse}/members`);
      console.log('✅ Regu members fetched:', response.data?.length || 0);
      setMembers(response.data || []);
    } catch (err: any) {
      console.error('❌ Error fetching regu members:', err.message);
    }
  }, [reguId, actualReguId]);

  useEffect(() => {
    fetchRegu();
  }, [fetchRegu]);

  useEffect(() => {
    // Fetch members after regu is loaded
    if (actualReguId) {
      fetchMembers();
    }
  }, [actualReguId, fetchMembers]);

  const addMember = async (userId: string, fullName: string, phone: string) => {
    if (!reguId) {
      throw new Error('Regu ID tidak ditemukan');
    }

    try {
      console.log('📤 Adding member to regu:', { reguId, userId, fullName });
      const response = await apiCall(`/regu/${reguId}/members`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          full_name: fullName,
          phone: phone
        })
      });
      console.log('✅ Member added to regu');
      await fetchMembers();
      await fetchRegu();
      return response.data;
    } catch (error: any) {
      console.error('❌ Error adding member to regu:', error.message);
      throw error;
    }
  };

  return {
    regu,
    members,
    loading,
    error,
    addMember,
    refetch: () => {
      fetchRegu();
      fetchMembers();
    }
  };
}

// Hook untuk mendapatkan semua regu (untuk dropdown di register)
export function useAllRegus() {
  const [regus, setRegus] = useState<Regu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegus = useCallback(async () => {
    try {
      console.log('🔄 Fetching all regus...');
      // Backend endpoint untuk get all regus
      const response = await apiCall('/regus');
      console.log('✅ All regus fetched:', response.data?.length || 0);
      setRegus(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat daftar regu';
      setError(errorMessage);
      console.error('❌ Error fetching regus:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegus();
  }, [fetchRegus]);

  return {
    regus,
    loading,
    error,
    refetch: fetchRegus
  };
}

// Hook untuk membuat regu baru (pembimbing only)
export function useCreateRegu() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRegu = async (pembimbingId: string, name: string, targetAmount?: number) => {
    setCreating(true);
    setError(null);

    try {
      console.log('📝 Creating new regu:', { pembimbingId, name, targetAmount });
      
      const response = await apiCall('/regus', {
        method: 'POST',
        body: JSON.stringify({
          pembimbing_id: pembimbingId,
          name: name,
          target_amount: targetAmount || 60000000
        })
      });

      console.log('✅ Regu created successfully:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal membuat regu';
      setError(errorMessage);
      console.error('❌ Error creating regu:', errorMessage);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return {
    createRegu,
    creating,
    error
  };
}

// Hook untuk mendapatkan regu-regu milik pembimbing tertentu
export function usePembimbingRegus(pembimbingId: string | null) {
  const [regus, setRegus] = useState<Regu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPembimbingRegus = useCallback(async () => {
    if (!pembimbingId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching regus for pembimbing:', pembimbingId);
      const response = await apiCall('/regus');
      
      // Filter regu yang pembimbing_id nya sesuai
      const pembimbingRegus = (response.data || []).filter(
        (regu: Regu) => regu.pembimbing_id === pembimbingId
      );
      
      console.log('✅ Pembimbing regus fetched:', pembimbingRegus.length);
      setRegus(pembimbingRegus);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat daftar regu';
      setError(errorMessage);
      console.error('❌ Error fetching pembimbing regus:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pembimbingId]);

  useEffect(() => {
    fetchPembimbingRegus();
  }, [fetchPembimbingRegus]);

  return {
    regus,
    loading,
    error,
    refetch: fetchPembimbingRegus
  };
}