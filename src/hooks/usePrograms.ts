import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../lib/supabase';

export interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  target_amount?: number;
  collected_amount?: number;
  url?: string;
  created_at: string;
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    try {
      console.log('🔄 Fetching programs...');
      const response = await apiCall('/programs');
      console.log('✅ Programs fetched:', response.data?.length || 0);
      setPrograms(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat program';
      setError(errorMessage);
      console.error('❌ Error fetching programs:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const getProgramById = async (id: string) => {
    try {
      console.log('🔄 Fetching program by ID:', id);
      const response = await apiCall(`/programs/${id}`);
      console.log('✅ Program fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching program:', error.message);
      throw error;
    }
  };

  const addProgram = async (data: Omit<Program, 'id' | 'created_at'>) => {
    try {
      console.log('📤 Adding program:', data);
      const response = await apiCall('/programs', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log('✅ Program added:', response.data);
      await fetchPrograms();
      return response.data;
    } catch (error: any) {
      console.error('❌ Error adding program:', error.message);
      throw error;
    }
  };

  return {
    programs,
    loading,
    error,
    getProgramById,
    addProgram,
    refetch: fetchPrograms
  };
}
