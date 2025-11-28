import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface ReguMember {
  id: string;
  full_name: string;
  phone: string;
  city?: string;
  regu_id: string;
  role: string;
  status?: 'online' | 'offline';
}

export function useReguMembers(reguId: string | null | undefined) {
  const [members, setMembers] = useState<ReguMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!reguId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f/regu/${reguId}/members`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch members');
      }

      // Add mock status (in real app, this would come from presence system)
      const membersWithStatus = data.data.map((member: ReguMember, index: number) => ({
        ...member,
        status: index % 3 === 0 ? 'offline' : 'online' // Mock: every 3rd member is offline
      }));

      setMembers(membersWithStatus);
    } catch (err: any) {
      console.error('Fetch members error:', err);
      setError(err.message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [reguId]);

  return { members, loading, error, refetch: fetchMembers };
}
