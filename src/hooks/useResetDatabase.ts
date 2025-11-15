import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function useResetDatabase() {
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetDatabase = async () => {
    try {
      setResetting(true);
      setSuccess(false);
      
      // Call your Supabase function or API endpoint to reset the database
      const { error } = await supabase.rpc('reset_database');
      
      if (error) throw error;
      
      setSuccess(true);
      toast.success('Database berhasil direset');
    } catch (error) {
      console.error('Error resetting database:', error);
      toast.error('Gagal mereset database');
    } finally {
      setResetting(false);
    }
  };

  return {
    resetDatabase,
    resetting,
    success
  };
}
