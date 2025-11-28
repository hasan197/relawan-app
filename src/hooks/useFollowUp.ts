import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface FollowUpItem {
  id: string;
  muzakki_id: string;
  muzakki_name: string;
  muzakki_phone: string;
  relawan_id: string;
  last_contact: string;
  days_since_contact: number;
  priority: 'high' | 'medium' | 'low';
  status: 'baru' | 'follow-up' | 'donasi';
  notes: string;
}

export function useFollowUp(relawanId: string | null) {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowUps = async () => {
    if (!relawanId) {
      console.log('⏭️ Skipping fetchFollowUps: No relawan ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all muzakki for this relawan
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f/muzakki?relawan_id=${relawanId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch follow-ups');
      }

      const muzakkiList = data.data || [];

      // Transform muzakki into follow-up items with priority calculation
      const followUpItems: FollowUpItem[] = muzakkiList.map((m: any) => {
        const lastContact = new Date(m.last_contact || m.created_at);
        const now = new Date();
        const daysSince = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));

        // Calculate priority based on days since last contact and status
        let priority: 'high' | 'medium' | 'low' = 'low';
        if (daysSince > 7 || m.status === 'follow-up') {
          priority = 'high';
        } else if (daysSince > 3 || m.status === 'baru') {
          priority = 'medium';
        }

        return {
          id: m.id,
          muzakki_id: m.id,
          muzakki_name: m.name,
          muzakki_phone: m.phone,
          relawan_id: m.relawan_id,
          last_contact: m.last_contact || m.created_at,
          days_since_contact: daysSince,
          priority: priority,
          status: m.status || 'baru',
          notes: m.notes || ''
        };
      });

      // Sort by priority and days since contact
      followUpItems.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return b.days_since_contact - a.days_since_contact;
      });

      setFollowUps(followUpItems);
    } catch (err: any) {
      console.error('Fetch follow-ups error:', err);
      setError(err.message);
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [relawanId]);

  return { followUps, loading, error, refetch: fetchFollowUps };
}
