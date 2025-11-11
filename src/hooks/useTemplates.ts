import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../lib/supabase';

export interface Template {
  id: string;
  category: string;
  title: string;
  message: string;
  created_at: string;
  created_by?: string;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      console.log('🔄 Fetching templates...');
      const response = await apiCall('/templates');
      console.log('✅ Templates fetched:', response.data?.length || 0);
      setTemplates(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat template';
      setError(errorMessage);
      console.error('❌ Error fetching templates:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const addTemplate = async (data: Omit<Template, 'id' | 'created_at'>) => {
    try {
      console.log('📤 Adding template:', data);
      const response = await apiCall('/templates', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log('✅ Template added:', response.data);
      await fetchTemplates();
      return response.data;
    } catch (error: any) {
      console.error('❌ Error adding template:', error.message);
      throw error;
    }
  };

  return {
    templates,
    loading,
    error,
    addTemplate,
    refetch: fetchTemplates
  };
}
