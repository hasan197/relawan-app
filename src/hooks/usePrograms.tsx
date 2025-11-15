import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface Program {
  id: string;
  title: string;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf';
  description: string;
  target: number;
  collected: number;
  contributors: number;
  location: string;
  endDate: string;
  image: string;
  created_at: string;
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f/programs`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch programs');
      }

      setPrograms(data.data || []);
    } catch (err: any) {
      console.error('Fetch programs error:', err);
      setError(err.message);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return { programs, loading, error, refetch: fetchPrograms };
}

// Hook for single program detail
export function useSingleProgram(programId: string | null) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgram = async () => {
    if (!programId) {
      console.log('⏭️ Skipping fetchProgram: No program ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f/programs/${programId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch program');
      }

      setProgram(data.data || null);
    } catch (err: any) {
      console.error('Fetch program error:', err);
      setError(err.message);
      setProgram(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgram();
  }, [programId]);

  return { program, loading, error, refetch: fetchProgram };
}