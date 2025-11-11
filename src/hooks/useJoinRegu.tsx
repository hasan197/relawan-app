import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface JoinReguResult {
  success: boolean;
  message: string;
  data?: any;
}

export function useJoinRegu() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinRegu = async (userId: string, joinCode: string): Promise<JoinReguResult> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Attempting to join regu:', { userId, joinCode });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f689ca3f/regu/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            user_id: userId,
            join_code: joinCode.toUpperCase().trim()
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Join regu error:', result);
        setError(result.error || 'Gagal bergabung dengan regu');
        return {
          success: false,
          message: result.error || 'Gagal bergabung dengan regu'
        };
      }

      console.log('✅ Successfully joined regu:', result);

      return {
        success: true,
        message: result.message,
        data: result.data
      };
    } catch (err: any) {
      console.error('❌ Join regu exception:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat bergabung';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    joinRegu,
    loading,
    error
  };
}
