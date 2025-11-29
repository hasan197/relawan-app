import { useState, useCallback } from 'react';
import { apiCall } from '../lib/supabase';

type DataType = 'users' | 'regu' | 'muzakki' | 'donasi' | 'program' | 'template';

interface UseAdminDataReturn {
  data: any[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  createItem: (itemData: any) => Promise<boolean>;
  updateItem: (id: string, itemData: any) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
}

export function useAdminData(type: DataType): UseAdminDataReturn {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEndpoint = useCallback((type: DataType, action: 'list' | 'create' | 'update' | 'delete' = 'list', id?: string) => {
    switch (type) {
      case 'users':
        if (action === 'list') return '/admin/users';
        if (action === 'create') return '/admin/users';
        if (action === 'update') return `/admin/users/${id}`;
        if (action === 'delete') return `/admin/users/${id}`;
        break;
      case 'regu':
        if (action === 'list') return '/regu';
        if (action === 'create') return '/admin/regu';
        if (action === 'update') return `/admin/regu/${id}`;
        if (action === 'delete') return `/regu/${id}`;
        break;
      case 'muzakki':
        if (action === 'list') return '/muzakki?all=true';
        if (action === 'create') return '/muzakki';
        if (action === 'update') return `/muzakki/${id}`;
        if (action === 'delete') return `/muzakki/${id}`;
        break;
      case 'donasi':
        if (action === 'list') return '/donations?admin=true';
        if (action === 'create') return '/admin/donations';
        if (action === 'update') return `/admin/donations/${id}`;
        if (action === 'delete') return `/donations/${id}`;
        break;
      case 'program':
        if (action === 'list') return '/programs';
        if (action === 'create') return '/admin/programs';
        if (action === 'update') return `/admin/programs/${id}`;
        if (action === 'delete') return `/programs/${id}`;
        break;
      case 'template':
        if (action === 'list') return '/templates?all=true';
        if (action === 'create') return '/admin/templates';
        if (action === 'update') return `/admin/templates/${id}`;
        if (action === 'delete') return `/templates/${id}`;
        break;
    }
    return '';
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = getEndpoint(type, 'list');
      const response = await apiCall(endpoint);
      
      // Handle different response formats from existing backend
      if (response.success || response.data) {
        setData(response.data || []);
      } else {
        // For endpoints that return direct array
        setData(Array.isArray(response) ? response : []);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [type, getEndpoint]);

  const createItem = useCallback(async (itemData: any): Promise<boolean> => {
    try {
      const endpoint = getEndpoint(type, 'create');
      const response = await apiCall(endpoint, 'POST', itemData);
      
      // Handle different response formats
      if (response.success || response.data) {
        // Update local state to add the new item
        if (response.data) {
          setData(prev => [...prev, response.data]);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Create error:', err);
      return false;
    }
  }, [type, getEndpoint]);

  const updateItem = useCallback(async (id: string, itemData: any): Promise<boolean> => {
    try {
      const endpoint = getEndpoint(type, 'update', id);
      const response = await apiCall(endpoint, 'PUT', itemData);
      
      // Handle different response formats
      if (response.success || response.data) {
        // Update local state with the updated item
        if (response.data) {
          setData(prev => prev.map(item => item.id === id ? response.data : item));
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Update error:', err);
      return false;
    }
  }, [type, getEndpoint]);

  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      const endpoint = getEndpoint(type, 'delete', id);
      const response = await apiCall(endpoint, 'DELETE');
      
      // Handle different response formats
      if (response.success || response.message) {
        // Update local state to remove the deleted item
        setData(prev => prev.filter((item: any) => item.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Delete error:', err);
      return false;
    }
  }, [type, getEndpoint]);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
}
